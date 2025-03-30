# TodoApp

A simple to-do list mobile application built with React Native and Expo.

## Technology Stack

- React Native (with TypeScript)
- Expo SDK 52
- React Navigation

## Project Structure

```
todoapp/
├── assets/             # App icons, splash screens and images
├── components/         # Reusable UI components
├── design-system/      # Design system elements, theme and styling
├── screens/            # Screen components
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── ...configuration files
```

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- Expo CLI
- Expo Go app on your mobile device (supporting SDK 52)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npx expo start
   ```
4. Scan the QR code with the Expo Go app or run on web:
   ```
   npx expo start --web
   ```

## Design System

The app uses a scalable design system based on Figma designs. Components are built to be reusable and consistent with the design specifications.

## Figma + MCP Integration

The project is set up to work with Figma's MCP (Material Components Platform) for component extraction and implementation. 