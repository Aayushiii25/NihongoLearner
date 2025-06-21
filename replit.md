# Nihongo - Japanese Language Learning Platform

## Overview

Nihongo is a comprehensive Japanese language learning platform built with modern web technologies. The application provides interactive learning tools including flashcards, word games, quizzes, and cultural content to help users master the Japanese language. It features an AI-powered chatbot for personalized learning assistance and tracks user progress across different learning modules.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Custom Japanese-themed design system with sakura color palette

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Session Management**: PostgreSQL-based session storage
- **AI Integration**: OpenAI GPT-4o for chatbot and learning assistance

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation

## Key Components

### Learning Modules
1. **Flashcards System**: Interactive character learning with hiragana, katakana, and kanji
2. **Word Jumble Game**: Character arrangement game for vocabulary practice
3. **Quiz System**: Comprehensive testing with multiple choice questions
4. **Cultural Content**: Educational content about Japanese culture and traditions

### User Progress Tracking
- **Progress Metrics**: Tracks correct/incorrect answers, mastery levels, and learning streaks
- **Statistics Dashboard**: Visual progress indicators and achievement tracking
- **Adaptive Learning**: AI-powered analysis of learning patterns and recommendations

### AI-Powered Features
- **Chatbot Integration**: OpenAI-powered conversation partner for practice
- **Intelligent Quiz Generation**: Dynamic question creation based on user progress
- **Learning Analytics**: AI analysis of user performance for personalized recommendations

## Data Flow

### Client-Side Data Management
1. **React Query**: Handles API requests, caching, and synchronization
2. **Optimistic Updates**: Immediate UI feedback for user interactions
3. **Error Handling**: Comprehensive error boundaries and user feedback

### Server-Side Processing
1. **Express Middleware**: Request logging, JSON parsing, and error handling
2. **Database Operations**: Type-safe queries through Drizzle ORM
3. **OpenAI Integration**: Asynchronous AI service calls for chatbot and analytics

### Database Schema
- **Users**: Authentication, progress tracking, and streak management
- **Vocabulary**: Japanese characters with romanji, meanings, and difficulty levels
- **Progress Tracking**: User-specific learning metrics and mastery levels
- **Quiz/Game Results**: Performance history and scoring data

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm and drizzle-zod for database operations and validation
- **AI Services**: OpenAI SDK for GPT-4o integration
- **UI Components**: Comprehensive shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast backend compilation for production
- **PostCSS**: CSS processing with Tailwind CSS
- **Replit Integration**: Platform-specific tooling and deployment

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend with hot reload
- **Port Configuration**: Backend on port 5000, frontend proxied through Vite
- **Database**: Automatic connection to Replit PostgreSQL instance

### Production Deployment
- **Build Process**: Vite builds frontend to `dist/public`, esbuild compiles backend
- **Static Assets**: Frontend served from Express with fallback routing
- **Environment**: Production mode with optimized bundles and error handling
- **Scaling**: Configured for Replit's autoscale deployment target

### Database Management
- **Schema Migrations**: Drizzle Kit for database schema management
- **Connection Pooling**: Neon serverless driver for optimal connection handling
- **Environment Variables**: Secure database URL and API key management

## Changelog

```
Changelog:
- June 21, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```