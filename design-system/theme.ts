// Design system theme file based on Figma design

export const colors = {
  primary: '#9A44F8', // Purple CTA button
  secondary: '#F97275', // Red list icon
  background: '#F7F7F5',  // Updated to match Figma background color
  screenBackground: '#020202', // Black background
  text: '#020202', // Nearly black text
  textSecondary: '#A1A1A1', // Gray text (No Todos)
  border: '#E0E0E0',
  divider: '#C6C6C8', // Move bar
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    primary: 'Lexend',
    system: 'System',
  },
  fontSizes: {
    xs: 12,
    sm: 14, // List items
    md: 16,
    lg: 18,
    xl: 20, // "No Todos" text
    xxl: 24, // Section titles
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500', // Most text elements
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    compact: 0.5, // For title headings
    default: 0.85, // For list items
    relaxed: 1.2,
  }
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20, // Frames and buttons
  round: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
}; 