# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 3141 with host binding
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run start` - Alias for dev command

### Specialized Build
- `npm run build:scratch-gui` - Build the Scratch GUI component in scratch-gui directory

## Project Architecture

### Technology Stack
- **Frontend Framework**: Vue 3 with Composition API
- **UI Library**: Vuetify 3 (Material Design components)
- **Build Tool**: Vite with extensive plugin ecosystem
- **State Management**: Pinia for reactive state
- **Routing**: Vue Router with auto-generated routes via unplugin-vue-router
- **Code Editor**: Monaco Editor integration
- **Styling**: SCSS with Sass modern API

### Key Architectural Patterns

#### File-Based Routing
Routes are automatically generated from the `src/pages/` directory structure. The router uses:
- Dynamic routes with bracket notation: `[username]/[projectname]/edit.vue`
- Nested routing with index files
- Layouts system via `vite-plugin-vue-layouts`

#### Component Organization
```
src/components/
├── account/          # User authentication and profile components
├── admin/            # Administrative interface components  
├── project/          # Project-related UI components
├── projectlist/      # Project list management
├── editor/           # Code editing components (Monaco-based)
└── shared/           # Reusable UI components
```

#### Monaco Editor Integration
The codebase features a sophisticated Monaco Editor implementation:
- `EditorMonacoComponent.vue` - Main editor wrapper with Vue 3 integration
- `DiffMonacoComponent.vue` - Side-by-side diff viewing
- Multi-tab editor system with instance management
- Language detection and syntax highlighting
- Real-time collaboration features

#### Project Editor System (`edit.vue`)
The project editor is a complex multi-tab system featuring:
- **Tab Management**: Dynamic tab creation/destruction with proper Monaco instance cleanup
- **Git Integration**: Branch switching, commit history, and diff viewing
- **Content Loading**: Asynchronous commit content loading with retry mechanisms
- **State Management**: Separate tracking for loading states, editor instances, and modified content

### API Integration
- Axios instance with JWT token refresh handling
- Automatic authorization header injection
- Request/response interceptors for error handling
- Base URL configuration via environment variables (`VITE_APP_BASE_API`)

### State Management Patterns
- Pinia stores for global state (`src/stores/`)
- Reactive user authentication state
- Project editing state management
- Notification system integration

### Styling Architecture
- SCSS preprocessing with modern Sass API
- Vuetify theme customization via `src/styles/settings.scss`
- Scoped component styles
- Material Design principles

## Important Code Conventions

### Editor Instance Management
When working with Monaco Editor components:
- Always clean up editor instances before creating new ones
- Use proper ref management for editor components
- Handle loading states to prevent initialization conflicts
- Implement retry mechanisms for editor initialization failures

### Vue 3 Patterns
- Composition API preferred over Options API
- Use `defineModel()` for v-model implementations
- Emit events for component communication
- Proper lifecycle management with `onMounted`/`onBeforeUnmount`

### Git Integration
The project editor implements a sophisticated Git workflow:
- Branch-based development with automatic branch switching
- Commit history viewing with content loading
- File comparison and diff visualization
- Proper handling of commit restoration

### Error Handling
- Comprehensive error handling in async operations
- User-friendly error messages via Snackbar notifications
- Proper error state management in components
- Fallback content for failed operations

## Development Environment

### Auto-Import Configuration
The project uses extensive auto-imports:
- Vue 3 Composition API functions
- Vue Router composables  
- Component auto-importing via unplugin-vue-components
- ESLint integration for auto-import validation

### Build Configuration
- Vite with Hot Module Replacement
- Monaco Editor static asset copying to `monaco-editor/min/vs`
- SCSS/Sass preprocessing with Node Package Importer
- Auto-layout generation for pages

### Browser Compatibility
- Modern browser targets
- Dynamic import error handling with automatic reload
- WebSocket support for real-time features

## Common Patterns for New Features

### Adding New Pages
1. Create Vue file in appropriate `src/pages/` subdirectory
2. Use bracket notation for dynamic routes: `[param].vue`
3. Apply appropriate layout via `<route>` meta in component
4. Follow existing authentication patterns if user-specific

### Monaco Editor Extensions
1. Extend `EditorMonacoComponent.vue` for new editor features
2. Implement proper instance cleanup in `beforeUnmount`
3. Handle loading states and retry mechanisms
4. Use reactive props for dynamic configuration

### API Integration
1. Follow existing Axios patterns in `src/axios/axios.js`
2. Implement proper error handling with user feedback
3. Use environment variables for API endpoints
4. Handle authentication token refresh automatically

### State Management
1. Create new Pinia stores in `src/stores/` for complex state
2. Use reactive refs for component-local state
3. Implement proper state persistence where needed
4. Follow existing patterns for user/project state