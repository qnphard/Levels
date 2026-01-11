import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent, Dimensions } from 'react-native';
import MandalaBackground from './MandalaBackground';
import { EssentialItem } from '../data/essentials';

interface RadialMenuLayoutProps {
    items: EssentialItem[];
    onItemPress: (item: EssentialItem) => void;
    selectedId?: string;
    recommendedId?: string;
    completedIds?: string[];
}

// Fallback to window dimensions initially
const { width: windowWidth } = Dimensions.get('window');

const RadialMenuLayout: React.FC<RadialMenuLayoutProps> = ({
    items,
    onItemPress,
    selectedId,
    recommendedId,
    completedIds
}) => {
    // Track actual container dimensions
    const [layout, setLayout] = useState({ width: windowWidth, height: windowWidth, centerX: windowWidth / 2, centerY: windowWidth / 2 });

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({
            width,
            height,
            centerX: width / 2,
            centerY: height / 2,
        });
    }, []);

    // Calculate radii based on actual width
    const scale = Math.min(layout.width, layout.height) / 1000;
    const INNER_RADIUS = layout.width * 0.28;
    const OUTER_RADIUS = layout.width * 0.47;
    const CENTER_RADIUS = 55 * scale;

    const getCoords = useCallback((index: number, total: number, radius: number) => {
        const angle = ((index + 0.5) * 2 * Math.PI) / total - Math.PI / 2;
        return {
            x: layout.centerX + radius * Math.cos(angle),
            y: layout.centerY + radius * Math.sin(angle),
        };
    }, [layout.centerX, layout.centerY]);

    const centerItem = items[0];
    const innerItems = items.slice(1, 7);
    const outerItems = items.slice(7);

    // Get foundation IDs from items
    const foundationIds = useMemo(() =>
        items.filter(item => item.isFoundation).map(item => item.id),
        [items]);

    const innerSegmentData = useMemo(() => innerItems.map(item => ({
        id: item.id,
        title: item.title,
        isFoundation: item.isFoundation,
    })), [innerItems]);

    const outerSegmentData = useMemo(() => outerItems.map(item => ({
        id: item.id,
        title: item.title,
        isFoundation: item.isFoundation,
    })), [outerItems]);

    const renderHotspot = useCallback((item: EssentialItem, x: number, y: number, size: number) => {
        const halfSize = size / 2;
        return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={0.6}
                style={[
                    styles.hotspot,
                    {
                        left: x - halfSize,
                        top: y - halfSize,
                        width: size,
                        height: size,
                    },
                ]}
                onPress={() => {
                    onItemPress(item);
                }}
            />
        );
    }, [onItemPress]);

    const hotspots = useMemo(() => {
        const result: React.ReactNode[] = [];
        if (centerItem) {
            result.push(renderHotspot(centerItem, layout.centerX, layout.centerY, 100));
        }

        innerItems.forEach((item, i) => {
            const { x, y } = getCoords(i, innerItems.length, (CENTER_RADIUS + 15 + INNER_RADIUS) / 2);
            result.push(renderHotspot(item, x, y, 90));
        });

        outerItems.forEach((item, i) => {
            const { x, y } = getCoords(i, outerItems.length, (INNER_RADIUS + 8 + OUTER_RADIUS) / 2);
            result.push(renderHotspot(item, x, y, 75));
        });

        return result;
    }, [items, onItemPress, layout, INNER_RADIUS, OUTER_RADIUS, CENTER_RADIUS, getCoords, renderHotspot, centerItem, innerItems, outerItems]);

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <MandalaBackground
                key="mandala-v-clean"
                width={layout.width}
                height={layout.height}
                innerRadius={INNER_RADIUS}
                outerRadius={OUTER_RADIUS}
                centerLabel={centerItem?.title || ''}
                innerItems={innerSegmentData}
                outerItems={outerSegmentData}
                selectedId={selectedId}
                recommendedId={recommendedId}
                completedIds={completedIds}
                foundationIds={foundationIds}
            />
            {hotspots}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    hotspot: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        backgroundColor: 'transparent',
    },
});

export default React.memo(RadialMenuLayout);
