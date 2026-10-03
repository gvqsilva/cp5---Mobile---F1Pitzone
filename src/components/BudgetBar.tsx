import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';
import { money } from '../services/format';

export default function BudgetBar({ used, total = 100 }: { used: number; total?: number }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.textMuted, fontSize: 10 }}>Orçamento utilizado</Text>
        <Text style={{ color: colors.text, fontSize: 11, fontWeight: '700' }}>{money(used)} / {money(total)}</Text>
      </View>
      <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceAlt, marginTop: 4 }}>
        <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.red, width: `${Math.min(100, (used / total) * 100)}%` }} />
      </View>
    </View>
  );
}
