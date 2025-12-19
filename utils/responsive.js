import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro - 375x812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Scale factor based on screen width
const scale = SCREEN_WIDTH / BASE_WIDTH;
const verticalScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Moderate scale for font sizes (less aggressive scaling)
const moderateScale = (size, factor = 0.5) => {
  return size + (scale - 1) * size * factor;
};

// Responsive width (percentage-based)
export const wp = (percentage) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

// Responsive height (percentage-based)
export const hp = (percentage) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Responsive font size
export const rf = (size) => {
  const newSize = moderateScale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Responsive size (for general sizing)
export const rs = (size) => {
  return Math.round(size * scale);
};

// Get screen dimensions
export const getScreenDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scale,
    verticalScale,
  };
};

// Check if device is tablet
export const isTablet = () => {
  return SCREEN_WIDTH >= 768;
};

// Check if device is small screen
export const isSmallDevice = () => {
  return SCREEN_WIDTH < 375;
};

// Check if device is large screen
export const isLargeDevice = () => {
  return SCREEN_WIDTH > 414;
};

// Platform-specific padding
export const getPlatformPadding = (basePadding) => {
  return Platform.OS === 'ios' ? basePadding : basePadding - 2;
};

// Safe area insets helper
export const getSafeAreaInsets = () => {
  // This is a basic implementation
  // For production, use react-native-safe-area-context
  const topInset = Platform.OS === 'ios' ? (SCREEN_HEIGHT > 800 ? 44 : 20) : 0;
  const bottomInset = Platform.OS === 'ios' ? (SCREEN_HEIGHT > 800 ? 34 : 0) : 0;
  
  return {
    top: topInset,
    bottom: bottomInset,
    left: 0,
    right: 0,
  };
};

