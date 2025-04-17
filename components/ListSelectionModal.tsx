import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { typography } from '../design-system/theme';
import { useTodo } from '../context/TodoContext';
import { BookmarkIcon } from './icons';
import ListEditScreen from '../screens/ListEditScreen';

interface ListSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectList: (listName: string) => void;
  selectedList: string;
  style?: object;
}

const ListSelectionModal: React.FC<ListSelectionModalProps> = ({
  visible,
  onClose,
  onSelectList,
  selectedList,
  style,
}) => {
  const { state, dispatch } = useTodo();
  const [isListEditVisible, setIsListEditVisible] = useState(false);

  const handleAddList = (name: string, icon: string, color: string) => {
    dispatch({
      type: 'ADD_LIST',
      payload: { name, icon, color },
    });
    setIsListEditVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Full screen overlay that shades the entire screen */}
      <Pressable 
        style={styles.fullScreenOverlay} 
        onPress={onClose}
      />
      
      {/* Modal content */}
      <View style={[styles.wrapper, style]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select List</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsListEditVisible(true)}
            >
              <Feather name="plus" size={20} color="#020202" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.listContainer}>
            {state.lists.map((list) => (
              <TouchableOpacity 
                key={list.name}
                style={styles.listItem} 
                onPress={() => onSelectList(list.name)}
              >
                <View style={styles.listItemContent}>
                  <View style={[styles.listIcon, { backgroundColor: list.color }]}>
                    {list.icon === '📑' ? (
                      <BookmarkIcon size={12} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.listItemIcon}>{list.icon}</Text>
                    )}
                  </View>
                  <Text style={styles.listName}>{list.name}</Text>
                </View>
                {selectedList === list.name && (
                  <Feather name="check" size={20} color="#000000" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* List Edit Screen */}
      <ListEditScreen
        visible={isListEditVisible}
        onClose={() => setIsListEditVisible(false)}
        onSubmit={handleAddList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    zIndex: 1001,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 8,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 24,
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: '#020202',
    lineHeight: 24,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    maxHeight: 300,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemIcon: {
    fontSize: 12,
  },
  listName: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
  },
});

export default ListSelectionModal; 