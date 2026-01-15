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
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLevelById } from '../data/levels';
import { useThemeColors, typography, spacing, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LEVEL_DOSSIER_DATA } from '../data/dossierData';
import { RoomBackground } from '../components/RoomBackground';
import { AtmosphereProvider, useAtmosphere, AtmosphereState, DepthState } from '../context/AtmosphereContext';
import { DossierArticle, CategoryArticles } from '../types';

const { width, height } = Dimensions.get('window');

import { useAtmosphereDepth } from '../context/AtmosphereDepthContext';
import BreadcrumbBar from '../components/BreadcrumbBar';
import GlassCard from '../components/GlassCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type HotspotType = 'felt-sense' | 'purpose' | 'traps' | 'exits' | 'practices';

const ORBIT_RADIUS = 120;
const DOOR_CONFIG: { type: HotspotType; label: string; angle: number; icon: keyof typeof Ionicons.glyphMap }[] = [
    { type: 'felt-sense', label: 'Felt Sense', angle: -Math.PI / 2, icon: 'heart-outline' },
    { type: 'purpose', label: 'Purpose', angle: 0, icon: 'compass-outline' },
    { type: 'traps', label: 'Traps', angle: Math.PI / 2, icon: 'warning-outline' },
    { type: 'exits', label: 'Exits', angle: Math.PI, icon: 'exit-outline' },
];

// --- Sub-Components for Depth Layers ---

// 1. HUB VIEW: The Main Room with Arc Hotspots
const HubView: React.FC<{
    isActive: boolean;
    onOpenHotspot: (type: HotspotType) => void;
    opacity: Animated.Value;
    levelId: string;
    unlockedHotspots: HotspotType[];
    mode: 'explore' | 'guided';
    onToggleMode: () => void;
    zoomLevel: Animated.Value;
    cameraShift: Animated.ValueXY;
}> = ({ isActive, onOpenHotspot, opacity, levelId, unlockedHotspots, mode, onToggleMode, zoomLevel, cameraShift }) => {
    const theme = useThemeColors();
    const breatheValue = useRef(new Animated.Value(0)).current;

    // Breathing Animation for centerpiece
    useEffect(() => {
        Animated.loop(
            Animated.timing(breatheValue, {
                toValue: 1,
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            })
        ).start();
    }, []);

    const renderDoor = (config: typeof DOOR_CONFIG[0]) => {
        const { type, label, angle, icon } = config;
        const isUnlocked = mode === 'explore' || unlockedHotspots.includes(type);
        const x = Math.cos(angle) * ORBIT_RADIUS;
        const y = Math.sin(angle) * ORBIT_RADIUS;

        return (
            <Animated.View
                key={type}
                style={[
                    styles.orbitDoor,
                    {
                        left: width / 2 - 40 + x,
                        top: height / 2 - 85 + y,
                    }
                ]}
            >
                <Pressable
                    onPress={() => isUnlocked && onOpenHotspot(type)}
                    disabled={!isActive}
                >
                    {/* Glass Door with Gradient */}
                    <LinearGradient
                        colors={isUnlocked
                            ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']
                            : ['rgba(80,80,80,0.3)', 'rgba(40,40,40,0.2)']
                        }
                        style={styles.glassDoor}
                    >
                        <Ionicons
                            name={isUnlocked ? icon : 'lock-closed'}
                            size={26}
                            color={isUnlocked ? 'white' : 'rgba(255,255,255,0.25)'}
                        />
                    </LinearGradient>

                    <Text style={[
                        styles.doorLabel,
                        !isUnlocked && { color: 'rgba(255,255,255,0.25)' }
                    ]}>
                        {label}
                    </Text>
                </Pressable>
            </Animated.View>
        );
    };

    // Centerpiece based on level
    let centerIcon: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
    let centerLabel = 'Reflect';
    const levelIdLower = levelId.toLowerCase();
    if (levelIdLower === 'shame') { centerIcon = 'rainy-outline'; centerLabel = 'Mirror'; }
    else if (levelIdLower === 'fear') { centerIcon = 'eye-outline'; centerLabel = 'Observer'; }
    else if (levelIdLower === 'anger') { centerIcon = 'flame-outline'; centerLabel = 'Ember'; }
    else if (levelIdLower === 'guilt') { centerIcon = 'water-outline'; centerLabel = 'Well'; }
    else if (levelIdLower === 'grief') { centerIcon = 'leaf-outline'; centerLabel = 'Garden'; }
    else if (levelIdLower === 'apathy') { centerIcon = 'snow-outline'; centerLabel = 'Frost'; }

    const breatheScale = breatheValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.06, 1]
    });

    // Content Opacity fades as we zoom past
    const contentOpacity = zoomLevel.interpolate({
        inputRange: [1, 1.5],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View
            style={[styles.layerContainer, {
                opacity: Animated.multiply(opacity, contentOpacity),
                zIndex: isActive ? 10 : 1,
                transform: [
                    { scale: zoomLevel },
                    { translateX: cameraShift.x },
                    { translateY: cameraShift.y }
                ]
            }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            {/* Centered Centerpiece */}
            <View style={styles.centerpieceContainer}>
                <Animated.View style={[styles.centerOrb, { transform: [{ scale: breatheScale }] }]}>
                    <Ionicons name={centerIcon} size={40} color="white" />
                </Animated.View>
                <Text style={styles.centerLabel}>{centerLabel}</Text>
            </View>

            {/* Orbiting Doors */}
            {DOOR_CONFIG.map(renderDoor)}

            {/* Practice Button at Bottom - Premium */}
            <Pressable
                onPress={() => onOpenHotspot('practices')}
                style={styles.practiceButton}
                disabled={!isActive}
            >
                <LinearGradient
                    colors={['rgba(139,92,246,0.5)', 'rgba(139,92,246,0.25)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.practiceGradient}
                >
                    <Ionicons name="headset-outline" size={22} color="white" />
                    <Text style={styles.practiceLabel}>Enter Meditation</Text>
                </LinearGradient>
            </Pressable>

            {/* Mode Toggle at Top Right */}
            <Pressable onPress={onToggleMode} style={styles.modeToggle} disabled={!isActive}>
                <Text style={styles.modeToggleText}>
                    {mode === 'explore' ? 'Explore' : 'Guided'}
                </Text>
                <Ionicons
                    name={mode === 'explore' ? 'infinite' : 'trail-sign-outline'}
                    size={12}
                    color="rgba(255,255,255,0.6)"
                />
            </Pressable>
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
            }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            <GlassCard>
                <Pressable onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color={theme.mode === 'dark' ? "white" : theme.primary} />
                    <Text style={[styles.backText, { color: theme.mode === 'dark' ? "white" : theme.textPrimary }]}>Back to Room</Text>
                </Pressable>

                <Text style={[styles.realmTitle, { color: theme.mode === 'dark' ? theme.white : theme.textPrimary, marginTop: 10 }]}>{data.title || ''}</Text>
                {data.body ? (
                    <Text style={[styles.realmBody, { color: theme.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.textSecondary }]}>{data.body}</Text>
                ) : null}

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
            </GlassCard>
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
            }]}
            pointerEvents={isActive ? 'box-none' : 'none'}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <GlassCard intensity={0.7}>
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
                            const renderFormattedBody = (text?: string) => {
                                if (!text) return null;
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
                                    return part || null;
                                }).filter(p => p !== null);
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
                </GlassCard>
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
        setRecipeByLevel,
        lightingOpacity
    } = useAtmosphere();

    const { pushDepth, popDepth, depthStack } = useAtmosphereDepth();
    const theme = useThemeColors();

    const params = route.params || {};
    const { levelId } = params;
    const level = useMemo(() => getLevelById(levelId), [levelId]);

    // Entry Sequence State
    const [isEntering, setIsEntering] = useState(true);
    const entryOpacity = useRef(new Animated.Value(1)).current;

    // Local Data State
    const [activeHotspot, setActiveHotspot] = useState<HotspotType | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<DossierArticle | null>(null);
    const [unlockedHotspots, setUnlockedHotspots] = useState<HotspotType[]>(['felt-sense', 'traps', 'exits', 'purpose']);
    const [mode, setMode] = useState<'explore' | 'guided'>('guided');

    // Layer Opacity Animations
    const hubOpacity = useRef(new Animated.Value(1)).current;
    const realmOpacity = useRef(new Animated.Value(0)).current;
    const insightOpacity = useRef(new Animated.Value(0)).current;

    // Portal Zoom / Camera Shift
    const cameraShift = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const handleToggleMode = () => setMode(prev => prev === 'explore' ? 'guided' : 'explore');

    // SYNC DEPTH STACK
    useEffect(() => {
        if (level) {
            pushDepth(level.name);
        }
        return () => {
            popDepth();
        };
    }, [level]);

    useEffect(() => {
        if (depth === 'REALM' && activeHotspot) {
            const label = activeHotspot.charAt(0).toUpperCase() + activeHotspot.slice(1).replace('-', ' ');
            pushDepth(label);
        } else if (depth === 'HUB' && depthStack.length > 1) {
            popDepth();
        }
    }, [depth, activeHotspot]);

    // Initialize Atmosphere
    useEffect(() => {
        if (levelId) {
            setRecipeByLevel(levelId);
        }

        // Ritual Entry Sequence
        Animated.sequence([
            Animated.delay(500),
            Animated.timing(entryOpacity, {
                toValue: 0,
                duration: 2500,
                useNativeDriver: true
            })
        ]).start(() => setIsEntering(false));

        setDepth('HUB');
        setAtmosphere('neutral');
    }, [levelId]);

    // Orchestrate Transitions based on Depth (runs regardless of level)
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

    // Handle Back Press (runs regardless of level)
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
    }, [depth, navigation]);

    // Force animation state sync if somehow desynced (runs regardless of level)
    useEffect(() => {
        if (depth === 'HUB') {
            hubOpacity.setValue(1);
            realmOpacity.setValue(0);
            insightOpacity.setValue(0);
        }
    }, [depth]);

    // Early return AFTER all hooks are declared
    if (!level) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>Loading...</Text>
            </View>
        );
    }


    // --- Actions ---
    const handleOpenHotspot = (type: HotspotType) => {
        // Find hotspot config for focal zoom
        const config = DOOR_CONFIG.find((d: any) => d.type === type);
        if (config) {
            const tx = -Math.cos(config.angle) * ORBIT_RADIUS * 1.5;
            const ty = -Math.sin(config.angle) * ORBIT_RADIUS * 1.5;

            Animated.timing(cameraShift, {
                toValue: { x: tx, y: ty },
                duration: 1200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true
            }).start();
        }

        const dossier = LEVEL_DOSSIER_DATA[level.id.toLowerCase()];

        // Custom flow: Felt Sense and Purpose go directly to Insight if they are articles
        const key = type === 'felt-sense' ? 'feltSense' : type;
        if ((key === 'feltSense' || key === 'purpose') && dossier?.[key as keyof CategoryArticles]) {
            const item = dossier[key as keyof CategoryArticles];
            if (item && 'sections' in item) {
                setSelectedArticle(item as DossierArticle);
                setDepth('INSIGHT');
                setAtmosphere(type as AtmosphereState);

                // Unlock progression even on direct insight travel
                if (!unlockedHotspots.includes(type)) {
                    setUnlockedHotspots(prev => [...prev, type]);
                }
                return;
            }
        }

        setActiveHotspot(type);
        setAtmosphere(type as AtmosphereState);
        setDepth('REALM');

        // Unlock progression
        if (!unlockedHotspots.includes(type)) {
            setUnlockedHotspots(prev => [...prev, type]);
        }
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
            setDepth('HUB');
            setAtmosphere('neutral');
            setActiveHotspot(null);
            if (!hotspot) {
                setTimeout(() => setSelectedArticle(null), 800);
            } else {
                setSelectedArticle(null);
                setTimeout(() => handleOpenHotspot(hotspot), 1000);
            }
        }
    };

    const getRealmData = () => {
        if (!activeHotspot) return null;
        const dossier = LEVEL_DOSSIER_DATA[level.id.toLowerCase()];
        if (!dossier) return null;

        switch (activeHotspot) {
            case 'felt-sense': return dossier.feltSense || null;
            case 'purpose': return dossier.purpose || null;
            case 'traps': return { title: 'The Ego Trap', body: dossier.traps?.body || '', chips: dossier.traps?.chips || [] };
            case 'exits': return { title: 'The Way Through', body: dossier.exits?.body || '', chips: dossier.exits?.chips || [] };
            case 'practices': return {
                title: 'Practices', body: 'Direct somatic exercises.', chips: [
                    { label: 'Body Scan', title: 'Body Scan', spineBody: 'A simple scan.', sections: [{ title: 'Core', body: 'Scan.', importance: 'core', defaultExpanded: true }] }
                ]
            };
            default: return null;
        }
    };

    const handleTapBackground = () => {
        // Subtle light ripple
        Animated.sequence([
            Animated.timing(lightingOpacity, { toValue: 0.6, duration: 150, useNativeDriver: true }),
            Animated.timing(lightingOpacity, { toValue: 0.4, duration: 600, useNativeDriver: true })
        ]).start();
    };

    const realmData = getRealmData();

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Background with Ripple Support */}
            <Pressable onPress={handleTapBackground} style={StyleSheet.absoluteFill}>
                <RoomBackground
                    layers={{
                        far: require('../assets/images/default/light/far.png'),
                        mid: require('../assets/images/default/light/mid.png'),
                    }}
                    zoomLevel={zoomLevel}
                    cameraShift={cameraShift}
                />
            </Pressable>

            {/* Atmosphere Effects */}
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: vignetteIntensity }]}
                pointerEvents="none"
            />

            <HubView
                isActive={depth === 'HUB'}
                onOpenHotspot={handleOpenHotspot}
                opacity={hubOpacity}
                levelId={level.id}
                unlockedHotspots={unlockedHotspots}
                mode={mode}
                onToggleMode={handleToggleMode}
                zoomLevel={zoomLevel}
                cameraShift={cameraShift}
            />

            {/* Realm Layer */}
            <RealmView
                isActive={depth === 'REALM'}
                data={realmData}
                onSelectChip={handleSelectArticle}
                opacity={realmOpacity}
                onBack={handleBack}
            />

            {/* Insight Layer */}
            {selectedArticle && (
                <InsightView
                    isActive={depth === 'INSIGHT'}
                    article={selectedArticle}
                    opacity={insightOpacity}
                    onBack={handleBack}
                    onTravel={handleTravel}
                />
            )}

            {/* Ritual Entry Overlay */}
            {isEntering && (
                <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: entryOpacity, zIndex: 1000, alignItems: 'center', justifyContent: 'center' }]}>
                    <Animated.View style={{ opacity: entryOpacity.interpolate({ inputRange: [0.5, 1], outputRange: [0, 1] }) }}>
                        <Text style={[styles.ritualTitle, { color: 'white' }]}>{level.name}</Text>
                        <Text style={styles.ritualSubtitle}>Prepare to enter the space...</Text>
                    </Animated.View>
                </Animated.View>
            )}

            {/* Close Button */}
            <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color="white" />
            </Pressable>
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

    // Orbit & Spatial Styles
    orbitNode: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
    glyphDoor: { alignItems: 'center', gap: 8 },
    glyphCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glyphLabel: { color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

    centerpiece: { alignItems: 'center', justifyContent: 'center' },
    centerOrb: {
        width: 100,
        height: 100,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        elevation: 8,
    },
    centerLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '300',
        marginTop: 16,
        letterSpacing: 6,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowRadius: 4,
    },

    // Centered Centerpiece Container
    centerpieceContainer: {
        position: 'absolute',
        left: width / 2 - 60,
        top: height / 2 - 140,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Orbital Door - Premium Glassmorphism
    orbitDoor: {
        position: 'absolute',
        alignItems: 'center',
        width: 80,
    },
    glassDoor: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    doorLabel: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowRadius: 4,
    },

    // Practice Button - Premium
    practiceButton: {
        position: 'absolute',
        bottom: 100,
        left: width / 2 - 100,
        overflow: 'hidden',
        borderRadius: 30,
    },
    practiceGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.4)',
    },

    practiceDoor: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    practiceLabel: { color: 'white', fontWeight: '600', letterSpacing: 1, fontSize: 14 },

    // Ritual Entry
    ritualTitle: { fontSize: 42, fontWeight: '800', textAlign: 'center', letterSpacing: 8, textTransform: 'uppercase', marginBottom: 10 },
    ritualSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', letterSpacing: 2, fontWeight: '300' },

    // Whispers
    whisperBubble: {
        position: 'absolute',
        top: -60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        width: 200,
        alignItems: 'center',
    },
    whisperText: { color: 'white', fontSize: 12, fontStyle: 'italic', textAlign: 'center' },

    modeToggle: {
        position: 'absolute',
        top: 60,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modeToggleText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
