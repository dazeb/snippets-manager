# Code Snippet Manager

A modern, full-stack code snippet management application built with React, TypeScript, Convex, and Tailwind CSS. Organize your code snippets and notes in customizable spaces with professional syntax highlighting and a beautiful dark/light theme.

![Code Snippet Manager](https://img.shields.io/badge/Built%20with-Convex-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🗂️ **Space Management**
- Create and organize snippets/notes in custom spaces
- 3-column responsive grid layout for space cards
- Real-time content counts with badges
- Beautiful animations and hover effects

### 💻 **Code Snippets**
- Professional syntax highlighting for 20+ languages
- Numbered lines with proper styling
- Theme-aware code blocks (dark/light modes)
- One-click copy functionality with visual feedback
- Support for JavaScript, TypeScript, Python, Ruby, and more

### 📝 **Notes**
- Rich text notes alongside code snippets
- Full-text search capabilities
- Tag-based organization
- Project categorization

### 🎨 **Modern UI/UX**
- **Vercel-inspired theme** with dark mode by default
- **shadcn/ui components** for consistent design
- **Responsive design** that works on all devices
- **Professional typography** with Geist font family
- **Smooth animations** and micro-interactions

### 🔐 **Authentication**
- Secure email/password authentication
- No anonymous access for better security
- Modern sign-in/sign-up forms with loading states

### 🔍 **Search & Organization**
- Full-text search across snippets and notes
- Filter by language, project, or tags
- Advanced indexing with Convex search

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snippets-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project or connect to an existing one.

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   This will start both the frontend (Vite) and backend (Convex) servers.

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🚀 Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment:
```bash
# Set up production environment (see DEPLOYMENT.md)
export $(cat .env.production | xargs)

# Deploy to production
pnpm run deploy:prod
```

**Note**: Production deployment keys are never committed to git for security.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 6** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **react-syntax-highlighter** - Professional code highlighting with Prism.js 1.30.0
- **Geist Font** - Modern typography

### Backend
- **Convex** - Real-time backend-as-a-service
- **Convex Auth** - Secure authentication system
- **Real-time subscriptions** - Live data updates
- **Full-text search** - Advanced search capabilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite** - Fast development and building

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CodeBlock.tsx   # Syntax highlighting component
│   │   ├── SpaceSelector.tsx
│   │   └── SnippetDetail.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── App.tsx             # Main application component
├── convex/                 # Backend functions and schema
│   ├── auth.ts            # Authentication configuration
│   ├── schema.ts          # Database schema
│   ├── snippets.ts        # Snippet-related functions
│   ├── notes.ts           # Note-related functions
│   └── spaces.ts          # Space management functions
└── public/                # Static assets
```

## 🎯 Usage

### Creating Spaces
1. Click the "Create New Space" card on the main dashboard
2. Enter a name and optional description
3. Start adding snippets and notes to your space

### Adding Code Snippets
1. Select a space or create a new one
2. Click "Add Snippet"
3. Fill in the title, select language, and paste your code
4. Add tags and project information for better organization
5. Save and enjoy syntax highlighting with line numbers

### Managing Content
- **Search**: Use the search bar to find snippets/notes by title or content
- **Filter**: Filter by language, project, or tags
- **Edit**: Click the edit button on any snippet/note to modify
- **Copy**: One-click copy functionality for all code snippets
- **Delete**: Remove unwanted content with confirmation

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Convex deployment URL (automatically set by `npx convex dev`)
VITE_CONVEX_URL=your_convex_deployment_url
```

### Customizing Themes
The application uses Tailwind CSS with custom color tokens. You can modify the theme in:
- `src/index.css` - CSS custom properties for colors
- `tailwind.config.js` - Tailwind configuration

## 📱 Responsive Design

The application is fully responsive and works great on:
- **Desktop** - Full 3-column layout with all features
- **Tablet** - 2-column layout with optimized spacing
- **Mobile** - Single column with touch-friendly interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Convex](https://convex.dev)** - For the amazing real-time backend platform
- **[shadcn/ui](https://ui.shadcn.com)** - For the beautiful component library
- **[Vercel](https://vercel.com)** - For design inspiration
- **[Tailwind CSS](https://tailwindcss.com)** - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help:
- Check the [Convex documentation](https://docs.convex.dev)
- Join the [Convex Discord community](https://convex.dev/community)
- Open an issue in this repository

---

**Built with ❤️ by dazeb using Convex**
