import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
  PanResponder,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../design-system/theme';
import { Feather } from '@expo/vector-icons';
import ListSelectionModal from '../components/ListSelectionModal';
import { useTodo, Todo } from '../context/TodoContext';

// Constants from Figma
const INPUT_FRAME_HEIGHT = 713;
const CONTROL_FRAME_HEIGHT = 56;
const CONTROL_FRAME_GAP = 24;
const CONTROL_FRAME_BUTTON_GAP = 78;

interface TodoEditScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, notes: string, selectedList: string, isBacklog?: boolean) => void;
  onDelete?: () => void;
  initialTitle?: string;
  initialNotes?: string;
  isEditing?: boolean;
  listName?: string;
  selectedTodo?: Todo | null;
  isBacklog?: boolean;
}

const TodoEditScreen: React.FC<TodoEditScreenProps> = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  initialTitle = '',
  initialNotes = '',
  isEditing = false,
  listName = 'Tasks',
  selectedTodo: initialSelectedTodo = null,
  isBacklog = false,
}) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTodo();
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [isListSelectionVisible, setIsListSelectionVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(listName);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(initialSelectedTodo);

  // Reset state when screen becomes visible
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setNotes(initialNotes);
      setSelectedList(listName);
      setIsCompleted(initialSelectedTodo?.completed || false);
      setSelectedTodo(initialSelectedTodo);
    }
  }, [visible, initialTitle, initialNotes, listName, initialSelectedTodo]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dy } = gestureState;
      return dy > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      const { dy } = gestureState;
      if (dy > 50) {
        Keyboard.dismiss();
      }
    },
    onPanResponderRelease: () => {},
  });

  const handleClose = () => {
    if (title.trim()) {
      onSubmit(title.trim(), notes.trim(), selectedList, isBacklog);
    }
    // Reset state
    setTitle('');
    setNotes('');
    setSelectedList('Tasks');
    setIsCompleted(false);
    onClose();
  };

  const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(event.nativeEvent.selection);
  };

  const handleListButtonPress = () => {
    setIsListSelectionVisible(!isListSelectionVisible);
    if (!isListSelectionVisible) {
      Keyboard.dismiss();
    }
  };

  const handleListSelection = (newListName: string) => {
    setSelectedList(newListName);
    setIsListSelectionVisible(false);
  };

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  const renderNotesInput = () => {
    const lineHeight = Math.round(18 * 1.25);
    
    return (
      <View style={styles.notesInputContainer}>
        <TextInput
          style={[
            styles.notesInput,
            !notes && styles.placeholderStyle,
            isCompleted && styles.completedInput,
            { lineHeight }
          ]}
          placeholder="Notes"
          placeholderTextColor="#A1A1A1"
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsTitleFocused(false)}
          onSelectionChange={handleSelectionChange}
          selection={selection}
          editable={!isCompleted}
        />
      </View>
    );
  };

  const adjustedInputFrameHeight = keyboardHeight > 0 
    ? INPUT_FRAME_HEIGHT - keyboardHeight + (Platform.OS === 'ios' ? insets.bottom : 0) - 16
    : INPUT_FRAME_HEIGHT;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View 
        style={[styles.container, { paddingTop: insets.top }]}
        {...panResponder.panHandlers}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={-insets.bottom + 24}
        >
          <View style={styles.content}>
            <View 
              style={[
                styles.inputFrame, 
                { height: adjustedInputFrameHeight },
                isListSelectionVisible && styles.inputFrameShaded,
                isCompleted && styles.completedFrame
              ]}
            >
              <View style={styles.titleRow}>
                <View style={styles.titleInputContainer}>
                  <TextInput
                    style={[
                      styles.titleInput,
                      !title && styles.placeholderStyle,
                      isCompleted && styles.completedInput
                    ]}
                    placeholder="Title"
                    placeholderTextColor="#A1A1A1"
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                    onFocus={() => setIsTitleFocused(true)}
                    onBlur={() => setIsTitleFocused(false)}
                    editable={!isCompleted}
                  />
                </View>
                <TouchableOpacity 
                  onPress={handleClose} 
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={24} color="#020202" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.notesContainer}>
                {renderNotesInput()}
                <TouchableOpacity
                  style={[
                    styles.checklistButton,
                    isTitleFocused && styles.checklistButtonDisabled
                  ]}
                  disabled={isTitleFocused}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather 
                    name="list" 
                    size={24}
                    color={isTitleFocused ? "#C6C6C8" : "#020202"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ListSelectionModal
              visible={isListSelectionVisible}
              onClose={() => setIsListSelectionVisible(false)}
              onSelectList={handleListSelection}
              selectedList={selectedList}
              style={{
                bottom: CONTROL_FRAME_HEIGHT + CONTROL_FRAME_GAP + insets.bottom,
              }}
            />

            <View 
              style={[
                styles.controlFrame,
                {
                  height: CONTROL_FRAME_HEIGHT,
                  marginTop: CONTROL_FRAME_GAP,
                  paddingBottom: insets.bottom,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onDelete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="trash" size={20} color="#C6C6C8" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.listSelectionButton,
                  isListSelectionVisible && styles.listSelectionButtonActive
                ]}
                onPress={handleListButtonPress}
              >
                <Text style={[
                  styles.listSelectionText,
                  isListSelectionVisible && styles.listSelectionTextActive
                ]}>List</Text>
                <Text style={[
                  styles.listSelectionSeparator,
                  isListSelectionVisible && styles.listSelectionSeparatorActive
                ]}>|</Text>
                <Text style={[
                  styles.listSelectionText,
                  isListSelectionVisible && styles.listSelectionTextActive
                ]}>{selectedList}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleToggleComplete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather 
                  name={isCompleted ? "check-circle" : "circle"} 
                  size={20} 
                  color={isCompleted ? colors.primary : "#C6C6C8"} 
                />
              </TouchableOpacity>
            </View>
          </View>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  inputFrame: {
    backgroundColor: '#F7F7F5',
    borderRadius: 20,
    padding: 16,
    paddingTop: 20,
    ...shadows.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 118,
  },
  titleInputContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleInput: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    padding: 4,
    height: 30,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#C6C6C8',
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  notesContainer: {
    flex: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  notesInputContainer: {
    flex: 1,
    position: 'relative',
  },
  notesInput: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 18,
    fontWeight: '400',
    color: colors.text,
    padding: 4,
    flex: 1,
    paddingBottom: 50,
  },
  controlFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 1001,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(247, 247, 245, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247, 247, 245, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 22,
    height: 40,
    gap: 10,
    minWidth: 140,
    zIndex: 1001,
  },
  listSelectionText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: 20,
  },
  listSelectionTextActive: {
    color: '#000000',
  },
  listSelectionSeparator: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: 20,
  },
  listSelectionSeparatorActive: {
    color: '#000000',
    opacity: 0.5,
  },
  checklistButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(247, 247, 245, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistButtonDisabled: {
    backgroundColor: 'rgba(247, 247, 245, 0.1)',
    opacity: 0.5,
  },
  placeholderStyle: {
    color: '#A1A1A1',
  },
  inputFrameShaded: {
    opacity: 0.7,
  },
  listSelectionButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  completedFrame: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
  },
  completedInput: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});

export default TodoEditScreen; 