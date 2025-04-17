import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Emoji categories
const CATEGORIES = {
  'SMILES & PEOPLES': [
    '😂', '😊', '😐', '😫', '😐', '😯', '😂', '😭',
    '😇', '😤', '😄', '😀', '😣', '😆', '😈', '🙂',
    '😢', '😣', '😭', '😟', '😔', '🙏', '🧑', '👋',
    '🤭', '😯', '🤔', '😵', '👱', '☺️', '👨', '👱‍♀️',
    '☹️', '🙂', '🧐', '😛', '😊', '😪', '😫', '🐱',
  ],
  'ANIMALS & NATURE': [
    '🐶', '🐱', '🦁', '🐯', '🐮', '🐷', '🐸', '🐢',
    '🌺', '🌸', '🍀', '🌿', '🌴', '🌙', '⭐️', '🌞',
  ],
  'ACTIVITIES': [
    '⚽️', '🎾', '🏀', '🎲', '🎭', '🎪', '🎨', '🎬',
    '🎤', '🎸', '🎮', '🎯',
  ],
  'OBJECTS': [
    '📑', '📝', '✅', '⭐️', '❤️', '🎯', '🎨', '📚',
    '🏠', '🌟', '💡', '🎵', '🎮', '🍔', '🛒', '💪',
  ],
};

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

const PICKER_HEIGHT = 280; // Slightly reduced height

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  visible,
  onClose,
  onEmojiSelect,
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 16;
  const gridGap = 12;
  const numColumns = 7; // We want 7 emojis per row
  const emojiSize = Math.floor((screenWidth - (horizontalPadding * 2) - (gridGap * (numColumns - 1))) / numColumns);

  const renderCategory = ({ category, emojis }: { category: string, emojis: string[] }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <View style={[styles.emojiGrid, { gap: gridGap }]}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={`${emoji}-${index}`}
            style={[styles.emojiButton, { width: emojiSize, height: emojiSize }]}
            onPress={() => onEmojiSelect(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(CATEGORIES)}
        renderItem={({ item: [category, emojis] }) => renderCategory({ category, emojis })}
        keyExtractor={(item) => item[0]}
        showsVerticalScrollIndicator={true}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 16 } // Add bottom padding to ensure last row is visible
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F2F2F',
    height: PICKER_HEIGHT,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
  },
  categoryContainer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  emojiButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
});

export default EmojiPicker; 