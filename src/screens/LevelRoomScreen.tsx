import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { getLevelById } from '../data/levels';
import { themes, typography, spacing, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { LEVEL_DOSSIER_DATA } from '../data/dossierData';
import { DossierArticle } from '../types';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

// --- Helper Components ---

const FormattedText: React.FC<{ text: string; style?: any }> = ({ text, style }) => {
    const theme = themes.dark;
    if (!text) return null;
    const processedText = text.replace(/\\n/g, '\n');
    const parts = processedText.split(/(\*\*.*?\*\*)/g);
    return (
        <Text style={style}>
            {parts.map((part, index) => {
                if (!part) return null;
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <Text key={index} style={{ fontWeight: '800', color: theme.white }}>
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
const ArticleContent: React.FC<{ article: DossierArticle; onBack?: () => void }> = ({ article, onBack }) => {
    const theme = themes.dark;
    const [expandedSections, setExpandedSections] = useState<number[]>([]);

    // Auto-expand default sections
    React.useEffect(() => {
        if (article?.sections) {
            const defaultExpanded = article.sections
                .map((s, i) => s.defaultExpanded ? i : -1)
                .filter(i => i !== -1);
            setExpandedSections(defaultExpanded);
        }
    }, [article]);

    const toggleSection = (index: number) => {
        setExpandedSections(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    if (!article) return null;

    return (
        <View style={{ flex: 1 }}>
            {onBack && (
                <Pressable onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
            )}

            <Text style={styles.insightTitle}>{article.title}</Text>
            <Text style={styles.insightSpine}>{article.spineBody}</Text>

            <View style={styles.chamberList}>
                {article.sections?.map((section, i) => {
                    const isExpanded = expandedSections.includes(i);
                    return (
                        <View key={i} style={[styles.chamberCard, { borderColor: isExpanded ? theme.primary : 'rgba(255,255,255,0.1)' }]}>
                            <Pressable onPress={() => toggleSection(i)} style={styles.chamberHeader}>
                                <Text style={[styles.chamberTitle, { color: isExpanded ? theme.primary : theme.white }]}>
                                    {section.title}
                                </Text>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={isExpanded ? theme.primary : 'rgba(255,255,255,0.5)'}
                                />
                            </Pressable>
                            {isExpanded && (
                                <View style={styles.chamberBody}>
                                    <FormattedText text={section.body} style={styles.chamberText} />
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Simple List Viewer for Traps/Exits
const ListView: React.FC<{ data: any; onBack?: () => void }> = ({ data, onBack }) => {
    const theme = themes.dark;

    return (
        <View style={{ flex: 1 }}>
            {onBack && (
                <Pressable onPress={onBack} style={styles.backButtonRelative}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
            )}

            <Text style={styles.insightTitle}>{data.title || 'Collection'}</Text>
            {data.body ? (
                <Text style={[styles.insightSpine, { marginBottom: 32 }]}>{data.body}</Text>
            ) : null}

            <View style={styles.artifactGrid}>
                {data.chips?.map((chip: any, i: number) => (
                    <View key={i} style={styles.listItem}>
                        <View style={styles.orbIcon}>
                            {/* Placeholder Icon */}
                            <Ionicons name="disc-outline" size={20} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.listItemTitle}>{chip.label}</Text>
                            {/* If chips have more detail, render it here */}
                        </View>
                    </View>
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

    const theme = themes.dark;

    const level = useMemo(() => getLevelById(levelId), [levelId]);
    const dossier = useMemo(() => LEVEL_DOSSIER_DATA[levelId?.toLowerCase()] || {}, [levelId]);

    // Determine Content to Show based on hotspot
    const content = useMemo(() => {
        if (!initialHotspot || !dossier) return null;

        if (initialHotspot === 'feltSense') return { type: 'article', data: dossier.feltSense };
        if (initialHotspot === 'purpose') return { type: 'article', data: dossier.purpose };
        if (initialHotspot === 'traps') return { type: 'list', data: { title: 'Traps', body: dossier.traps?.body, chips: dossier.traps?.chips } };
        if (initialHotspot === 'exits') return { type: 'list', data: { title: 'Exits', body: dossier.exits?.body, chips: dossier.exits?.chips } };

        return null; // Fallback
    }, [initialHotspot, dossier]);

    // Helper for navigation back
    const handleBack = () => navigation.goBack();

    if (!level) return <View style={styles.container} />;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background */}
            <LinearGradient
                colors={['#111', '#000']}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle Gradient based on Level Color */}
            <LinearGradient
                colors={[level.color + '20', 'transparent']} // Low opacity level color
                style={[StyleSheet.absoluteFill, { height: '40%' }]}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerSpacer} />

                {content?.type === 'article' && content.data ? (
                    <ArticleContent article={content.data as DossierArticle} onBack={handleBack} />
                ) : content?.type === 'list' && content.data ? (
                    <ListView data={content.data} onBack={handleBack} />
                ) : (
                    // Fallback / Empty State
                    <View style={{ alignItems: 'center', marginTop: 100 }}>
                        <Text style={{ color: 'white' }}>Select a section from the menu.</Text>
                        <Pressable onPress={handleBack} style={{ marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                            <Text style={{ color: 'white' }}>Go Back</Text>
                        </Pressable>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Close Button (Floating) */}
            <Pressable onPress={handleBack} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    headerSpacer: { height: 80 },

    // Back Button
    backButtonRelative: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
    backText: { color: 'white', marginLeft: 8, fontWeight: '700', fontSize: 16 },
    closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },

    // Typography
    insightTitle: { fontSize: 32, fontWeight: '800', marginBottom: 12, color: 'white', letterSpacing: -0.5 },
    insightSpine: { fontSize: 18, lineHeight: 28, color: 'rgba(255,255,255,0.9)', marginBottom: 32, fontWeight: '300' },

    // Cards/Sections
    chamberList: { gap: 16 },
    chamberCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    chamberHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    chamberTitle: { fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
    chamberBody: { padding: 20, paddingTop: 0, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    chamberText: { fontSize: 16, lineHeight: 26, color: 'rgba(255,255,255,0.8)' },

    // List View
    artifactGrid: { gap: 12 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    orbIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
    },
    listItemTitle: { color: 'white', fontSize: 16, fontWeight: '600' }
});
