// Waveform.js
import { Colors } from '@/constants/Colors';
import { lfsr } from '@/utils/random';
import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const Waveform = ({
  width = 300,
  height = 50,
  numBars = 80,
  barWidth = 1,
  barGap = 1,
  progress = 0.5,
  activeColor = Colors['dark'].tint,
  inactiveColor = Colors['dark'].tabIconDefault,
  seed = 10000,
}) => {
  const generateBars = (numBars: number, height: number, seed: number) => {
    const bars = [];
    const random = lfsr(seed);

    for (let i = 0; i < numBars; i++) {
      const x = i * (barWidth + barGap);
      const barHeight = random() * height * 0.6 + height * 0.1;
      bars.push({ x, barHeight });
    }

    return bars;
  };
  const bars = generateBars(numBars, height, seed);

  const numFilledBars = Math.floor(progress * numBars);

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Svg height={height} width={width}>
        {bars.map((bar, index) => (
          <React.Fragment key={index}>
            <Rect
              x={bar.x}
              y={height / 2 - bar.barHeight / 2}
              width={barWidth}
              height={bar.barHeight / 2}
              fill={index < numFilledBars ? activeColor : inactiveColor}
            />
            <Rect
              x={bar.x}
              y={height / 2}
              width={barWidth}
              height={bar.barHeight / 2}
              fill={index < numFilledBars ? activeColor : inactiveColor}
            />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

export default Waveform;
