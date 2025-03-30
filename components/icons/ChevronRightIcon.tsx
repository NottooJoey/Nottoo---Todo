import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChevronRightIconProps {
  size?: number;
  color?: string;
}

export const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  size = 10,
  color = '#020202',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
        <Path 
          d="M3.5 8.5L7 5L3.5 1.5" 
          stroke={color} 
          strokeWidth={1.67} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default ChevronRightIcon; 