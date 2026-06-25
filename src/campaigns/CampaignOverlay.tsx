import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { OverlayConfig, CampaignId } from '../types/campaign.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  campaignId: CampaignId | null;
  overlay: OverlayConfig | null;
}

interface ParticleProps {
  index: number;
  campaignId: CampaignId;
}

const Particle: React.FC<ParticleProps> = ({ index, campaignId }) => {
  // Generate random starting properties
  const startX = Math.random() * SCREEN_WIDTH;
  const size = campaignId === 'SUMMER_PLAYHOUSE' 
    ? Math.random() * 20 + 8  // Bubble sizes
    : Math.random() * 12 + 6; // Confetti/pencil sizes

  const startDelay = Math.random() * 4000;
  const duration = Math.random() * 3000 + 3000;

  // Animation values
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    // Reset values
    translateY.value = campaignId === 'SUMMER_PLAYHOUSE' ? SCREEN_HEIGHT + 50 : -50;
    translateX.value = startX;
    rotate.value = 0;
    opacity.value = 0.8;

    // Start falling/rising loop
    const targetY = campaignId === 'SUMMER_PLAYHOUSE' ? -50 : SCREEN_HEIGHT + 50;

    translateY.value = withDelay(
      startDelay,
      withRepeat(
        withTiming(targetY, {
          duration: duration,
          easing: Easing.linear,
        }),
        -1, // Loop infinitely
        false
      )
    );

    // Drifting side to side
    translateX.value = withDelay(
      startDelay,
      withRepeat(
        withSequence(
          withTiming(startX + (Math.random() * 40 - 20), { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX - (Math.random() * 40 - 20), { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Rotation loop
    rotate.value = withDelay(
      startDelay,
      withRepeat(
        withTiming(Math.random() * 720 - 360, {
          duration: duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [campaignId]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Render particles based on campaign style
  const getParticleStyle = () => {
    if (campaignId === 'BACK_TO_SCHOOL') {
      // Alternating blue/yellow pencils (rectangles) & airplanes (triangles)
      const isBlue = index % 2 === 0;
      const isTriangle = index % 3 === 0;
      return {
        width: isTriangle ? 0 : size / 2,
        height: isTriangle ? 0 : size * 2,
        backgroundColor: isTriangle ? 'transparent' : (isBlue ? '#1565C0' : '#FDD835'),
        borderStyle: isTriangle ? ('solid' as const) : undefined,
        borderLeftWidth: isTriangle ? size : undefined,
        borderRightWidth: isTriangle ? size : undefined,
        borderBottomWidth: isTriangle ? size * 1.5 : undefined,
        borderLeftColor: isTriangle ? 'transparent' : undefined,
        borderRightColor: isTriangle ? 'transparent' : undefined,
        borderBottomColor: isTriangle ? '#1565C0' : undefined,
        borderRadius: isTriangle ? 0 : 2,
      };
    } else if (campaignId === 'SUMMER_PLAYHOUSE') {
      // Aqua bubbles (circles)
      return {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: 'rgba(0, 151, 167, 0.4)',
      };
    } else {
      // MYSTERY_CARNIVAL: Carnival colorful confetti
      const colors = ['#C62828', '#FFD600', '#FF4081', '#00E676', '#2979FF'];
      const color = colors[index % colors.length];
      return {
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: index % 2 === 0 ? 0 : size / 2,
      };
    }
  };

  return <Animated.View style={[styles.particle, animatedStyle, getParticleStyle()]} />;
};

const CampaignOverlayInner: React.FC<Props> = ({ campaignId, overlay }) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (campaignId) {
      // Generate 25 particles
      setParticles(Array.from({ length: 25 }, (_, i) => i));
    } else {
      setParticles([]);
    }
  }, [campaignId]);

  if (!campaignId || !overlay) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((idx) => (
        <Particle key={idx} index={idx} campaignId={campaignId} />
      ))}
    </View>
  );
};

export const CampaignOverlay = memo(CampaignOverlayInner);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
