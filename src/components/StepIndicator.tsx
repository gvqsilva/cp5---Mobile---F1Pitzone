import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = { steps: string[]; currentIndex: number };

// currentIndex: passos antes dele ficam "concluídos" (check), ele fica ativo, os depois ficam neutros.
export default function StepIndicator({ steps, currentIndex }: Props) {
  return (
    <View style={s.row}>
      {steps.map((label, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={label}>
            <View style={s.step}>
              <View style={[s.dot, (done || active) && s.dotOn]}>
                {done ? <Ionicons name="checkmark" size={12} color={colors.text} /> : <Text style={s.dotText}>{i + 1}</Text>}
              </View>
              <Text style={[s.label, active && { color: colors.text, fontWeight: '700' }]}>{label}</Text>
            </View>
            {i < steps.length - 1 && <View style={[s.line, done && s.lineOn]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  step: { alignItems: 'center', gap: 4 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.red },
  dotText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  label: { color: colors.textMuted, fontSize: 9 },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4, marginBottom: 14 },
  lineOn: { backgroundColor: colors.red },
});
