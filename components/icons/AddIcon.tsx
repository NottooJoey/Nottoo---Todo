import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AddIconProps {
  size?: number;
  color?: string;
}

export const AddIcon: React.FC<AddIconProps> = ({
  size = 16,
  color = '#020202',
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path 
          d="M8 3.33334V12.6667" 
          stroke={color} 
          strokeWidth={1.67} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M3.33331 8H12.6666" 
          stroke={color} 
          strokeWidth={1.67} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default AddIcon; 