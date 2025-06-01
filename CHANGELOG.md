# Changelog

All notable changes to this project will be documented in this file.

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
