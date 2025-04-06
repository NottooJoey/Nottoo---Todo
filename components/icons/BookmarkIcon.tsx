import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../design-system/theme';

interface BookmarkIconProps {
  size?: number;
  color?: string;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  size = 15,
  color = '#FFFFFF',
}) => {
  // Calculate the height based on the original aspect ratio (15:24)
  const aspectRatio = 24 / 15;
  const height = size * aspectRatio;

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 15 24"
      fill="none"
    >
      <Path
        d="M0 4.8C0 3.11984 0 2.27976 0.32698 1.63803C0.614601 1.07354 1.07354 0.614601 1.63803 0.32698C2.27976 0 3.11984 0 4.8 0H10.2C11.8802 0 12.7202 0 13.362 0.32698C13.9265 0.614601 14.3854 1.07354 14.673 1.63803C15 2.27976 15 3.11984 15 4.8V24L10.6889 20.168C9.56059 19.165 8.99641 18.6635 8.35975 18.473C7.79886 18.3053 7.20114 18.3053 6.64025 18.473C6.00359 18.6635 5.43941 19.165 4.31105 20.168L0 24V4.8Z"
        fill={color}
      />
    </Svg>
  );
};

export default BookmarkIcon; 