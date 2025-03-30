import React, { useRef, useEffect } from 'react';
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
} from '../components/icons';
import {
  SectionHeader,
  ListItem,
  MoveBar,
  NewTodoButton,
} from '../components';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Core layout constants from Figma
const SECTION_SPACING = 10; // Spacing between sections
const TOP_HEADER_MARGIN = 60; // Fixed distance from top of screen to header
const HEADER_HEIGHT = 56; // Height of section headers
const TOP_MIN_HEIGHT = TOP_HEADER_MARGIN + HEADER_HEIGHT; // Minimum height includes fixed header position
const BOTTOM_MIN_HEIGHT = 80; // Minimum height for bottom section
const CONTROL_PANEL_HEIGHT = 48; // Height of middle control section
const HORIZONTAL_PADDING = 20; // Horizontal padding for sections

// Calculate available space
const SAFE_AREA_TOP = 47; // iPhone status bar height
const TOTAL_HEIGHT = SCREEN_HEIGHT - SAFE_AREA_TOP;
const MAX_SECTION_HEIGHT = TOTAL_HEIGHT - BOTTOM_MIN_HEIGHT - CONTROL_PANEL_HEIGHT - (SECTION_SPACING * 2);
const DEFAULT_TOP_HEIGHT = (TOTAL_HEIGHT - CONTROL_PANEL_HEIGHT - (SECTION_SPACING * 2)) * 0.6; // 60% in default state
const DEFAULT_BOTTOM_HEIGHT = (TOTAL_HEIGHT - CONTROL_PANEL_HEIGHT - (SECTION_SPACING * 2)) * 0.4; // 40% in default state

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const newTodosButtonRef = useRef<View>(null);

  // Animation values
  const topSectionHeight = useRef(new Animated.Value(DEFAULT_TOP_HEIGHT)).current;
  const controlPanelY = useRef(new Animated.Value(DEFAULT_TOP_HEIGHT)).current;
  const dragStartY = useRef(0);
  const lastControlPanelY = useRef(DEFAULT_TOP_HEIGHT);

  // Track current control panel position
  useEffect(() => {
    const id = controlPanelY.addListener(({ value }) => {
      lastControlPanelY.current = value;
    });
    return () => controlPanelY.removeListener(id);
  }, []);

  // Calculate bottom section height based on control panel position
  const bottomSectionHeight = controlPanelY.interpolate({
    inputRange: [TOP_MIN_HEIGHT, MAX_SECTION_HEIGHT],
    outputRange: [TOTAL_HEIGHT - TOP_MIN_HEIGHT - CONTROL_PANEL_HEIGHT - (SECTION_SPACING * 2), BOTTOM_MIN_HEIGHT],
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
        dragStartY.current = lastControlPanelY.current;
      },

      onPanResponderMove: (_, { dy }) => {
        const newY = Math.max(
          TOP_MIN_HEIGHT,
          Math.min(MAX_SECTION_HEIGHT, dragStartY.current + dy)
        );
        
        controlPanelY.setValue(newY);
        topSectionHeight.setValue(newY);
      },

      onPanResponderRelease: () => {
        // Current value is tracked by the listener
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Todos Section */}
      <Animated.View style={[styles.section, styles.topSection, { height: topSectionHeight }]}>
        {/* Fixed Header */}
        <View style={[styles.headerContainer]}>
          <View style={[styles.header, styles.fixedHeader]}>
            <SectionHeader title="Todos" onMorePress={() => console.log('More todos')} />
          </View>
        </View>

        {/* Scrollable Content Area */}
        <View style={[styles.contentWrapper]}>
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.todoContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No Todos</Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      {/* Control Panel */}
      <Animated.View 
        style={[styles.controlPanel, { top: controlPanelY }]}
        {...panResponder.panHandlers}
      >
        <View ref={newTodosButtonRef}>
          <NewTodoButton onPress={() => console.log('New todo')} />
        </View>
        <View style={styles.moveBarContainer}>
          <MoveBar />
        </View>
      </Animated.View>

      {/* Bottom Lists Section */}
      <Animated.View style={[styles.section, styles.bottomSection, { height: bottomSectionHeight }]}>
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
              <TouchableOpacity onPress={() => console.log('Add list')}>
                <AddIcon size={14} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.listGroup}>
              <ListItem
                title="Tasks"
                count={0}
                icon={<Text style={styles.listIcon}>📋</Text>}
                iconBackgroundColor="#F97275"
                onPress={() => console.log('Tasks pressed')}
              />
            </View>
          </View>

          <View style={styles.completedList}>
            <ListItem
              title="Completed"
              count={0}
              icon={<CheckIcon size={14} color="#000000" />}
              onPress={() => console.log('Completed pressed')}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  topSection: {
    top: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomSection: {
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    width: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: TOP_HEADER_MARGIN,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  fixedHeader: {
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
    paddingTop: TOP_HEADER_MARGIN + HEADER_HEIGHT, // Account for fixed header height
  },
  content: {
    flex: 1,
  },
  todoContent: {
    flexGrow: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: HEADER_HEIGHT + 20, // Add padding to account for fixed header
    minHeight: '100%',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyStateText: {
    fontSize: 17,
    color: '#AEAEB2',
    fontWeight: '400',
  },
  controlPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: CONTROL_PANEL_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    zIndex: 1,
  },
  moveBarContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listCategory: {
    marginBottom: 24,
  },
  listCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  listCategoryTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  listGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listIcon: {
    fontSize: 16,
  },
});

export default HomeScreen; 