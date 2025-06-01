# Changelog

All notable changes to this project will be documented in this file.

## [2025-01-06] - Major Feature Update: Notes → Prompts

### 🚀 **BREAKING CHANGE: Transformed Notes into Prompts**

**What Changed:**
- **Renamed "Notes" to "Prompts"** throughout the entire application
- Updated database schema: `notes` table → `prompts` table
- All note-related components renamed to prompt-related components
- Updated UI text, icons, and terminology

**New Features:**
- **Prompt Management**: Store and organize AI prompts, templates, and reusable content
- **Enhanced UI**: Prompts now use 🤖 emoji and prompt-specific terminology
- **Same Functionality**: All existing features (search, tags, projects, spaces) work with prompts

**Technical Changes:**
- Database: `notes` table renamed to `prompts` with all indexes updated
- Backend: `convex/notes.ts` → `convex/prompts.ts`
- Frontend: `NoteList`, `NoteDetail`, `NoteForm` → `PromptList`, `PromptDetail`, `PromptForm`
- API: All note-related functions now handle prompts
- Types: Updated all TypeScript types and interfaces

**Migration:**
- Existing notes data will be automatically migrated to prompts
- No data loss - all content, tags, and metadata preserved
- Space content counts updated to show prompts instead of notes

**Why This Change:**
- Better aligns with modern AI workflow needs
- Prompts are more relevant for developers and AI users
- Clearer purpose and use case for stored content

**Bug Fixes:**
- ✅ Fixed SearchAndFilters component API reference from `notes` to `prompts`
- ✅ Fixed lazy loading errors with proper named export handling
- ✅ Added comprehensive error boundaries for better error handling
- ✅ Resolved all TypeScript compilation errors

## [2025-01-06] - Space Customization Feature

### 🎨 **NEW: Space Editing & Customization**

**Features Added:**
- **✨ Edit Space Names**: Click edit button to modify space names
- **✨ Edit Space Descriptions**: Update space descriptions for better organization
- **✨ Custom Space Icons**: Choose from 100+ categorized icons for each space
- **✨ Icon Categories**: Work & Projects, Code & Tech, Documents, Creative, Learning, Communication, Organization, Time & Planning, Symbols, Nature
- **✨ Visual Icon Picker**: Interactive icon selection with live preview
- **✨ Hover Actions**: Edit and delete buttons appear on space card hover

**Technical Implementation:**
- **Database**: Added `icon` field to spaces schema
- **Backend**: Updated `spaces.create` and `spaces.update` mutations
- **Frontend**: New `IconPicker` component with categorized icon selection
- **UI**: Enhanced `SpaceForm` to support both create and edit modes
- **UX**: Updated `SpaceSelector` with edit functionality and custom icon display

**Default Improvements:**
- **Default Space**: New spaces get a 📝 icon by default
- **Icon Display**: Custom icons show in space cards with fallback to folder icon
- **Responsive Design**: Icon picker works well on all screen sizes

## [2025-01-06] - Build Optimization & Performance

### ⚡ **Build Performance Optimization**

**Problem Solved:**
- ❌ Large bundle chunks (>1000 kB) causing slow initial load times
- ❌ Monolithic JavaScript bundles
- ❌ Syntax highlighting loading all languages upfront

**Optimizations Implemented:**

**🔧 Advanced Code Splitting:**
- **React Core**: 8.25 kB (3.13 kB gzipped) - Essential React functionality
- **React DOM**: 171.98 kB (54.12 kB gzipped) - DOM rendering separated
- **Convex Vendor**: 67.16 kB (18.48 kB gzipped) - Database client isolated
- **Radix UI**: 1.79 kB (0.84 kB gzipped) - UI primitives
- **Styling Utils**: 26.60 kB (8.04 kB gzipped) - Tailwind utilities
- **Large Components**: 21.35 kB (4.93 kB gzipped) - Form components
- **Syntax Highlighting**: 1,734.55 kB (538.77 kB gzipped) - Isolated and lazy-loaded

**🚀 Dynamic Imports:**
- **Lazy Components**: Form components load only when needed
- **Route-Level Splitting**: Space selector and content manager separated
- **Component Preloading**: Smart preloading based on user interactions
- **Icon Picker**: Lazy-loaded with 100+ icons

**⚙️ Build Configuration:**
- **Manual Chunking**: Optimized vendor splitting by functionality
- **Terser Minification**: Advanced compression with console removal
- **Chunk Size Limit**: Increased to 1.5MB for syntax highlighting
- **Source Maps**: Disabled for production builds

**📈 Performance Results:**
- **Initial Bundle**: Reduced from monolithic to ~50kB core
- **Lazy Loading**: Components load on-demand
- **Gzip Compression**: Average 70% size reduction
- **Load Time**: Significantly faster initial page load

## [2025-01-06] - Deployment Clarification & Simplification

### 📋 **Deployment Architecture Clarification**

**Important:** This application **does NOT need nginx** or complex server setup!

**Why No Server Needed:**
- **Frontend**: React SPA (static files only)
- **Backend**: Convex (fully serverless)
- **Database**: Convex (managed cloud)
- **Authentication**: Convex Auth (handled)
- **API**: Convex functions (serverless)

**✅ Recommended Deployment Options:**
1. **Vercel** (Perfect for React + Convex) - `vercel.json` included
2. **Netlify** (Great for SPAs) - `netlify.toml` included
3. **GitHub Pages** (Free for public repos)
4. **Cloudflare Pages** (Global CDN)

**❌ What You DON'T Need:**
- nginx or Apache web servers
- Express.js or Node.js servers
- Complex Docker setups
- Load balancers
- Database servers
- Authentication servers

**🔧 Changes Made:**
- **Updated Dockerfile**: Removed nginx, simplified to static server
- **Added vercel.json**: Zero-config Vercel deployment
- **Added netlify.toml**: Optimized Netlify configuration
- **Updated DEPLOYMENT.md**: Clear guidance on modern deployment
- **Simplified Architecture**: Embrace serverless simplicity

## [Unreleased] - 2025-01-06

### Fixed
- Fixed pnpm workspace configuration causing deployment failures
- Added proper `packages` field to `pnpm-workspace.yaml` to resolve "packages field missing or empty" error

### Added
- Created production-ready Dockerfile for containerized deployments
- Added nginx configuration for optimized static file serving
- Created .dockerignore file for efficient Docker builds
- Added alternative simple Dockerfile for Railway/Nixpacks compatibility

### Infrastructure
- Improved deployment reliability with proper pnpm workspace setup
- Enhanced build process with multi-stage Docker builds
- Added gzip compression and security headers in nginx configuration

## [Unreleased]

### Added
- **MAJOR**: Installed and configured Vercel theme from tweakcn.com
- Added Geist fonts (Vercel's design system fonts) for improved typography
- Added tw-animate-css package for enhanced animations
- Added comprehensive Vercel theme styling across all components
- **NEW**: Added dark/light mode toggle with sun and moon icons
- Added theme persistence using localStorage
- Added system preference detection for initial theme
- **NEW**: Redesigned space cards with clean, minimal Vercel theme aesthetic
- Enhanced "Create New Space" button with modern card-style design
- Improved empty state with animated elements and better visual hierarchy
- **FINAL**: Updated space cards to 3-column grid layout with shadcn badges
- Added Badge component from shadcn/ui for consistent styling
- Optimized card layout for better space utilization and visual balance
- **NEW**: Redesigned snippet display with modern buttons and enhanced code block
- Updated SnippetDetail with shadcn Button components and proper icons
- Enhanced CodeBlock with theme-aware styling and built-in copy functionality
- **FIXED**: Resolved Convex backend connectivity issues by starting dev server
- All space content count functions now working properly
- **NEW**: Redesigned sign-in page with modern shadcn components
- Removed anonymous sign-in option for better security
- Enhanced sign-in/sign-up form with proper labels and loading states
- Updated sign-out button with icon and improved styling
- Added app logo and improved landing page layout
- **NEW**: Added logo icon to header for consistent branding
- **NEW**: Added minimal footer with copyright and Convex attribution
- **IMPROVED**: Reduced vertical spacing on sign-in page to show footer without scrolling
- **NEW**: Enhanced code blocks with syntax highlighting and line numbers
- Added react-syntax-highlighter with Prism for professional code display
- Implemented theme-aware syntax highlighting (dark/light modes)
- Added numbered lines with proper styling and borders
- **NEW**: Added comprehensive README with full documentation
- Detailed feature descriptions, installation guide, and usage instructions
- Professional project documentation with badges and structured sections
- **NEW**: Implemented secure production deployment configuration
- Added production deployment key setup (not committed to git)
- Created deployment scripts and comprehensive deployment guide
- Enhanced security with proper environment variable management
- **SECURITY**: Upgraded prismjs to version 1.30.0 for security fixes
- Fixed currentScript vulnerability in syntax highlighting engine
- **PERFORMANCE**: Implemented comprehensive bundle optimization and code splitting
- Added manual chunk splitting for better caching and loading performance
- Implemented lazy loading for syntax highlighting and heavy components
- Reduced main bundle size from 1MB+ to ~12KB with smart chunking
- Added Suspense boundaries with loading states for better UX

### Changed
- **MAJOR**: Updated all components to use Vercel theme colors and styling
- Replaced hardcoded colors (gray-*, blue-*, etc.) with semantic color tokens
- Updated color system to use OKLCH color space for better perceptual uniformity
- Enhanced form styling with consistent focus states and transitions
- Improved button styling with proper shadows and hover states
- Updated all input fields, selects, and textareas with consistent theming
- Enhanced card components with proper shadows and borders
- Improved list item styling with better hover and selection states

### Technical Details
- **Vercel Theme Integration** (COMPLETED):
  - Installed Vercel theme from https://tweakcn.com/r/themes/vercel.json
  - Added Geist and Geist Mono fonts via Google Fonts
  - Updated CSS variables to use OKLCH color space
  - Added comprehensive shadow system with multiple levels
  - Integrated sidebar-specific color variables for future use

- **Component Updates** (COMPLETED):
  - Updated App.tsx header styling with theme toggle
  - Fixed SignOutButton with proper semantic colors
  - Updated SpaceSelector and SpaceForm with card styling
  - Enhanced ContentManager with proper background colors
  - Updated SearchAndFilters with consistent input styling
  - Improved SnippetList and NoteList with better selection states
  - Enhanced SnippetForm and NoteForm with comprehensive styling
  - Updated SnippetDetail and NoteDetail with proper button styling
  - Fixed all hardcoded colors to use semantic tokens
  - Applied consistent focus states and transitions throughout

- **Theme Toggle Implementation** (COMPLETED):
  - Created useTheme hook for theme state management
  - Added ThemeToggle component with sun/moon icons
  - Implemented one-click theme switching
  - Added localStorage persistence for theme preference
  - Added system preference detection on first visit
  - Positioned toggle in header next to sign out button

- **Space Cards Redesign** (COMPLETED):
  - Removed colored gradients for clean, minimal aesthetic
  - Updated to use semantic theme colors (card, muted, accent)
  - Enhanced hover states with subtle scale and shadow effects
  - Improved layout with better icon and content organization
  - Implemented 3-column responsive grid layout (1-2-3 columns)
  - Enhanced "Create New Space" button with card-style design
  - Improved empty state with animated floating elements
  - Added staggered animation for card entrance effects
  - Integrated shadcn Badge components for snippet/note counts
  - Optimized card proportions for landscape-style layout

- **Snippet Display Redesign** (COMPLETED):
  - Redesigned SnippetDetail with modern shadcn Button components
  - Added proper SVG icons for Copy, Edit, and Delete actions
  - Enhanced button styling with variants (outline, default, destructive)
  - Updated metadata section with shadcn Badge components and icons
  - **ENHANCED**: Professional code blocks with syntax highlighting and line numbers
  - Added react-syntax-highlighter with Prism for 20+ language support
  - Implemented theme-aware syntax highlighting (oneDark/oneLight)
  - Added numbered lines with proper borders and styling
  - Enhanced code header with language badge and line count
  - Integrated copy functionality directly in code block
  - Enhanced visual feedback with loading states and success indicators
  - Applied consistent spacing and typography throughout

- **Authentication Redesign** (COMPLETED):
  - Redesigned sign-in page with modern shadcn Card components
  - Removed anonymous authentication for improved security
  - Enhanced form with proper labels, placeholders, and validation
  - Added loading states with spinner animations
  - Improved sign-in/sign-up toggle with better UX
  - Updated sign-out button with icon and consistent styling
  - Added app logo and improved landing page presentation
  - Applied Vercel theme styling throughout authentication flow

- **Layout Enhancements** (COMPLETED):
  - Added logo icon to header for consistent branding across all pages
  - Implemented minimal footer with copyright and technology attribution
  - Enhanced overall page structure with proper header/main/footer layout
  - Improved responsive design for mobile and desktop experiences

### Added
- **Notes Feature**: Added comprehensive notes functionality alongside existing snippets
  - Created notes database schema with full-text search support
  - Implemented CRUD operations for notes (create, read, update, delete)
  - Added note-specific components: NoteForm, NoteDetail, NoteList
  - Created unified ContentManager with tabbed interface for snippets and notes
  - Added project filtering support for notes
  - Updated SpaceSelector to show both snippet and note counts
  - Integrated notes into space migration system for orphaned content

### Fixed
- Fixed spaces page navigation issue where users were automatically redirected to snippet manager instead of seeing the spaces selection screen
- Removed auto-selection of default spaces to allow users to manually choose their workspace

### Changed
- **MAJOR**: Upgraded to Tailwind CSS v4 with new CSS-first configuration
- **MAJOR**: Implemented comprehensive dark mode theme as default
- Users now see the spaces selection page as the first screen after login
- Default spaces are created automatically but not auto-selected
- Replaced SnippetManager with ContentManager for unified content management
- Updated SearchAndFilters component to support both snippets and notes with conditional language filtering
- Simplified CSS architecture with Tailwind v4's @theme directive
- Removed complex shadcn/ui CSS variables in favor of simpler approach
- Updated all components to use semantic color tokens (primary, secondary, muted, etc.)

### Technical Details
- **Tailwind v4 Migration** (COMPLETED):
  - Removed old tailwind.config.js and postcss.config.cjs files
  - Updated to @tailwindcss/vite plugin for better integration
  - Migrated to CSS-first configuration using @theme directive
  - Updated Vite configuration for Tailwind v4 compatibility
  - Simplified custom CSS classes and variables
  - Replaced all custom color classes with semantic color tokens
  - Verified HMR and development server functionality

- **Dark Mode Implementation** (COMPLETED):
  - Implemented comprehensive dark mode theme using CSS variables
  - Added complete light/dark mode color palette with HSL values
  - Set dark mode as default application theme
  - Updated all components to use semantic color tokens (primary, secondary, muted, etc.)
  - Integrated shadcn/ui components (Button, Card, Input) for consistent theming
  - Applied dark mode styling to all UI elements including auth forms, spaces, and content areas

## [1.0.0] - 2025-01-31

### Added
- Initial release of Snippets Manager
- User authentication with Convex Auth
- Spaces functionality for organizing content
- Code snippets management with syntax highlighting
- Search and filtering capabilities
- Project-based organization
- Responsive design with Tailwind CSS
