import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import { typography } from '../design-system/theme';
import { BookmarkOutlineIcon } from '../components/icons';
import EmojiPicker from '../components/EmojiPicker';

// Color palette from Figma - exact order for 6x2 grid
const LIST_COLORS = [
  '#F97275', '#FB923D', '#FECB14', '#4FDC83', '#39BCF9', '#C383FB', // First row
  '#5B6770', '#D9A69F', '#EA426A', '#008080', '#6A0DAD', '#808000', // Second row
];

interface ListEditScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, icon: string, color: string) => void;
}

const COLOR_OPTION_SIZE = 36; // Size of each color option
const COLOR_OPTION_GAP = 20; // Gap between color options

const ListEditScreen: React.FC<ListEditScreenProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();
  const initialInsets = initialWindowMetrics?.insets || { top: 0, bottom: 0, left: 0, right: 0 };
  const safeAreaInsets = visible ? insets : initialInsets;
  const [listName, setListName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LIST_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('📑');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardVisible(true);
      setShowEmojiPicker(false);
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleClose = () => {
    setListName('');
    setSelectedColor(LIST_COLORS[0]);
    setSelectedIcon('📑');
    setShowEmojiPicker(false);
    setIsInputFocused(false);
    onClose();
  };

  const handleSubmit = () => {
    if (listName.trim()) {
      onSubmit(listName, selectedIcon, selectedColor);
      handleClose();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedIcon(emoji);
  };

  const handleIconPress = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
      setTimeout(() => setShowEmojiPicker(true), 50);
    } else {
      setShowEmojiPicker(true);
    }
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleContentPress = () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    }
  };

  const colorGridStyle = StyleSheet.create({
    grid: {
      gap: COLOR_OPTION_GAP,
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%' as any, // Type assertion to fix linter error
    }
  });

  const renderColorOption = (color: string) => {
    const isSelected = selectedColor === color;
    return (
      <TouchableOpacity
        key={color}
        style={[
          styles.colorOption,
          isSelected && styles.selectedColorContainer,
        ]}
        onPress={() => setSelectedColor(color)}
      >
        <View style={[
          styles.colorSquare,
          { backgroundColor: color },
          isSelected && styles.selectedColorSquare
        ]} />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={18}
        >
          <View style={styles.modalWrapper}>
            <View style={[
              styles.modalFrame,
              { 
                borderRadius: 16,
                marginBottom: showEmojiPicker ? 18 : 0 // Add margin when emoji picker is shown
              }
            ]}>
              {/* Title Frame */}
              <View style={styles.titleFrame}>
                <Text style={styles.title}>New List</Text>
                <TouchableOpacity 
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Main Content Frame */}
              <View style={styles.mainFrame}>
                {/* List Name Input */}
                <View style={styles.inputSection}>
                  <TouchableOpacity 
                    style={[
                      styles.iconContainer,
                      showEmojiPicker && styles.activeContainer
                    ]}
                    onPress={handleIconPress}
                  >
                    <View style={[styles.iconButton, { backgroundColor: selectedColor }]}>
                      <Text style={styles.iconEmoji}>{selectedIcon}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={[
                    styles.nameInputContainer,
                    isInputFocused && styles.activeContainer
                  ]}>
                    <TextInput
                      ref={inputRef}
                      style={styles.nameInput}
                      placeholder="List Name"
                      placeholderTextColor="#A1A1A1"
                      value={listName}
                      onChangeText={setListName}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      maxLength={50}
                    />
                  </View>
                </View>

                {/* Color Grid */}
                <View style={styles.colorSection}>
                  <View style={colorGridStyle.grid}>
                    {LIST_COLORS.map(renderColorOption)}
                  </View>
                </View>
              </View>

              {/* Button Frame */}
              <View style={styles.buttonFrame}>
                <TouchableOpacity
                  style={[styles.addButton, listName.trim() ? styles.addButtonActive : null]}
                  onPress={handleSubmit}
                  disabled={!listName.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showEmojiPicker && (
            <EmojiPicker
              visible={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={handleEmojiSelect}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalWrapper: {
    flex: 1,
    marginTop: 55,
  },
  keyboardView: {
    flex: 1,
  },
  modalFrame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  titleFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainFrame: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  buttonFrame: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#A1A1A1',
    fontFamily: typography.fontFamily.primary,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '400',
    lineHeight: 24,
  },
  inputSection: {
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeContainer: {
    borderColor: '#000000',
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  nameInputContainer: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: typography.fontFamily.primary,
    color: '#000000',
    paddingVertical: 8,
  },
  colorSection: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  colorOption: {
    width: COLOR_OPTION_SIZE,
    height: COLOR_OPTION_SIZE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: COLOR_OPTION_GAP / 2,
  },
  selectedColorContainer: {
    borderWidth: 2,
    borderColor: '#A1A1A1',
  },
  colorSquare: {
    width: COLOR_OPTION_SIZE,
    height: COLOR_OPTION_SIZE,
    borderRadius: 10,
  },
  selectedColorSquare: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#636366',
  },
  addButtonActive: {
    backgroundColor: '#007AFF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    fontFamily: typography.fontFamily.primary,
  },
  iconEmoji: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ListEditScreen; 