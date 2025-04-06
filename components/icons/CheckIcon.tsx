import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface CheckIconProps {
  size?: number;
  color?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  size = 25,
  color = '#FFFFFF',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Circle 
          cx={8} 
          cy={8} 
          r={7} 
          stroke={color} 
          strokeWidth={1.5} 
        />
        <Path 
          d="M5 8L7 10L11 6" 
          stroke={color} 
          strokeWidth={1.5} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default CheckIcon; 