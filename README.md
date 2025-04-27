# Habit Tracker Application

A modern, responsive habit tracking application built with Next.js and React. This application helps users track daily habits, visualize streaks, and monitor their progress toward building consistent routines.

## Implementation Approach

### 1. State Management

I took a lightweight but powerful approach to state management using Zustand. After evaluating different options including Redux, Context API, and Jotai, I chose Zustand because:

- It provides a simple, hook-based API with minimal boilerplate
- It doesn't require providers or complex setup
- It allows for component-level state management without unnecessary re-renders
- It efficiently handles persistence with localStorage integration

The implementation creates a centralized store for habits data, keeping the state management logic separate from UI components.

### 2. Authentication

I implemented a custom authentication system with a hybrid approach:

- Server-side protection via middleware that redirects unauthenticated users
- Client-side authentication state using Zustand for UI rendering
- Persistent authentication using cookies and localStorage
- Support for both form-based and social authentication methods

This approach ensures a secure user experience while maintaining good performance.

### 3. UI/UX Design

The UI follows modern design principles:

- Clean, minimalist interface using Tailwind CSS for styling
- Responsive design that works across desktop and mobile devices
- Interactive components with micro-animations for better feedback
- Modal-based forms instead of page navigations for smoother UX
- Tab-based navigation with URL synchronization

### 4. Data Structure

The data model uses these key structures:

- `Habit`: Core properties of habits (name, description, icon, color, tags)
- `HabitLog`: Records of habit completion for specific dates
- `HabitWithLogs`: Combined structure for display and manipulation in UI
- `HabitTag`: Categorization for habits with color coding

### 5. Architectural Decisions

- **Client-side rendering** for interactive components with good UX
- **Middleware for authentication** to protect routes efficiently
- **Custom hooks** for encapsulating complex logic (useHabits, useAuth)
- **Component composition** to maintain reusability and separation of concerns
- **Progressive loading** with loading states and suspense boundaries

### 6. Special Features

- **Streak tracking** with proper calculation for consecutive habit completion
- **Colorful habit cards** with tag categorization for better organization
- **Analytics dashboard** for visualizing completion rates and progress
- **Responsive calendar UI** for tracking habit completion by date
- **Offline capability** via localStorage persistence

## How to Run Locally

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Authentication Setup

For local development, the app uses a simple demo authentication system:

- The first time you run the app, demo users will be created in localStorage
- You can sign in with:
  - Email: demo@example.com
  - Password: password123

### Build for Production

To create a production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Env Variables
 ```
  NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
   ```


## Project Structure

```
├── app/              # Next.js 13 app directory structure
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard and habit tracking pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── middleware.ts # Authentication middleware
├── components/       # Reusable UI components
│   ├── common/       # Common UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── habits/       # Habit-related components
│   ├── layouts/      # Layout components
│   ├── navigation/   # Navigation components
│   └── ui/           # Shadcn UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and services
│   ├── auth.ts       # Authentication utilities
│   ├── habits.ts     # Habit management utilities
│   └── utils.ts      # General utilities
├── providers/        # Context providers
├── store/            # Zustand store
│   └── habit-store.ts # Habit state management
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type safety and better developer experience
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **date-fns**: Modern JavaScript date utility library
- **Framer Motion**: Animation library for React
- **Lucide Icons**: Beautiful icon set
- **Shadcn UI**: Accessible UI component collection 