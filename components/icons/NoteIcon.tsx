import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

interface NoteIconProps {
  size?: number;
  color?: string;
}

export const NoteIcon: React.FC<NoteIconProps> = ({
  size = 20,
  color = 'rgba(0, 0, 0, 0.6)',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Rect 
          x={4} 
          y={4} 
          width={12} 
          height={12} 
          stroke={color} 
          strokeWidth={1.5} 
        />
        <Line 
          x1={7} 
          y1={8} 
          x2={13} 
          y2={8} 
          stroke={color} 
          strokeWidth={1.5} 
          strokeLinecap="round" 
        />
        <Line 
          x1={7} 
          y1={12} 
          x2={13} 
          y2={12} 
          stroke={color} 
          strokeWidth={1.5} 
          strokeLinecap="round" 
        />
      </Svg>
    </View>
  );
};

export default NoteIcon; 