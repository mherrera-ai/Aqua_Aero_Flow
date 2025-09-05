# 🌊 Aqua Aero Flow

An interactive particle flow visualization featuring dynamic visual modes and retro Windows 95 aesthetic design.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

This project showcases modern web development practices through an interactive particle visualization system. Built with vanilla JavaScript and no runtime dependencies, it demonstrates performance optimization, responsive design, and progressive web app capabilities.

### Key Technical Achievements

- **Dual Rendering System**: WebGL and Canvas2D for broader compatibility
- **Performance Optimization**: Adaptive particle count (200-2000) maintaining 60 FPS on mid-range devices
- **Progressive Web App**: Full offline functionality with service worker implementation
- **Accessibility**: WCAG 2.1 AA compliant with complete keyboard navigation and screen reader support
- **Responsive Design**: Touch-optimized controls with mobile-first approach
- **Security**: Content Security Policy enforcement with input sanitization
- **Testing Coverage**: Unit and E2E testing with 85%+ code coverage

## Features

### Visualization Modes
- Flow Field, Vortex, Waves, Spiral, and Nebula patterns
- Eight color schemes including colorblind-friendly options
- Adaptive particle system with smooth performance optimization

### Technical Features
- WebGL and Canvas2D rendering systems
- Video recording capability (WebM format)
- URL-based preset sharing
- Complete keyboard navigation support
- Touch-optimized mobile interface
- Service worker for offline functionality

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Core Engine**: Manages the main animation loop and coordinates between modules
- **Particle System**: Handles particle physics and behavior calculations
- **Flow Field Generator**: Creates vector fields for particle movement patterns
- **Rendering Pipeline**: Dual rendering system with WebGL and Canvas2D
- **Service Worker**: Manages offline caching and PWA functionality

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/aqua-aero-flow.git
cd aqua-aero-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Testing

```bash
# Run all quality checks
npm run check:all

# Individual test commands
npm run lint          # Code linting
npm run format:check  # Format verification
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report
```

## Usage

### Keyboard Shortcuts
- **1-5**: Switch between visualization modes
- **[ / ]**: Adjust flow speed
- **F**: Toggle fullscreen
- **R**: Reset visualization
- **S**: Take snapshot

### Mouse and Touch Controls
- Drag the control panel title bar to reposition
- Mouse movement attracts nearby particles
- Touch gestures supported on mobile devices

## Technology Stack

- **Build Tool**: Vite 7.1.2 for fast development and optimized production builds
- **Language**: Vanilla JavaScript ES6+ with JSDoc type annotations
- **Rendering**: WebGL and Canvas2D APIs
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Code Quality**: ESLint and Prettier for consistent code style
- **PWA**: Service Worker with Workbox for offline functionality

## Performance

The application is optimized for smooth performance across various devices:
- Maintains 60 FPS on mid-range hardware
- Adaptive particle count based on real-time performance metrics
- Efficient render loop using requestAnimationFrame
- Automatic WebGL context recovery
- Support for reduced motion preferences

## Accessibility

Built with inclusivity in mind:
- Full keyboard navigation support
- ARIA labels and proper semantic HTML
- Focus management for modal interactions
- Screen reader compatibility
- WCAG 2.1 AA compliance

## Security and Privacy

- Content Security Policy implementation
- No external dependencies or third-party requests
- Input sanitization for all user inputs
- No data collection or analytics
- All processing happens locally in the browser
- No microphone or camera access required

## Customization

### Creating Custom Presets
Settings can be saved and shared through URL parameters. Adjust the controls to your preference and use the save feature to generate a shareable link.

### Extending the Visualization
New visualization modes can be added by extending the flow field generator in `src/core/flowfield.js`. The modular architecture makes it straightforward to add new patterns and behaviors.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project combines retro aesthetics with modern web technologies to create an engaging visual experience. Special thanks to the open-source community for the excellent tools and libraries that made this project possible.