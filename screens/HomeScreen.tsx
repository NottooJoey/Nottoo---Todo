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
} from '../components/icons';
import {
  SectionHeader,
  ListItem,
  MoveBar,
  NewTodoButton,
} from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../design-system/theme';

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

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const newTodosButtonRef = useRef<View>(null);
  const controlPanelRef = useRef<View>(null);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top To-Do Section */}
      <Animated.View style={[
        styles.section, 
        styles.topSection, 
        { 
          height: topSectionHeight,
          paddingTop: insets.top + TOP_HEADER_MARGIN
        }
      ]}>
        {/* Fixed To-Do Header */}
        <View style={[
          styles.todoHeader,
          { top: insets.top + (TOP_HEADER_MARGIN - HEADER_HEIGHT) }
        ]}>
          <SectionHeader title="Todos" onMorePress={() => console.log('More todos')} />
        </View>

        {/* Action Items Area */}
        <View style={styles.actionItemsContainer}>
          <ScrollView 
            style={styles.actionItemsScroll}
            contentContainerStyle={styles.actionItemsContent}
            showsVerticalScrollIndicator={false}
          >
          </ScrollView>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No Todos</Text>
          </View>
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
              <NewTodoButton onPress={() => console.log('New todo')} />
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
                <AddIcon size={12} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.listGroup}>
              <ListItem
                title="Tasks"
                count={0}
                icon={<BookmarkIcon size={12} color="#FFFFFF" />}
                iconBackgroundColor={colors.secondary}
                onPress={() => console.log('List pressed')}
              />
            </View>
          </View>

          <View style={styles.completedList}>
            <ListItem
              title="Completed"
              count={0}
              icon={<CheckIcon size={20} color={colors.text} />}
              iconBackgroundColor="#FFFFFF"
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
    paddingTop: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  actionItemsScroll: {
    flex: 1,
    opacity: 0, // Hide scroll view when empty
  },
  actionItemsContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: '100%',
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
  listGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'stretch',
    ...shadows.sm,
  },
  completedList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: spacing.md,
    marginHorizontal: 16,
    ...shadows.none
  },
  listIcon: {
    fontSize: 10,
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
});

export default HomeScreen; 