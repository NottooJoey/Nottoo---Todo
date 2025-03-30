import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface CheckIconProps {
  size?: number;
  color?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  size = 20,
  color = '#020202',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Circle 
          cx={10} 
          cy={10} 
          r={9} 
          stroke={color} 
          strokeWidth={1.67} 
        />
        <Path 
          d="M6.5 10.5L8.5 12.5L13.5 7.5" 
          stroke={color} 
          strokeWidth={1.67} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default CheckIcon; 