import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated, Easing, FlatList, ImageBackground, ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme';
import { RootStackParamList } from '../../navigation';
import Logo from '../../components/Logo';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

type Slide = { id: string; title: string; text: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; accent: string; tag: string; image: ImageSourcePropType };

const SLIDES: Slide[] = [
  { id: '1', title: 'Fórmula 1', text: 'Acompanhe pilotos, equipes, corridas, notícias, circuitos e tudo o que acontece no campeonato.', icon: 'flag-checkered', accent: '#E10600', tag: 'AO VIVO', image: require('../../assets/intro-f1.jpg') },
  { id: '2', title: 'Fantasy', text: 'Escolha seus pilotos, equipe e chefe. Compita com seus amigos e prove que você entende de Fórmula 1.', icon: 'trophy-outline', accent: '#F2B84B', tag: 'MONTE SEU TIME', image: require('../../assets/intro-fantasy.png') },
  { id: '3', title: 'Loja', text: 'Encontre produtos, coleções e itens exclusivos para mostrar sua paixão pela Fórmula 1.', icon: 'shopping-outline', accent: '#5CC8FF', tag: 'EXCLUSIVOS', image: require('../../assets/intro-loja.png') },
];

export default function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const introY = useRef(new Animated.Value(18)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const footerY = useRef(new Animated.Value(20)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(introY, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(introOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
    ]).start();
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [introOpacity, introY, pulse]);

  useEffect(() => {
    if (index === SLIDES.length - 1) {
      footerY.setValue(20);
      footerOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(footerY, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(footerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    }
  }, [footerOpacity, footerY, index]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: itemIndex }) => {
          const inputRange = [(itemIndex - 1) * width, itemIndex * width, (itemIndex + 1) * width];
          const translateX = scrollX.interpolate({ inputRange, outputRange: [-28, 0, 28], extrapolate: 'clamp' });
          const scale = scrollX.interpolate({ inputRange, outputRange: [0.94, 1, 0.94], extrapolate: 'clamp' });
          const contentOpacity = scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp' });
          const contentY = scrollX.interpolate({ inputRange, outputRange: [16, 0, 16], extrapolate: 'clamp' });
          return (
            <ImageBackground source={item.image} style={[styles.slide, { width }]} imageStyle={styles.slideImage}>
              <View style={styles.slideShade} />
              <View style={styles.hero}>
                <Animated.View style={[styles.heroArt, { transform: [{ translateX }, { scale }] }]}>
                  <View style={[styles.orbit, { borderColor: item.accent }]} />
                  <View style={[styles.orbitSmall, { borderColor: item.accent }]} />
                  <Animated.View style={[styles.signal, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.7] }), backgroundColor: item.accent }]} />
                  <MaterialCommunityIcons name={item.icon} size={96} color={item.accent} />
                </Animated.View>
                <Animated.View style={[styles.logo, { opacity: introOpacity, transform: [{ translateY: introY }] }]}><Logo /></Animated.View>
                <Animated.View style={[styles.heroFooter, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}>
                  <Text style={[styles.eyebrow, { color: item.accent }]}>{item.tag}</Text>
                  <Text style={styles.headline}>A plataforma completa para fãs de fórmula 1</Text>
                </Animated.View>
              </View>
              <Animated.View style={[styles.panel, { opacity: Animated.multiply(introOpacity, contentOpacity), transform: [{ translateY: Animated.add(introY, contentY) }] }]}>
                <Text style={styles.step}>0{item.id} <Text style={styles.stepLine}>/ 03</Text></Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </Animated.View>
            </ImageBackground>
          );
        }}
      />

      <View style={styles.dots} pointerEvents="none">
        {SLIDES.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && { backgroundColor: SLIDES[index].accent }, i === index && styles.dotActive]} />
        ))}
      </View>

      {index < SLIDES.length - 1 && (
        <Animated.View style={[styles.nextButtonWrap, { opacity: introOpacity, transform: [{ translateY: introY }] }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir para a próxima introdução"
            onPress={() => listRef.current?.scrollToIndex({ index: index + 1, animated: true })}
            style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
          >
            <Text style={styles.nextButtonText}>Próximo</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.text} />
          </Pressable>
        </Animated.View>
      )}

      {index === SLIDES.length - 1 && (
        <Animated.View style={[styles.footer, { opacity: footerOpacity, transform: [{ translateY: footerY }] }]}>
          <Button title="Faça parte" onPress={() => navigation.navigate('Register')} style={{ width: 200 }} />
          <Text style={styles.footerText}>Já faz parte da comunidade?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Entre</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  slide: { flex: 1, backgroundColor: colors.bg },
  slideImage: { resizeMode: 'cover' },
  slideShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(7, 7, 13, 0.48)' },
  hero: { height: '62%', backgroundColor: 'transparent', justifyContent: 'flex-end', padding: 24, paddingBottom: 76, overflow: 'hidden' },
  heroArt: { position: 'absolute', top: 84, right: 22, width: 190, height: 190, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', width: 174, height: 174, borderWidth: 1, borderRadius: 87, opacity: 0.28, transform: [{ rotate: '-22deg' }, { scaleY: 0.45 }] },
  orbitSmall: { position: 'absolute', width: 130, height: 130, borderWidth: 1, borderRadius: 65, opacity: 0.2, transform: [{ rotate: '28deg' }, { scaleY: 0.45 }] },
  signal: { position: 'absolute', width: 116, height: 116, borderRadius: 58, opacity: 0.3 },
  logo: { position: 'absolute', top: 56, left: 24 },
  heroFooter: { zIndex: 1 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 10 },
  headline: { color: colors.text, fontSize: 23, lineHeight: 28, fontWeight: '800', maxWidth: 290 },
  panel: { flex: 1, backgroundColor: 'rgba(20, 18, 31, 0.95)', borderTopRightRadius: 84, marginTop: -18, padding: 28, paddingTop: 34 },
  step: { color: colors.red, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 18 },
  stepLine: { color: colors.textMuted, fontWeight: '500' },
  title: { color: colors.text, fontSize: 27, lineHeight: 32, fontWeight: '800', marginBottom: 12 },
  text: { color: colors.textMuted, fontSize: 16, lineHeight: 24, maxWidth: 320 },
  dots: { position: 'absolute', left: 28, top: '62%', flexDirection: 'row', gap: 7, marginTop: -60 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24 },
  nextButtonWrap: { position: 'absolute', left: 0, right: 0, bottom: 70, alignItems: 'center' },
  nextButton: { height: 44, borderRadius: 22, backgroundColor: colors.redDark, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18 },
  nextButtonPressed: { opacity: 0.78, transform: [{ scale: 0.97 }] },
  nextButtonText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', gap: 4 },
  footerText: { color: colors.text, fontSize: 11, marginTop: 14 },
  link: { color: colors.red, fontSize: 14, fontWeight: '700' },
});
