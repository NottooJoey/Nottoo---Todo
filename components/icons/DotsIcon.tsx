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
  // Using the stroke weight from Figma (2px)
  const strokeWidth = 1.5; // Slightly reduced stroke weight for smaller dots
  // Make dots even smaller
  const dotSize = size / 16; 
  // Use horizontal spacing with slightly more space between dots
  const spacing = size / 3.5;
  
  return (
    <View style={{ 
      width: size, 
      height: size, 
      justifyContent: 'center', 
      alignItems: 'center',
      aspectRatio: 1, // Ensure perfect square
    }}>
      {/* Square viewBox to ensure aspect ratio is maintained */}
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        {/* First dot - leftmost */}
        <Circle 
          cx={(size - (dotSize * 3 + spacing * 2)) / 2 + dotSize / 2}
          cy={size / 2} 
          r={dotSize} 
          fill={color} 
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {/* Second dot - center */}
        <Circle 
          cx={size / 2}
          cy={size / 2} 
          r={dotSize} 
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth} 
        />
        {/* Third dot - rightmost */}
        <Circle 
          cx={(size + (dotSize * 3 + spacing * 2)) / 2 - dotSize / 2}
          cy={size / 2} 
          r={dotSize} 
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth} 
        />
      </Svg>
    </View>
  );
};

export default DotsIcon; 