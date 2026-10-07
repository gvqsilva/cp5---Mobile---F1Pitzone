import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import useNav from '../../hooks/useNav';
import { CATEGORIAS } from '../../services/store';

export default function CategoriasScreen() {
  const nav = useNav();
  const [busca, setBusca] = useState('');

  return (
    <Screen title="Categorias">
      <Text style={s.intro}>Encontre seu próximo item favorito</Text>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar produto"
        placeholderTextColor={colors.textMuted}
        style={s.search}
        onSubmitEditing={() => busca.trim() && nav.navigate('Produtos', { busca })}
      />
      <View style={s.grid}>
        {CATEGORIAS.map((c) => (
          <Pressable key={c.id} style={s.card} onPress={() => nav.navigate('Produtos', { categoriaId: c.id })}>
            <Ionicons name={c.icone} size={28} color={colors.red} />
            <Text style={s.label}>{c.nome.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  intro: { color: colors.text, fontSize: 19, fontWeight: '800', marginBottom: 2 },
  search: { height: 46, borderRadius: radius.pill, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 16, fontSize: 13, borderWidth: 1, borderColor: colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', height: 116, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { color: colors.text, fontSize: 11, fontWeight: '700' },
});
