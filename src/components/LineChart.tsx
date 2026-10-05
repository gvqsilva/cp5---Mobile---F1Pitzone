import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { colors } from '../theme';

type Point = { label: string; value: number };

// Requer `npx expo install react-native-svg`.
export default function LineChart({ data, height = 120, yLabels }: { data: Point[]; height?: number; yLabels?: number[] }) {
  const w = 300;
  const padTop = 10;
  const padBottom = 18;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = w / (data.length - 1);
  const toY = (v: number) => padTop + (1 - v / max) * (height - padTop - padBottom);
  const points = data.map((d, i) => `${i * stepX},${toY(d.value)}`).join(' ');

  return (
    <View style={{ flexDirection: 'row' }}>
      {!!yLabels && (
        <View style={{ height: height - padBottom, justifyContent: 'space-between', paddingTop: padTop, marginRight: 6 }}>
          {yLabels.slice().reverse().map((y) => (
            <Text key={y} style={s.axisLabel}>{y}</Text>
          ))}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}>
          {(yLabels ?? [0, 1]).map((_, i, arr) => {
            const y = padTop + (i / (arr.length - 1 || 1)) * (height - padTop - padBottom);
            return <Line key={i} x1={0} x2={w} y1={y} y2={y} stroke={colors.border} strokeWidth={1} />;
          })}
          <Polyline points={points} fill="none" stroke={colors.red} strokeWidth={2} />
          {data.map((d, i) => (
            <Circle key={d.label} cx={i * stepX} cy={toY(d.value)} r={3} fill={colors.red} />
          ))}
        </Svg>
        <View style={s.xRow}>
          {data.map((d) => <Text key={d.label} style={s.axisLabel}>{d.label}</Text>)}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  xRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  axisLabel: { color: colors.textMuted, fontSize: 9 },
});
