import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Keyboard,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Common emojis array - you can expand this or load from a JSON file
const EMOJIS = [
  '📑', '📝', '✅', '⭐️', '❤️', '🎯', '🎨', '📚',
  '🏠', '🌟', '💡', '🎵', '🎮', '🍔', '🛒', '💪',
  '🎉', '✨', '🌈', '🎸', '📷', '🎬', '🎤', '🎨',
  '🏃', '🚴', '🎾', '⚽️', '🏀', '🎲', '🎭', '🎪',
  '🌺', '🌸', '🍀', '🌿', '🌴', '🌙', '⭐️', '🌞',
  '🐶', '🐱', '🦁', '🐯', '🐮', '🐷', '🐸', '🐢',
  // Add more emojis to make the list scrollable
  '🎪', '🎭', '🎨', '🎬', '🎤', '🎸', '🎮', '🎯',
  '🏀', '⚽️', '🎾', '🏈', '🏉', '🎳', '🎲',
];

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  visible,
  onClose,
  onEmojiSelect,
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const emojiSize = (screenWidth - 32) / 8;

  React.useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleEmojiPress = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const renderEmoji = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.emojiButton, { width: emojiSize, height: emojiSize }]}
      onPress={() => handleEmojiPress(item)}
    >
      <Text style={styles.emojiText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Emoji</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={EMOJIS}
          renderItem={renderEmoji}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={8}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.emojiGrid,
            { paddingBottom: insets.bottom + 32 }
          ]}
          bounces={true}
        />
        <LinearGradient
          colors={['rgba(47, 47, 47, 0)', 'rgba(47, 47, 47, 0.1)', 'rgba(47, 47, 47, 0.2)']}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F',
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  emojiGrid: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emojiButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  fadeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
    zIndex: 1,
  },
});

export default EmojiPicker; 