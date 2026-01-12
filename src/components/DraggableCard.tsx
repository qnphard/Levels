import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Animated, PanResponder, StyleSheet, Platform, Vibration } from 'react-native';
import { useThemeColors, spacing } from '../theme/colors';

interface DraggableCardProps {
  children: React.ReactNode;
  index: number;
  onDragStart?: (index: number) => void;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  onPositionChange?: (fromIndex: number, toIndex: number) => void;
  enabled?: boolean;
  longPressDuration?: number; // in milliseconds
}

export default function DraggableCard({
  children,
  index,
  onDragStart,
  onDragEnd,
  onPositionChange,
  enabled = true,
  longPressDuration = 2000, // 2 seconds
}: DraggableCardProps) {
  const theme = useThemeColors();
  const [isDragging, setIsDragging] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const dragStartY = useRef(0);
  const currentIndex = useRef(index);
  const hasMoved = useRef(false);
  const isDraggingRef = useRef(false);
  const isLongPressingRef = useRef(false);

  useEffect(() => {
    currentIndex.current = index;
  }, [index]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    isLongPressingRef.current = isLongPressing;
  }, [isLongPressing]);

  const startLongPress = useCallback(() => {
    if (!enabled) return;
    
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      setIsDragging(true);
      isLongPressingRef.current = true;
      isDraggingRef.current = true;
      hasMoved.current = false;
      if (onDragStart) {
        onDragStart(index);
      }
      // Haptic feedback
      if (Platform.OS !== 'web' && Platform.OS !== 'ios') {
        Vibration.vibrate(50);
      }
    }, longPressDuration);
  }, [enabled, index, longPressDuration, onDragStart]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
    isLongPressingRef.current = false;
  }, []);

  const resetPosition = useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setIsDragging(false);
      isDraggingRef.current = false;
    });
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond if we're dragging or if movement is significant after long press starts
        return enabled && (isDragging || (isLongPressing && Math.abs(gestureState.dy) > 5));
      },
      onPanResponderGrant: (evt) => {
        if (!enabled) return;
        dragStartY.current = evt.nativeEvent.pageY;
        hasMoved.current = false;
        startLongPress();
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!enabled) return;
        
        if (isDragging) {
          // We're dragging
          hasMoved.current = true;
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
          
          // Calculate which index we're over based on vertical movement
          // Approximate card height with spacing
          const cardHeight = 140; // Card height + margin
          const newIndex = Math.max(0, Math.round(gestureState.dy / cardHeight) + index);
          
          if (newIndex !== currentIndex.current) {
            currentIndex.current = newIndex;
            if (onPositionChange) {
              onPositionChange(index, newIndex);
            }
          }
        } else if (Math.abs(gestureState.dy) > 10 || Math.abs(gestureState.dx) > 10) {
          // User moved before long press completed, cancel it
          cancelLongPress();
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        cancelLongPress();
        
        if (isDraggingRef.current && hasMoved.current) {
          const finalIndex = currentIndex.current;
          
          if (onDragEnd && finalIndex !== index) {
            onDragEnd(index, finalIndex);
          }
          
          pan.flattenOffset();
          resetPosition();
        } else {
          // Just a tap, not a drag
          setIsDragging(false);
          setIsLongPressing(false);
          isDraggingRef.current = false;
          isLongPressingRef.current = false;
          pan.flattenOffset();
          resetPosition();
        }
      },
      onPanResponderTerminate: () => {
        cancelLongPress();
        setIsDragging(false);
        setIsLongPressing(false);
        isDraggingRef.current = false;
        isLongPressingRef.current = false;
        pan.flattenOffset();
        resetPosition();
      },
    })
  ).current;

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    dragging: {
      zIndex: 1000,
      elevation: 10,
      opacity: 0.9,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      ...(Platform.OS === 'android' && {
        elevation: 10,
      }),
    },
    longPressIndicator: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primary,
      borderWidth: 2,
      borderColor: theme.white,
      zIndex: 1001,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        isDragging && styles.dragging,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: isDragging ? 1.05 : 1 },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {isLongPressing && !isDragging && (
        <View style={styles.longPressIndicator} />
      )}
      {children}
    </Animated.View>
  );
}

