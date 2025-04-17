import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { TodoProvider } from './context/TodoContext';
import { DragProvider } from './components/DragContext';
import { colors } from './design-system/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TodoProvider>
          <DragProvider>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <StatusBar style="dark" />
              <HomeScreen />
            </View>
          </DragProvider>
        </TodoProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
