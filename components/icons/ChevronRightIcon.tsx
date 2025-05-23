import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChevronRightIconProps {
  size?: number;
  color?: string;
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  size = 24,
  color = '#000',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path 
          d="M9 18L15 12L9 6" 
          stroke={color} 
          strokeWidth={2} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default ChevronRightIcon; 