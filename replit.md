# Show Yourself - Bio Profile Platform

## Overview

Show Yourself is a professional bio-data platform that allows users to create public profiles by uploading their personal and professional information. The application automatically generates SEO-optimized profile pages with unique URLs for each user, making their profiles discoverable through search engines. Built as a full-stack web application, it features a clean, modern interface for profile creation and browsing, with comprehensive SEO optimization including meta tags, structured data, and sitemap generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **File Structure**: Component-based architecture with clear separation between pages, components, and utilities

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for profile management
- **File Uploads**: Multer middleware for handling profile photo uploads with size and type validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Development Setup**: Vite integration for hot module replacement and development server proxy

### Data Storage Solutions
- **Database**: PostgreSQL using Neon Database as the hosted solution
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Design**: Profiles table with comprehensive user data fields including personal info, professional details, and media
- **File Storage**: Local file system storage for uploaded profile photos served as static assets

### Authentication and Authorization
- **Current State**: No authentication system implemented (open platform model)
- **Profile Access**: All profiles are publicly accessible for SEO purposes
- **Data Validation**: Server-side validation using Zod schemas for data integrity

### SEO and Discoverability Features
- **Meta Tags**: Dynamic meta tag generation for each profile page
- **Structured Data**: Schema.org Person markup for rich search results
- **URL Structure**: Clean, SEO-friendly URLs using profile slugs
- **Open Graph**: Social media sharing optimization
- **Sitemap Generation**: Automatic sitemap updates for search engine indexing

## External Dependencies

### Database Services
- **Neon Database**: Managed PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Component Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### File Processing
- **Multer**: Multipart form data handling for file uploads
- **Sharp**: Image processing capabilities (available for future enhancements)

### Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performant form management with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation for various purposes

### Fonts and Styling
- **Inter Font**: Modern, readable typography from Google Fonts
- **Font Awesome**: Additional icon support for enhanced UI elements