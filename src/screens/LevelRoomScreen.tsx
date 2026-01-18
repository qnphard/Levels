import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { getLevelById } from '../data/levels';
import { themes, typography, spacing, borderRadius, useThemeColors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { LEVEL_DOSSIER_DATA } from '../data/dossierData';
import { DossierArticle } from '../types';
import { LivingBackground } from '../components/LivingBackground';
import { GlassSurface } from '../components/GlassSurface';
import { KineticText } from '../components/KineticText';
import { HapticOrchestrator } from '../services/HapticOrchestrator';

const { width } = Dimensions.get('window');

// --- Helper Components ---

const FormattedText: React.FC<{ text: string; style?: any; theme: any }> = ({ text, style, theme }) => {
    if (!text) return null;
    const processedText = text.replace(/\\n/g, '\n');
    const parts = processedText.split(/(\*\*.*?\*\*)/g);
    return (
        <Text style={style}>
            {parts.map((part, index) => {
                if (!part) return null;
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <Text key={index} style={{ fontWeight: '800', color: theme.textPrimary }}>
                            {part.slice(2, -2)}
                        </Text>
                    );
                }
                return <Text key={index}>{part}</Text>;
            })}
        </Text>
    );
};

// Reused Article Content Viewer
const ArticleContent: React.FC<{ article: DossierArticle; onBack?: () => void; theme: any }> = ({ article, onBack, theme }) => {
    const [expandedSections, setExpandedSections] = useState<number[]>([]);

    // Auto-expand default sections
    useEffect(() => {
        if (article?.sections) {
            const defaultExpanded = article.sections
                .map((s, i) => s.defaultExpanded ? i : -1)
                .filter(i => i !== -1);
            setExpandedSections(defaultExpanded);
        }
    }, [article]);

    const toggleSection = (index: number) => {
        HapticOrchestrator.tick();
        setExpandedSections(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    if (!article) return null;

    return (
        <View style={{ flex: 1 }}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                    <Text style={[styles.backText, { color: theme.textPrimary }]}>Back</Text>
                </TouchableOpacity>
            )}

            <KineticText type="h1" style={[styles.insightTitle, { color: theme.textPrimary }]}>
                {article.title}
            </KineticText>

            <GlassSurface style={styles.spineCard} intensity={20} forceTheme="dark">
                <Text style={[styles.insightSpine, { color: theme.textSecondary }]}>{article.spineBody}</Text>
            </GlassSurface>

            <View style={styles.chamberList}>
                {article.sections?.map((section, i) => {
                    const isExpanded = expandedSections.includes(i);
                    return (
                        <GlassSurface
                            key={i}
                            style={[styles.chamberCard, { borderColor: isExpanded ? theme.primary : 'rgba(255,255,255,0.08)' }]}
                            intensity={isExpanded ? 30 : 15}
                            forceTheme="dark"
                        >
                            <Pressable onPress={() => toggleSection(i)} style={styles.chamberHeader}>
                                <Text style={[styles.chamberTitle, { color: isExpanded ? theme.primary : theme.textPrimary }]}>
                                    {section.title}
                                </Text>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={isExpanded ? theme.primary : theme.textSecondary}
                                />
                            </Pressable>
                            {isExpanded && (
                                <View style={styles.chamberBody}>
                                    <FormattedText
                                        text={section.body}
                                        style={[styles.chamberText, { color: theme.textSecondary }]}
                                        theme={theme}
                                    />
                                </View>
                            )}
                        </GlassSurface>
                    );
                })}
            </View>
        </View>
    );
};

// List Viewer for Traps/Exits
const ListView: React.FC<{ data: any; onBack?: () => void; onItemPress: (item: any) => void; theme: any }> = ({ data, onBack, onItemPress, theme }) => {
    return (
        <View style={{ flex: 1 }}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                    <Text style={[styles.backText, { color: theme.textPrimary }]}>Back</Text>
                </TouchableOpacity>
            )}

            <KineticText type="h1" style={[styles.insightTitle, { color: theme.textPrimary }]}>
                {data.title || 'Collection'}
            </KineticText>

            {data.body ? (
                <GlassSurface style={{ marginBottom: 32, padding: 16 }} intensity={20} forceTheme="dark">
                    <Text style={[styles.insightSpine, { marginBottom: 0, color: theme.textSecondary }]}>{data.body}</Text>
                </GlassSurface>
            ) : null}

            <View style={styles.artifactGrid}>
                {data.chips?.map((chip: any, i: number) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.listItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                        onPress={() => {
                            HapticOrchestrator.elementClick();
                            onItemPress(chip);
                        }}
                    >
                        <View style={[styles.orbIcon, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                            <Ionicons name="finger-print-outline" size={24} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.listItemTitle, { color: theme.textPrimary }]}>{chip.label}</Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>Tap to read</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};


// --- Main Screen ---

export default function LevelRoomScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'LevelRoom'>>();
    const navigation = useNavigation();
    const { levelId, initialHotspot } = route.params || {};

    // Force Dark Theme for this immersive screen
    const theme = themes.dark;

    // Internal navigation state to drill down into lists
    const [selectedArticle, setSelectedArticle] = useState<DossierArticle | null>(null);

    const level = useMemo(() => getLevelById(levelId), [levelId]);
    const dossier = useMemo(() => LEVEL_DOSSIER_DATA[levelId?.toLowerCase()] || {}, [levelId]);

    // Determine Content to Show based on hotspot
    const content = useMemo(() => {
        if (!initialHotspot || !dossier) return null;

        if (initialHotspot === 'feltSense') return { type: 'article', data: dossier.feltSense };
        if (initialHotspot === 'purpose') return { type: 'article', data: dossier.purpose };
        if (initialHotspot === 'traps') return { type: 'list', data: { title: 'Traps', body: dossier.traps?.body, chips: dossier.traps?.chips } };
        if (initialHotspot === 'exits') return { type: 'list', data: { title: 'Exits', body: dossier.exits?.body, chips: dossier.exits?.chips } };

        return null;
    }, [initialHotspot, dossier]);

    // Handle back press
    const handleBack = () => {
        if (selectedArticle) {
            setSelectedArticle(null); // Go back to list
        } else {
            navigation.goBack(); // Go back to Hub
        }
    };

    const handleListItemPress = (item: any) => {
        // Assume item matches DossierArticle shape roughly or map it
        setSelectedArticle(item);
        // Scroll to top? (handled by key change usually or manually ref)
    };

    if (!level) return <View style={styles.container} />;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Alive Background */}
            <LivingBackground />

            {/* Content */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSpacer} />

                {selectedArticle ? (
                    // 1. Details drilled down from list
                    <ArticleContent
                        article={selectedArticle}
                        onBack={() => setSelectedArticle(null)}
                        theme={theme}
                    />
                ) : content?.type === 'article' && content.data ? (
                    // 2. Direct article (Purpose, Felt Sense)
                    <ArticleContent article={content.data as DossierArticle} onBack={handleBack} theme={theme} />
                ) : content?.type === 'list' && content.data ? (
                    // 3. List View (Traps, Exits)
                    <ListView
                        data={content.data}
                        onBack={handleBack}
                        onItemPress={handleListItemPress}
                        theme={theme}
                    />
                ) : (
                    // Fallback
                    <View style={{ alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ color: theme.textSecondary }}>Select a section from the menu.</Text>
                        <TouchableOpacity onPress={handleBack} style={{ marginTop: 20, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                            <Text style={{ color: theme.textPrimary }}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Close Button (Floating) */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.closeBtn, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    headerSpacer: { height: 80 },

    // Back Button
    backButtonRelative: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, alignSelf: 'flex-start', padding: 8, marginLeft: -8, opacity: 0.8 },
    backText: { marginLeft: 6, fontWeight: '600', fontSize: 16 },
    closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 100, borderRadius: 20, padding: 8 },

    // Typography & Spacing
    insightTitle: { marginBottom: 16 },
    insightSpine: { fontSize: 18, lineHeight: 28, fontWeight: '400' },
    spineCard: { padding: 20, marginBottom: 32 },

    // Cards/Sections
    chamberList: { gap: 16 },
    chamberCard: { overflow: 'hidden', borderWidth: 1 },
    chamberHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    chamberTitle: { fontSize: 17, fontWeight: '600', letterSpacing: 0.3 },
    chamberBody: { padding: 20, paddingTop: 0 },
    chamberText: { fontSize: 16, lineHeight: 28 },

    // List View
    artifactGrid: { gap: 12 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    orbIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
    },
    listItemTitle: { fontSize: 17, fontWeight: '600' }
});
