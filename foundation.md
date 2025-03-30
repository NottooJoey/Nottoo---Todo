# TodoApp Foundation

## App Structure

The TodoApp is structured using a modular approach with the following main directories:

- **components/**: Reusable UI components such as buttons, inputs, and todo items
- **screens/**: Screen-level components representing full application views
- **design-system/**: Design tokens, themes, and styling utilities
- **utils/**: Utility functions for data manipulation and business logic

## Application Logic

### Todo Management

The core functionality revolves around managing todo items:

1. **Create**: Add new todo items with a title
2. **Read**: View the list of todos, potentially filtered
3. **Update**: Toggle the completion status of todos
4. **Delete**: Remove todos from the list

### Data Flow

The app uses React's state management to handle todos:

1. Todo data is stored in state at the screen level
2. CRUD operations are defined as utility functions
3. Components receive data and callbacks as props
4. Actions trigger state updates, causing UI refreshes

### UI/UX Principles

The design follows these principles:

1. **Clarity**: Clear visual hierarchy and readable text
2. **Feedback**: Visual feedback for user actions
3. **Consistency**: Consistent use of colors, spacing, and interactions
4. **Accessibility**: Proper contrast, touch targets, and semantic markup

## Design System

The design system is built on these core elements:

- **Colors**: Brand colors, UI colors, and semantic colors (success, error, etc.)
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scales
- **Borders & Shadows**: Border radii, shadows for elevation
- **Components**: Reusable UI building blocks

## Roadmap for Implementation

1. Set up project structure and configuration ✅
2. Create basic design system foundation ✅
3. Implement core components based on Figma designs
4. Build screen layouts according to Figma mockups
5. Connect components with app logic
6. Polish interactions and animations
7. Test and optimize for performance

---------

# To-Do App – Feature & Logic Foundation

## 1. App Overview

A simple and clean to-do list app focused on priority-based task management. It separates committed tasks (to-dos) from backlog items stored in custom lists. Tasks can be freely moved, grouped, and edited without rigid time constraints.

---

## 2. Home Screen Structure

### 2.1 Split Layout

- **Top Section: “To-Dos”**
  - Displays current, active tasks to be done soon (e.g., today).
  - Tasks here are considered “in play” and committed.
  - No specific time/date shown.
  - This section is scrollable.

- **Bottom Section: “Lists”**
  - Backlog area where users create and organize tasks into lists.
  - Lists include “Work,” “Personal,” etc.
  - This section has 2 categories of content: "Favorite" and "My Lists"
  - Users can pin favorite lists to appear in the "Favorite" category. List does not exist in both category.
  - A "Completed" list is seperatedly displayed at the bottom of this section. 
  - This section is scrollable.

### 2.2 CTA Button

- **“+ New To-Do”**
  - Creates a new task.
  - Added immediately to:
    - The To-Do section (active tasks)
    - A selected list (user must assign)

### 2.3 Draggable Layout

- User can **drag up/down** on the screen divider:
  - Drag **up**: Expand Lists section
  - Drag **down**: Expand To-Do section

---

## 3. To-Do Creation Flow

### Required Fields:
- **Title**
- **List Assignment** (must assign to one existing list)

### Optional Fields:
- **Notes**
  - Supports basic checklist formatting
  - Checklist items are for user reference only (not treated as separate to-dos)

---

## 4. List Creation Flow

### Required Fields:
- **List Name**
- **Emoji Icon**
- **Color**

Each list contains two default sections:
- **To-Dos**: Active or planned tasks
- **Backlog**: Future/potential tasks

These categories are **system-defined** and cannot be changed or added to.

---

## 5. Task Behavior & Gestures

### 5.1 Drag & Drop

#### In the **To-Do Section**:
- Tasks can be reordered freely.
- Dragging one task onto another creates a **group (category)**:
  - User can name the group
  - Group behaves like iOS app folder structure
  - This feature only exists in the To-Do section

#### In **Lists**:
- Each task is either in `To-Dos` or `Backlog`
- Tasks can be moved between the two
- No additional categories or groupings can be created in lists

### 5.2 Swipe Actions

- **Swipe Left**:
  - “Details”
  - “Delete”
- **Swipe Right**:
  - “Move to Another List”

---

## 6. Task Logic Summary

- Each task:
  - Exists in one and only one list
  - Can be either in active To-Dos or backlog
  - Can be edited, moved, deleted
- Tasks in the To-Do section can be grouped and prioritized visually
- No due dates or scheduled times in MVP
- Tasks remain until marked complete

---

## 7. Additional Notes

- Design style and layout follow the Figma source of truth
- Color styles, spacing, and visual components are defined in Figma
- Only one “in-progress” task may be supported in future versions

---

## 8. UI Elements Breakdown

### 8.1 To-Do Card (Displayed in To-Do Section)

Each to-do item shown on the home screen includes the following elements:

1. **Circle Icon** – A visual checkbox used to mark the task as completed.
2. **Title** – The name of the to-do.
3. **Tag** – A label showing which list the to-do belongs to.
4. **Optional Notes Icon** – Appears only if the to-do contains a note or checklist. Hidden otherwise.

---

### 8.2 List Card (Displayed in List Section)

Each list item includes the following components:

1. **Emoji Icon** – Selected by the user during list creation.
2. **Title** – The name of the list (e.g., "Work", "Personal").
3. **To-Do Count** – Shows how many to-dos currently belong to this list.
4. **Arrow Icon** – Positioned on the right to indicate the list is clickable and can be expanded/viewed.

---

_This foundation will be expanded as specific Figma designs are implemented._ 