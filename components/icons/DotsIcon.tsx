import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DotsIconProps {
  size?: number;
  color?: string;
}

export const DotsIcon: React.FC<DotsIconProps> = ({
  size = 20,
  color = '#020202',
}) => {
  const dotSize = size / 10;
  const spacing = size / 4;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={dotSize * 3 + spacing * 2} viewBox={`0 0 ${size} ${dotSize * 3 + spacing * 2}`} fill="none">
        <Circle 
          cx={size / 2} 
          cy={dotSize / 2} 
          r={dotSize} 
          fill={color} 
        />
        <Circle 
          cx={size / 2} 
          cy={dotSize / 2 + dotSize + spacing} 
          r={dotSize} 
          fill={color} 
        />
        <Circle 
          cx={size / 2} 
          cy={dotSize / 2 + (dotSize + spacing) * 2} 
          r={dotSize} 
          fill={color} 
        />
      </Svg>
    </View>
  );
};

export default DotsIcon; 