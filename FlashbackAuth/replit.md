# Overview

This is a progressive web application (PWA) built for mobile authentication featuring OTP login, liveness detection, and selfie upload capabilities. The application follows a clean, minimalist design with a simple color palette and implements a complete authentication flow that integrates with external APIs for OTP delivery via WhatsApp, verification, and secure file upload.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for authentication state and TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **PWA Features**: Service worker for offline functionality, manifest.json for app installation

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Development Setup**: Vite middleware integration for hot module replacement in development
- **API Structure**: RESTful endpoints for session management with in-memory storage
- **Database**: Drizzle ORM configured for PostgreSQL (schema defined but using in-memory storage currently)

## Design System
- **Styling**: Tailwind CSS with clean, minimalist design using CSS variables
- **Typography**: System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif) for optimal readability
- **Theme**: Light/dark mode support with limited color palette: dark gray/black primary (#0D0D0D), white secondary (#FFFFFF), blue accent (#007AFF), green success (#10B981), red error (#EF4444)
- **UI Elements**: Clean cards, subtle shadows, gentle animations (fade-in, slide-in, gentle-bounce)

## Mobile-First Features
- **Camera Integration**: Custom camera component with MediaDevices API for front-facing camera access
- **Liveness Detection**: Client-side liveness detection using canvas-based motion and face detection algorithms
- **Photo Capture**: Canvas-based photo capture with flash effects and blob handling
- **Responsive Design**: Mobile-optimized UI with touch-friendly interactions

## Authentication Flow
- **OTP Delivery**: Integration with external Flashback API for WhatsApp-based OTP delivery
- **Verification**: JWT token handling after successful OTP verification
- **Session Management**: Local session storage with backend persistence for user state
- **File Upload**: Multipart form data upload for selfie images with authorization headers

## Data Validation
- **Schema Validation**: Zod schemas for phone number format (+91 format), OTP validation, and user session data
- **Form Handling**: React Hook Form integration with resolver pattern for validation

## External Dependencies
- **Neon Database**: PostgreSQL database provider configured via Drizzle
- **Flashback API**: External service for OTP delivery and selfie upload
- **Media APIs**: Browser MediaDevices API for camera access and photo capture

The application is structured as a monorepo with shared schemas between client and server, uses modern React patterns with hooks and context, and implements a complete mobile authentication flow with biometric verification capabilities.