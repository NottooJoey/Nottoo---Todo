import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  CheckIcon,
  AddIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  DotsIcon,
  NoteIcon,
} from '../components/icons';
import {
  SectionHeader,
  ListItem,
  MoveBar,
  NewTodoButton,
  TodoItem,
} from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../design-system/theme';
import { useTodo, Todo } from '../context/TodoContext';
import TodoEditScreen from './TodoEditScreen';
import ListEditScreen from './ListEditScreen';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Core layout constants - updated from Figma
const SECTION_SPACING = 8; // Spacing between sections (from Figma gap: 8px)
const TOP_HEADER_MARGIN = 66; // Fixed distance from top of screen to header (from Figma padding: 66px 0px 0px)
const HEADER_HEIGHT = 56; // Height of section headers
const TOP_MIN_HEIGHT = TOP_HEADER_MARGIN + HEADER_HEIGHT; // Minimum height includes fixed header position
const BOTTOM_MIN_HEIGHT = 110; // Minimum height for bottom section
const HORIZONTAL_PADDING = 26; // Horizontal padding for sections (from Figma padding: 10px 26px)

// Calculate available space
const SAFE_AREA_TOP = 47; // iPhone status bar height
const TOTAL_HEIGHT = SCREEN_HEIGHT - SAFE_AREA_TOP;
const MAX_SECTION_HEIGHT = TOTAL_HEIGHT - BOTTOM_MIN_HEIGHT - (12 * 2); // 12px spacing between sections
const DEFAULT_TOP_HEIGHT = (TOTAL_HEIGHT - (12 * 2)) * 0.6; // 60% in default state
const DEFAULT_BOTTOM_HEIGHT = (TOTAL_HEIGHT - (12 * 2)) * 0.4; // 40% in default state

interface ListViewTitleProps {
  icon: React.ReactNode;
  iconBackgroundColor: string;
  title: string;
  count: number;
}

const ListViewTitle = ({ icon, iconBackgroundColor, title, count }: ListViewTitleProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <View style={{
      width: 24,
      height: 24,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: iconBackgroundColor,
      overflow: 'hidden',
    }}>
      <View style={{ transform: [{ scale: 0.7 }], justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        {icon}
      </View>
    </View>
    <Text style={{
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSizes.sm,
      fontWeight: '500',
      color: colors.text,
      lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
    }}>{title}</Text>
    <Text style={{
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSizes.sm,
      fontWeight: '500',
      color: colors.text,
      lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
      marginLeft: 8,
      width: 8,
      textAlign: 'center',
    }}>{count}</Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTodo();
  const [isEditScreenVisible, setIsEditScreenVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedList, setSelectedList] = useState('Tasks');
  const [selectedListForView, setSelectedListForView] = useState<string | null>(null);
  const [isCommitted, setIsCommitted] = useState(true);
  const newTodosButtonRef = useRef<View>(null);
  const controlPanelRef = useRef<View>(null);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);
  const [isListEditScreenVisible, setIsListEditScreenVisible] = useState(false);

  // Animation values
  const topSectionHeight = useRef(new Animated.Value(DEFAULT_TOP_HEIGHT)).current;
  const dragStartY = useRef(0);
  const lastTopSectionHeight = useRef(DEFAULT_TOP_HEIGHT);

  // Track current top section height
  useEffect(() => {
    const id = topSectionHeight.addListener(({ value }) => {
      lastTopSectionHeight.current = value;
    });
    return () => topSectionHeight.removeListener(id);
  }, []);

  // Measure control panel height after rendering
  useEffect(() => {
    if (controlPanelRef.current) {
      setTimeout(() => {
        // @ts-ignore - measure exists on View
        controlPanelRef.current.measure((x, y, width, height, pageX, pageY) => {
          if (height > 0) {
            setControlPanelHeight(height);
          }
        });
      }, 100); // Small delay to ensure rendering is complete
    }
  }, []);

  // Calculate bottom section height based on top section height
  const bottomSectionHeight = topSectionHeight.interpolate({
    inputRange: [TOP_MIN_HEIGHT, MAX_SECTION_HEIGHT],
    outputRange: [
      TOTAL_HEIGHT - TOP_MIN_HEIGHT - (12 * 2), 
      BOTTOM_MIN_HEIGHT
    ],
    extrapolate: 'clamp',
  });

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only start drag if not pressing the New Todos button
        if (newTodosButtonRef.current) {
          const buttonElement = newTodosButtonRef.current;
          // @ts-ignore - measure exists on View
          buttonElement.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            const touchX = evt.nativeEvent.pageX;
            const touchY = evt.nativeEvent.pageY;
            
            // Check if touch is within button bounds
            if (touchX >= pageX && touchX <= pageX + width &&
                touchY >= pageY && touchY <= pageY + height) {
              return false;
            }
          });
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        dragStartY.current = lastTopSectionHeight.current;
      },

      onPanResponderMove: (_, { dy }) => {
        const newY = Math.max(
          TOP_MIN_HEIGHT,
          Math.min(MAX_SECTION_HEIGHT, dragStartY.current + dy)
        );
        
        topSectionHeight.setValue(newY);
      },

      onPanResponderRelease: () => {
        // Current value is tracked by the listener
      },
    })
  ).current;

  const handleNewTodo = () => {
    console.log('handleNewTodo called');
    setSelectedTodo(null);
    setSelectedList(selectedListForView || 'Tasks');
    setIsEditScreenVisible(true);
    console.log('isEditScreenVisible set to true, selectedList:', selectedListForView || 'Tasks');
  };

  const handleTodoPress = (todo: Todo) => {
    setSelectedTodo(todo);
    setSelectedList(todo.listName);
    setIsEditScreenVisible(true);
  };

  const handleEditScreenClose = () => {
    setIsEditScreenVisible(false);
    setSelectedTodo(null);
    setSelectedList('Tasks');
    setIsCommitted(true);
  };

  const handleTodoSubmit = (title: string, notes: string, selectedList: string, isBacklog: boolean = false) => {
    if (selectedTodo) {
      // Update existing todo
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          ...selectedTodo,
          title,
          notes,
          listName: selectedList,
        },
      });
    } else {
      // Add new todo - committed only if not backlog
      dispatch({
        type: 'ADD_TODO',
        payload: {
          id: Date.now().toString(),
          title,
          notes,
          completed: false,
          listName: selectedList,
          createdAt: Date.now(),
          isCommitted: !isBacklog, // Mark as not committed if it's a backlog item
        },
      });
    }
  };

  const handleTodoDelete = () => {
    if (selectedTodo) {
      dispatch({
        type: 'DELETE_TODO',
        payload: selectedTodo.id,
      });
    }
    setIsEditScreenVisible(false);
    setSelectedTodo(null);
  };

  const handleAddList = (name: string, icon: string, color: string) => {
    dispatch({
      type: 'ADD_LIST',
      payload: {
        name,
        icon,
        color,
      },
    });
    setIsListEditScreenVisible(false);
  };

  const handleListPress = (listName: string) => {
    setSelectedListForView(listName);
  };

  if (selectedListForView) {
    const selectedListData = selectedListForView === 'Completed' 
      ? { 
          name: 'Completed', 
          icon: '✓', 
          color: colors.text 
        } 
      : state.lists.find(list => list.name === selectedListForView);

    if (selectedListData) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar style="dark" />
          
          {/* Top To-Do Section */}
          <Animated.View style={[
            styles.section, 
            styles.topSection, 
            { 
              height: topSectionHeight,
              paddingTop: insets.top
            }
          ]}>
            {/* Fixed To-Do Header */}
            <View style={[
              styles.todoHeader,
              { top: insets.top }
            ]}>
              <SectionHeader title="Todos" onMorePress={() => console.log('More todos')} />
            </View>

            {/* Action Items Area */}
            <View style={styles.actionItemsContainer}>
              <ScrollView 
                style={[
                  styles.actionItemsScroll,
                  state.todos.filter(todo => 
                    todo.isCommitted && !todo.completed
                  ).length > 0 && styles.actionItemsScrollVisible
                ]}
                contentContainerStyle={styles.actionItemsContent}
                showsVerticalScrollIndicator={false}
              >
                {state.todos
                  .filter(todo => 
                    todo.isCommitted && !todo.completed
                  )
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map(todo => {
                    const list = state.lists.find(l => l.name === todo.listName);
                    return (
                      <TodoItem
                        key={todo.id}
                        id={todo.id}
                        title={todo.title}
                        listName={todo.listName}
                        listColor={list?.color}
                        completed={todo.completed}
                        hasNote={!!todo.notes}
                        onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                        onPress={() => handleTodoPress(todo)}
                      />
                    );
                  })}
              </ScrollView>
              {state.todos.filter(todo => todo.isCommitted && !todo.completed).length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No Todos</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Control Panel */}
          <Animated.View 
            ref={controlPanelRef}
            style={[styles.controlPanel, { 
              top: Animated.add(topSectionHeight, 12) 
            }]}
            {...panResponder.panHandlers}
          >
            {/* Two-column layout for control panel */}
            <View style={styles.controlPanelLayout}>
              {/* Left section - New Todo Button */}
              <View style={styles.controlPanelLeft}>
                <View ref={newTodosButtonRef} style={styles.newTodoButtonContainer}>
                  <NewTodoButton onPress={handleNewTodo} />
                </View>
              </View>
              
              {/* Right section - Move Bar */}
              <View style={styles.controlPanelRight}>
                <View style={styles.moveBarWrapper}>
                  <MoveBar />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Lists Section */}
          <Animated.View style={[
            styles.section, 
            styles.bottomSection, 
            { 
              top: Animated.add(
                Animated.add(topSectionHeight, 12),
                controlPanelHeight + 12
              )
            }
          ]}>
            {/* List Detail View */}
            <View style={styles.listDetailContainer}>
              {/* List Header */}
              <View style={styles.listDetailHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedListForView(null)} 
                  style={styles.backButton}
                >
                  <ChevronLeftIcon size={24} color={colors.text} />
                </TouchableOpacity>
                
                <ListViewTitle
                  icon={selectedListForView === 'Completed' 
                    ? <CheckIcon size={20} color="#000" />
                    : selectedListData.icon === '📑' 
                      ? <BookmarkIcon size={12} color="#FFFFFF" /> 
                      : <Text style={styles.listItemIcon}>{selectedListData.icon}</Text>
                  }
                  iconBackgroundColor={selectedListForView === 'Completed' ? 'transparent' : selectedListData.color}
                  title={selectedListData.name}
                  count={state.todos.filter(todo => 
                    selectedListForView === 'Completed' 
                      ? todo.completed 
                      : (todo.listName === selectedListData.name && !todo.completed)
                  ).length}
                />

                <TouchableOpacity style={styles.moreButton}>
                  <DotsIcon size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* List Content */}
              <ScrollView 
                style={styles.listDetailContent}
                showsVerticalScrollIndicator={false}
              >
                {selectedListForView === 'Completed' ? (
                  <View style={[styles.listDetailSection]}>
                    <View style={styles.todosList}>
                      {state.todos
                        .filter(todo => todo.completed)
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .map(todo => {
                          const list = state.lists.find(l => l.name === todo.listName);
                          return (
                            <TodoItem
                              key={todo.id}
                              id={todo.id}
                              title={todo.title}
                              listName={todo.listName}
                              listColor={list?.color}
                              completed={todo.completed}
                              hasNote={!!todo.notes}
                              onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                              onPress={() => handleTodoPress(todo)}
                            />
                          );
                        })}
                    </View>
                  </View>
                ) : (
                  <>
                    {/* Todos Section */}
                    <View style={[styles.listDetailSection, styles.todosSection]}>
                      <View style={styles.listDetailSectionHeader}>
                        <Text style={styles.listDetailSectionTitle}>Todos</Text>
                        <TouchableOpacity 
                          style={styles.addButton}
                          onPress={() => {
                            setSelectedTodo(null);
                            setSelectedList(selectedListForView || 'Tasks');
                            setIsCommitted(true);
                            setIsEditScreenVisible(true);
                          }}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.todosList}>
                        {state.todos
                          .filter(todo => 
                            todo.listName === selectedListData.name && 
                            todo.isCommitted && 
                            !todo.completed
                          )
                          .map(todo => (
                            <TodoItem
                              key={todo.id}
                              id={todo.id}
                              title={todo.title}
                              listName={todo.listName}
                              listColor={selectedListData.color}
                              completed={todo.completed}
                              hasNote={!!todo.notes}
                              onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                              onPress={() => handleTodoPress(todo)}
                            />
                          ))
                        }
                      </View>
                    </View>

                    {/* Backlog Section */}
                    <View style={[styles.listDetailSection, styles.backlogSection]}>
                      <View style={styles.listDetailSectionHeader}>
                        <Text style={styles.listDetailSectionTitle}>Backlog</Text>
                        <TouchableOpacity 
                          style={styles.addButton}
                          onPress={() => {
                            setSelectedTodo(null);
                            setSelectedList(selectedListForView || 'Tasks');
                            setIsCommitted(false);
                            setIsEditScreenVisible(true);
                          }}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.todosList}>
                        {state.todos
                          .filter(todo => 
                            todo.listName === selectedListData.name && 
                            !todo.isCommitted && 
                            !todo.completed
                          )
                          .map(todo => (
                            <TodoItem
                              key={todo.id}
                              id={todo.id}
                              title={todo.title}
                              listName={todo.listName}
                              listColor={selectedListData.color}
                              completed={todo.completed}
                              hasNote={!!todo.notes}
                              onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                              onPress={() => handleTodoPress(todo)}
                            />
                          ))
                        }
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </Animated.View>

          <TodoEditScreen
            visible={isEditScreenVisible}
            onClose={handleEditScreenClose}
            onSubmit={handleTodoSubmit}
            onDelete={handleTodoDelete}
            initialTitle={selectedTodo?.title}
            initialNotes={selectedTodo?.notes}
            isEditing={!!selectedTodo}
            listName={selectedList}
            selectedTodo={selectedTodo}
            isBacklog={!selectedTodo && selectedListForView !== null && !isCommitted}
          />

          <ListEditScreen
            visible={isListEditScreenVisible}
            onClose={() => setIsListEditScreenVisible(false)}
            onSubmit={handleAddList}
          />
        </SafeAreaView>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top To-Do Section */}
      <Animated.View style={[
        styles.section, 
        styles.topSection, 
        { 
          height: topSectionHeight,
          paddingTop: insets.top
        }
      ]}>
        {/* Fixed To-Do Header */}
        <View style={[
          styles.todoHeader,
          { top: insets.top }
        ]}>
          <SectionHeader title="Todos" onMorePress={() => console.log('More todos')} />
        </View>

        {/* Action Items Area */}
        <View style={styles.actionItemsContainer}>
          <ScrollView 
            style={[
              styles.actionItemsScroll,
              state.todos.filter(todo => 
                todo.isCommitted && !todo.completed
              ).length > 0 && styles.actionItemsScrollVisible
            ]}
            contentContainerStyle={styles.actionItemsContent}
            showsVerticalScrollIndicator={false}
          >
            {state.todos
              .filter(todo => 
                todo.isCommitted && !todo.completed
              )
              .sort((a, b) => b.createdAt - a.createdAt)
              .map(todo => {
                const list = state.lists.find(l => l.name === todo.listName);
                return (
                  <TodoItem
                    key={todo.id}
                    id={todo.id}
                    title={todo.title}
                    listName={todo.listName}
                    listColor={list?.color}
                    completed={todo.completed}
                    hasNote={!!todo.notes}
                    onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                    onPress={() => handleTodoPress(todo)}
                  />
                );
              })}
          </ScrollView>
          {state.todos.filter(todo => todo.isCommitted && !todo.completed).length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No Todos</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Control Panel */}
      <Animated.View 
        ref={controlPanelRef}
        style={[styles.controlPanel, { 
          top: Animated.add(topSectionHeight, 12) 
        }]}
        {...panResponder.panHandlers}
      >
        {/* Two-column layout for control panel */}
        <View style={styles.controlPanelLayout}>
          {/* Left section - New Todo Button */}
          <View style={styles.controlPanelLeft}>
            <View ref={newTodosButtonRef} style={styles.newTodoButtonContainer}>
              <NewTodoButton onPress={handleNewTodo} />
            </View>
          </View>
          
          {/* Right section - Move Bar */}
          <View style={styles.controlPanelRight}>
            <View style={styles.moveBarWrapper}>
              <MoveBar />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Lists Section */}
      <Animated.View style={[
        styles.section, 
        styles.bottomSection, 
        { 
          top: Animated.add(
            Animated.add(topSectionHeight, 12),
            controlPanelHeight + 12
          )
        }
      ]}>
        {selectedListForView ? (
          // List Detail View
          (() => {
            const selectedListData = selectedListForView === 'Completed'
              ? { name: 'Completed', icon: '✓', color: colors.text }
              : state.lists.find(list => list.name === selectedListForView);
            if (!selectedListData) return null;
            return (
              <View style={styles.listDetailContainer}>
                {/* List Header */}
                <View style={styles.listDetailHeader}>
                  <TouchableOpacity 
                    onPress={() => setSelectedListForView(null)} 
                    style={styles.backButton}
                  >
                    <ChevronLeftIcon size={24} color={colors.text} />
                  </TouchableOpacity>
                  
                  <ListViewTitle
                    icon={selectedListForView === 'Completed' 
                      ? <CheckIcon size={20} color="#000" />
                      : selectedListData.icon === '📑' 
                        ? <BookmarkIcon size={12} color="#FFFFFF" /> 
                        : <Text style={styles.listItemIcon}>{selectedListData.icon}</Text>
                    }
                    iconBackgroundColor={selectedListForView === 'Completed' ? 'transparent' : selectedListData.color}
                    title={selectedListData.name}
                    count={state.todos.filter(todo => 
                      selectedListForView === 'Completed' 
                        ? todo.completed 
                        : (todo.listName === selectedListData.name && !todo.completed)
                    ).length}
                  />

                  <TouchableOpacity style={styles.moreButton}>
                    <DotsIcon size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* List Content */}
                <ScrollView 
                  style={styles.listDetailContent}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedListForView === 'Completed' ? (
                    <View style={[styles.listDetailSection]}>
                      <View style={styles.todosList}>
                        {state.todos
                          .filter(todo => todo.completed)
                          .sort((a, b) => b.createdAt - a.createdAt)
                          .map(todo => {
                            const list = state.lists.find(l => l.name === todo.listName);
                            return (
                              <TodoItem
                                key={todo.id}
                                id={todo.id}
                                title={todo.title}
                                listName={todo.listName}
                                listColor={list?.color}
                                completed={todo.completed}
                                hasNote={!!todo.notes}
                                onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                                onPress={() => handleTodoPress(todo)}
                              />
                            );
                          })}
                      </View>
                    </View>
                  ) : (
                    <>
                      {/* Todos Section */}
                      <View style={[styles.listDetailSection, styles.todosSection]}>
                        <View style={styles.listDetailSectionHeader}>
                          <Text style={styles.listDetailSectionTitle}>Todos</Text>
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => {
                              setSelectedTodo(null);
                              setSelectedList(selectedListForView || 'Tasks');
                              setIsCommitted(true);
                              setIsEditScreenVisible(true);
                            }}
                          >
                            <Text style={styles.addButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.todosList}>
                          {state.todos
                            .filter(todo => 
                              todo.listName === selectedListData.name && 
                              todo.isCommitted && 
                              !todo.completed
                            )
                            .map(todo => (
                              <TodoItem
                                key={todo.id}
                                id={todo.id}
                                title={todo.title}
                                listName={todo.listName}
                                listColor={selectedListData.color}
                                completed={todo.completed}
                                hasNote={!!todo.notes}
                                onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                                onPress={() => handleTodoPress(todo)}
                              />
                            ))
                          }
                        </View>
                      </View>

                      {/* Backlog Section */}
                      <View style={[styles.listDetailSection, styles.backlogSection]}>
                        <View style={styles.listDetailSectionHeader}>
                          <Text style={styles.listDetailSectionTitle}>Backlog</Text>
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => {
                              setSelectedTodo(null);
                              setSelectedList(selectedListForView || 'Tasks');
                              setIsCommitted(false);
                              setIsEditScreenVisible(true);
                            }}
                          >
                            <Text style={styles.addButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.todosList}>
                          {state.todos
                            .filter(todo => 
                              todo.listName === selectedListData.name && 
                              !todo.isCommitted && 
                              !todo.completed
                            )
                            .map(todo => (
                              <TodoItem
                                key={todo.id}
                                id={todo.id}
                                title={todo.title}
                                listName={todo.listName}
                                listColor={selectedListData.color}
                                completed={todo.completed}
                                hasNote={!!todo.notes}
                                onToggle={(id) => dispatch({ type: 'TOGGLE_TODO', payload: id })}
                                onPress={() => handleTodoPress(todo)}
                              />
                            ))
                          }
                        </View>
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            );
          })()
        ) : (
          // Lists Overview
          <>
        <View style={styles.header}>
          <SectionHeader title="Lists" onMorePress={() => console.log('More lists')} />
        </View>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listCategory}>
            <View style={styles.listCategoryHeader}>
              <Text style={styles.listCategoryTitle}>My Lists</Text>
              <TouchableOpacity onPress={() => setIsListEditScreenVisible(true)}>
                <AddIcon size={12} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.listContainer}>
              <View style={styles.listGroup}>
                {state.lists.map((list, index) => (
                  <React.Fragment key={list.name}>
                    <ListItem
                      title={list.name}
                      count={state.todos.filter(todo => todo.listName === list.name && !todo.completed).length}
                      icon={list.icon === '📑' ? (
                        <BookmarkIcon size={12} color="#FFFFFF" />
                      ) : (
                        <Text style={styles.listItemIcon}>{list.icon}</Text>
                      )}
                      iconBackgroundColor={list.color}
                      onPress={() => handleListPress(list.name)}
                      isSelected={selectedList === list.name}
                      isGrouped={true}
                    />
                    {index < state.lists.length - 1 && <View style={styles.listDivider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.completedList}>
            <ListItem
              title="Completed"
              count={state.todos.filter(todo => todo.completed).length}
              icon={<CheckIcon size={20} color={colors.text} />}
              iconBackgroundColor="#FFFFFF"
              onPress={() => handleListPress('Completed')}
              isSelected={selectedList === 'Completed'}
              isGrouped={true}
            />
          </View>
        </ScrollView>
          </>
        )}
      </Animated.View>

      <TodoEditScreen
        visible={isEditScreenVisible}
        onClose={handleEditScreenClose}
        onSubmit={handleTodoSubmit}
        onDelete={handleTodoDelete}
        initialTitle={selectedTodo?.title}
        initialNotes={selectedTodo?.notes}
        isEditing={!!selectedTodo}
        listName={selectedList}
        selectedTodo={selectedTodo}
        isBacklog={!selectedTodo && selectedListForView !== null && !isCommitted}
      />

      <ListEditScreen
        visible={isListEditScreenVisible}
        onClose={() => setIsListEditScreenVisible(false)}
        onSubmit={handleAddList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  section: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  topSection: {
    top: 0,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.md,
    zIndex: 1,
  },
  todoHeader: {
    height: HEADER_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
    backgroundColor: colors.background,
    borderBottomWidth: 0,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  actionItemsContainer: {
    flex: 1,
    marginTop: HEADER_HEIGHT + 10,
  },
  actionItemsScroll: {
    flex: 1,
    opacity: 0,
  },
  actionItemsScrollVisible: {
    opacity: 1,
  },
  actionItemsContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  emptyState: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: HEADER_HEIGHT,
  },
  emptyStateText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 20,
    fontWeight: '400',
    color: '#A1A1A1',
    lineHeight: 20 * typography.lineHeights.relaxed,
    textAlign: 'center',
  },
  controlPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 0,
    zIndex: 2,
    justifyContent: 'flex-start',
  },
  controlPanelLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  controlPanelLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  controlPanelRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newTodoButtonContainer: {
    height: 40,
  },
  moveBarWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomSection: {
    bottom: 0,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    ...shadows.md,
    paddingTop: 14,
    paddingBottom: 24,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: 0,
    width: '100%',
  },
  content: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    marginTop: 10,
    paddingBottom: 16,
    paddingTop: 10,
  },
  listCategory: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  listCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  listCategoryTitle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 14 * 1.714,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  listGroup: {
    width: '100%',
    alignSelf: 'stretch',
  },
  listDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.md,
  },
  completedList: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    ...shadows.none,
  },
  listItemIcon: {
    fontSize: 12,
  },
  listDetailContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  moreButton: {
    padding: spacing.xs,
    marginRight: -spacing.xs,
  },
  listDetailContent: {
    flex: 1,
  },
  listDetailSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  todosSection: {
    marginTop: 24,
  },
  backlogSection: {
    marginTop: 16,
  },
  listDetailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listDetailSectionTitle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500' as const,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  addButton: {
    padding: spacing.xs,
  },
  addButtonText: {
    fontSize: typography.fontSizes.lg,
    color: colors.text,
    lineHeight: 20,
  },
  todosList: {
    gap: spacing.sm,
  },
});

export default HomeScreen; 