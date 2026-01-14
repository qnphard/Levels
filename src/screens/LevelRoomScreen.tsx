import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Platform,
    Animated,
    StatusBar,
    BackHandler,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLevelById } from '../data/levels';
import { useThemeColors, typography, spacing, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LEVEL_DOSSIER_DATA } from '../data/dossierData';
import { RoomBackground } from '../components/RoomBackground';
import { AtmosphereProvider, useAtmosphere, AtmosphereState, DepthState } from '../context/AtmosphereContext';
import { DossierArticle, CategoryArticles } from '../types';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type HotspotType = 'felt-sense' | 'purpose' | 'traps' | 'exits' | 'practices';

// --- Sub-Components for Depth Layers ---

// 1. HUB VIEW: The Main Room with Arc Hotspots
const HubView: React.FC<{
    isActive: boolean;
    onOpenHotspot: (type: HotspotType) => void;
    opacity: Animated.Value;
}> = ({ isActive, onOpenHotspot, opacity }) => {
    const theme = useThemeColors();

    const renderHotspot = (type: HotspotType, icon: keyof typeof Ionicons.glyphMap, top: number, align: 'left' | 'right' | 'center', label: string) => {
        const positionStyle: any = { top: `${top}%` };

        if (align === 'center') {
            positionStyle.left = '50%';
            positionStyle.transform = [{ translateX: -30 }]; // Half of width (60)
        } else if (align === 'left') {
            positionStyle.left = '18%';
        } else if (align === 'right') {
            positionStyle.right = '18%';
        }

        return (
            <Pressable
                key={type}
                onPress={() => onOpenHotspot(type)}
                style={[styles.hotspot, positionStyle]}
            >
                <View style={[styles.hotspotIconWrap, {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(255,255,255,0.35)'
                }]}>
                    <Ionicons name={icon} size={28} color="white" />
                </View>
                <Text style={[styles.hotspotLabel, { color: 'white' }]}>{label}</Text>
            </Pressable>
        );
    };

    const zIndex = isActive ? 10 : 1;

    return (
        <Animated.View
            style={[styles.layerContainer, { opacity, zIndex }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            <View style={styles.hotspotsLayer}>
                {/* Diamond/Cross Constellation Layout */}
                {renderHotspot('exits', 'exit-outline', 22, 'center', 'Exits')}

                {renderHotspot('purpose', 'shield-outline', 42, 'left', 'Purpose')}
                {renderHotspot('felt-sense', 'body-outline', 42, 'right', 'Felt Sense')}

                {renderHotspot('traps', 'warning-outline', 62, 'center', 'Traps')}

                {renderHotspot('practices', 'headset-outline', 85, 'center', 'Practices')}
            </View>
        </Animated.View>
    );
};

// 2. REALM VIEW: The "Sub-Space" showing Floating Artifacts
const RealmView: React.FC<{
    isActive: boolean;
    data: any;
    onSelectChip: (article: DossierArticle) => void;
    opacity: Animated.Value;
    onBack: () => void;
}> = ({ isActive, data, onSelectChip, opacity, onBack }) => {
    const theme = useThemeColors();
    if (!data) return null;

    const zIndex = isActive ? 10 : 2;

    return (
        <Animated.View
            style={[styles.layerContainer, {
                opacity,
                justifyContent: 'center',
                padding: spacing.xl,
                zIndex,
                backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)'
            }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            <Pressable onPress={onBack} style={styles.backButtonRelative}>
                <Ionicons name="arrow-back" size={24} color={theme.mode === 'dark' ? "white" : theme.primary} />
                <Text style={[styles.backText, { color: theme.mode === 'dark' ? "white" : theme.textPrimary }]}>Back to Room</Text>
            </Pressable>

            <Text style={[styles.realmTitle, { color: theme.mode === 'dark' ? theme.white : theme.textPrimary }]}>{data.title}</Text>
            <Text style={[styles.realmBody, { color: theme.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.textSecondary }]}>{data.body}</Text>

            <View style={styles.artifactGrid}>
                {data.chips?.map((chip: any, i: number) => (
                    <Pressable
                        key={i}
                        onPress={() => onSelectChip(chip)}
                        style={[styles.artifactOrb, {
                            borderColor: theme.primary,
                            backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)'
                        }]}
                    >
                        <Text style={[styles.artifactLabel, { color: theme.mode === 'dark' ? theme.white : theme.textPrimary }]}>{chip.label}</Text>
                    </Pressable>
                ))}
            </View>
        </Animated.View>
    );
};

// 3. INSIGHT VIEW: The Detailed "Room" Article
const InsightView: React.FC<{
    isActive: boolean;
    article: DossierArticle;
    onBack: () => void;
    onTravel: (target: string, hotspot?: HotspotType) => void;
    opacity: Animated.Value;
}> = ({ isActive, article, onBack, onTravel, opacity }) => {
    const theme = useThemeColors();
    const [expandedSections, setExpandedSections] = useState<number[]>([]);

    useEffect(() => {
        // Automatically expand "defaultExpanded" sections
        const defaultExpanded = article.sections
            .map((s, i) => s.defaultExpanded ? i : -1)
            .filter(i => i !== -1);
        setExpandedSections(defaultExpanded);
    }, [article]);

    const toggleSection = (index: number) => {
        setExpandedSections(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const zIndex = isActive ? 10 : 3;

    return (
        <Animated.View
            style={[styles.layerContainer, {
                opacity,
                paddingHorizontal: spacing.xl,
                zIndex,
                backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)'
            }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color={theme.mode === 'dark' ? "white" : theme.primary} />
                    <Text style={[styles.backText, { color: theme.mode === 'dark' ? "white" : theme.textPrimary }]}>Return</Text>
                </Pressable>

                <Text style={[styles.insightTitle, { color: theme.primary, textAlign: 'left' }]}>{article.title}</Text>
                <Text style={[styles.insightSpine, { color: theme.mode === 'dark' ? 'rgba(255,255,255,0.9)' : theme.textPrimary }]}>{article.spineBody}</Text>

                <View style={styles.chamberList}>
                    {article.sections.map((section, i) => {
                        const isExpanded = expandedSections.includes(i);

                        // Basic markdown-ish formatter for bolding
                        const renderFormattedBody = (text: string) => {
                            // First, replace literal \n strings with real newlines just in case they are in the data
                            const processedText = text.replace(/\\n/g, '\n');
                            const parts = processedText.split(/(\*\*.*?\*\*)/g);
                            return parts.map((part, index) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                        <Text key={index} style={{ fontWeight: '800', color: theme.white }}>
                                            {part.slice(2, -2)}
                                        </Text>
                                    );
                                }
                                return part;
                            });
                        };

                        return (
                            <View key={i} style={[styles.chamberCard, { borderColor: isExpanded ? theme.primary : 'rgba(255,255,255,0.1)' }]}>
                                <Pressable onPress={() => toggleSection(i)} style={styles.chamberHeader}>
                                    <Text style={[styles.chamberTitle, { color: isExpanded ? theme.primary : (theme.mode === 'dark' ? theme.white : theme.textPrimary) }]}>
                                        {section.title}
                                    </Text>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={isExpanded ? theme.primary : (theme.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)')}
                                    />
                                </Pressable>
                                {isExpanded && (
                                    <View style={[styles.chamberBody, { borderTopColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                        <Text style={[styles.chamberText, { color: theme.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.textSecondary }]}>
                                            {renderFormattedBody(section.body)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {article.nextDoors && article.nextDoors.length > 0 && (
                    <View style={styles.nextDoorsContainer}>
                        <Text style={styles.nextDoorsLabel}>Go Deeper</Text>
                        {article.nextDoors.map((door, i) => (
                            <Pressable
                                key={i}
                                onPress={() => onTravel(door.targetRoom, door.hotspot as HotspotType)}
                                style={[styles.doorButton, {
                                    borderColor: theme.primary,
                                    backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                                }]}
                            >
                                <Text style={[styles.doorText, { color: theme.mode === 'dark' ? theme.white : theme.textPrimary }]}>{door.label}</Text>
                                <Ionicons name="arrow-forward" size={18} color={theme.primary} />
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </Animated.View>
    );
};


// --- Main Screen ---

function RoomContent() {
    const route = useRoute<any>();
    const navigation = useNavigation<NavigationProp>();

    // Atmosphere & Depth Context
    const {
        setAtmosphere,
        depth,
        setDepth,
        zoomLevel,
        vignetteIntensity,
        tintColor,
        lightingOpacity
    } = useAtmosphere();

    const { levelId } = route.params;
    const level = useMemo(() => getLevelById(levelId), [levelId]);
    const theme = useThemeColors();

    // Local Data State
    const [activeHotspot, setActiveHotspot] = useState<HotspotType | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<DossierArticle | null>(null);

    // Layer Opacity Animations
    const hubOpacity = useRef(new Animated.Value(1)).current;
    const realmOpacity = useRef(new Animated.Value(0)).current;
    const insightOpacity = useRef(new Animated.Value(0)).current;

    // Orchestrate Transitions based on Depth
    useEffect(() => {
        let toHub = 0, toRealm = 0, toInsight = 0;

        switch (depth) {
            case 'HUB':
                toHub = 1;
                break;
            case 'REALM':
                toRealm = 1;
                break;
            case 'INSIGHT':
                toInsight = 1;
                break;
        }

        Animated.parallel([
            Animated.timing(hubOpacity, { toValue: toHub, duration: 800, useNativeDriver: true }),
            Animated.timing(realmOpacity, { toValue: toRealm, duration: 800, useNativeDriver: true }),
            Animated.timing(insightOpacity, { toValue: toInsight, duration: 800, useNativeDriver: true }),
        ]).start();

    }, [depth]);

    // Handle Back Press
    useEffect(() => {
        const onBack = () => {
            if (depth === 'INSIGHT') {
                handleBack();
                return true;
            } else if (depth === 'REALM') {
                handleBack();
                return true;
            } else if (depth === 'HUB') {
                navigation.goBack();
                return true;
            }
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
        return () => subscription.remove();
    }, [depth, activeHotspot, selectedArticle, navigation]);

    // Force animation state sync if somehow desynced
    useEffect(() => {
        if (depth === 'HUB') {
            hubOpacity.setValue(1);
            realmOpacity.setValue(0);
            insightOpacity.setValue(0);
        }
    }, [depth]);


    if (!level) return null;

    // --- Actions ---
    const handleOpenHotspot = (type: HotspotType) => {
        const dossier = LEVEL_DOSSIER_DATA[level.id.toLowerCase()];

        // Custom flow: Felt Sense and Purpose go directly to Insight if they are articles
        const key = type === 'felt-sense' ? 'feltSense' : type;
        if ((key === 'feltSense' || key === 'purpose') && dossier?.[key as keyof CategoryArticles]) {
            const item = dossier[key as keyof CategoryArticles];
            if (item && 'sections' in item) {
                setSelectedArticle(item as DossierArticle);
                setDepth('INSIGHT');
                setAtmosphere(type as AtmosphereState);
                return;
            }
        }

        setActiveHotspot(type);
        setAtmosphere(type as AtmosphereState);
        setDepth('REALM');
    };

    const handleSelectArticle = (article: DossierArticle) => {
        setSelectedArticle(article);
        setDepth('INSIGHT');
    };

    const handleBack = () => {
        if (depth === 'INSIGHT') {
            const goToHub = activeHotspot === 'felt-sense' || !activeHotspot;
            setDepth(goToHub ? 'HUB' : 'REALM');

            if (goToHub) {
                setAtmosphere('neutral');
                setActiveHotspot(null);
            }

            // Delay clearing the article to allow fade-out animation
            setTimeout(() => {
                setSelectedArticle(null);
            }, 800);
        } else if (depth === 'REALM') {
            setDepth('HUB');
            setAtmosphere('neutral');
            setActiveHotspot(null);
        }
    };

    const handleTravel = (target: string, hotspot?: HotspotType) => {
        if (target === 'HUB') {
            // Immediate state shifts
            setDepth('HUB');
            setAtmosphere('neutral');
            setActiveHotspot(null);

            // If we are NOT going to a specific hotspot, clear the article after fade
            if (!hotspot) {
                setTimeout(() => {
                    setSelectedArticle(null);
                }, 800);
            } else {
                // If we ARE going to a hotspot, clear current article IMMEDIATELY 
                // to avoid the clearing timeout fighting with the new content
                setSelectedArticle(null);

                // Then open the new hotspot after a significant delay (let zoom out finish)
                setTimeout(() => {
                    handleOpenHotspot(hotspot);
                }, 1000);
            }
        }
    };

    // --- Data Helpers ---
    const getRealmData = () => {
        if (!activeHotspot) return null;
        const dossier = LEVEL_DOSSIER_DATA[level.id.toLowerCase()];
        if (!dossier) return null;

        switch (activeHotspot) {
            case 'purpose': return { ...dossier.purpose, body: 'The deep "why" of this state.' };
            case 'traps': return { title: 'The Ego Trap', body: dossier.traps.body, chips: dossier.traps.chips };
            case 'exits': return { title: 'The Way Through', body: dossier.exits.body, chips: dossier.exits.chips };
            case 'practices': return {
                title: 'Practices', body: 'Direct somatic exercises.', chips: [
                    { label: 'Body Scan', title: 'Body Scan', spineBody: 'A simple scan.', sections: [{ title: 'Core', body: 'Scan.', importance: 'core', defaultExpanded: true }] }
                ]
            };
            default: return null;
        }
    };
    const realmData = getRealmData();


    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Background with Zoom */}
            <View style={StyleSheet.absoluteFill}>
                {level?.layers ? (
                    <RoomBackground layers={level.layers} zoomLevel={zoomLevel} />
                ) : (
                    <RoomBackground
                        layers={level.level >= 200 ? {
                            far: require('../assets/images/default/light/far.png'),
                            mid: require('../assets/images/default/light/mid.png'),
                            fg: undefined as any,
                        } : {
                            far: require('../assets/images/default/far.png'),
                            mid: require('../assets/images/default/mid.png'),
                            fg: undefined as any,
                        }}
                        zoomLevel={zoomLevel}
                    />
                )}
            </View>

            {/* Atmosphere Effects */}
            <Animated.View style={[StyleSheet.absoluteFill, {
                backgroundColor: '#000',
                opacity: vignetteIntensity
            }]} pointerEvents="none" />

            {/* Programmatic Atmosphere Overlay for levels without FG */}
            {!level?.layers?.fg && (
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: Animated.multiply(lightingOpacity, 0.4) }]} pointerEvents="none">
                    <LinearGradient
                        colors={[level.color + '22', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            )}

            {/* 3 Layers Stacked */}
            <HubView
                isActive={depth === 'HUB'}
                onOpenHotspot={handleOpenHotspot}
                opacity={hubOpacity}
            />

            <RealmView
                isActive={depth === 'REALM'}
                data={realmData}
                onSelectChip={handleSelectArticle}
                opacity={realmOpacity}
                onBack={handleBack}
            />

            {selectedArticle && (
                <InsightView
                    isActive={depth === 'INSIGHT'}
                    article={selectedArticle}
                    opacity={insightOpacity}
                    onBack={handleBack}
                    onTravel={handleTravel}
                />
            )}

            {/* Close Button (Only visible in Hub) */}
            {depth === 'HUB' && (
                <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color="white" />
                </Pressable>
            )}
        </View>
    );
}

export default function LevelRoomScreen() {
    return (
        <AtmosphereProvider>
            <RoomContent />
        </AtmosphereProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    layerContainer: { ...StyleSheet.absoluteFillObject },
    hotspotsLayer: { flex: 1 },
    hotspot: { position: 'absolute', alignItems: 'center', gap: spacing.xs, width: 60 },
    hotspotIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(0,0,0,0.2)' },
    hotspotLabel: { color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', textShadowColor: 'black', textShadowRadius: 6 },

    // Insight Articles
    insightTitle: { fontSize: 32, fontWeight: '800', marginBottom: spacing.sm, letterSpacing: -0.5 },
    insightSpine: { fontSize: 18, lineHeight: 28, color: 'rgba(255,255,255,0.9)', marginBottom: spacing.xl, fontWeight: '300' },
    chamberList: { gap: spacing.md },
    chamberCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    chamberHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg },
    chamberTitle: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
    chamberBody: { padding: spacing.lg, paddingTop: 0, borderTopWidth: 1 },
    chamberText: { fontSize: 15, lineHeight: 24 },

    nextDoorsContainer: { marginTop: 40, gap: spacing.md },
    nextDoorsLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: spacing.xs },
    doorButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, borderRadius: 12, borderWidth: 1 },
    doorText: { fontSize: 16, fontWeight: '600' },

    // Realm Styles
    realmTitle: { fontSize: typography.h2, fontWeight: typography.bold, marginTop: 60, marginBottom: spacing.sm, textAlign: 'center' },
    realmBody: { fontSize: typography.body, textAlign: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
    artifactGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.lg },
    artifactOrb: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center', padding: spacing.xs },
    artifactLabel: { fontSize: typography.small, fontWeight: typography.bold, textAlign: 'center' },

    // Insight Styles
    insightCard: { padding: spacing.xl, borderRadius: borderRadius.xl, borderWidth: 1, alignItems: 'center' },
    insightBody: { fontSize: typography.body, lineHeight: 28, textAlign: 'center' },

    // Utils
    closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 100 },
    backButtonRelative: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    backText: { color: 'white', marginLeft: spacing.xs, fontWeight: typography.bold },
});
