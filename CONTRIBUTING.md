# Contributing to Aqua Aero Flow

Thank you for your interest in contributing to Aqua Aero Flow! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Console errors (if any)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run check:all`)
5. Commit your changes using semantic commit messages
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/aqua-aero-flow.git
cd aqua-aero-flow

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
npm run test:e2e
```

## Commit Messages

We follow semantic commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Code Style

- Use Prettier for formatting (`npm run format`)
- Follow ESLint rules (`npm run lint`)
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions small and focused

## Testing

- Write unit tests for utilities and core logic
- Add E2E tests for user-facing features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

## Performance Guidelines

- Test on mid-tier devices
- Respect `prefers-reduced-motion`
- Optimize for 60 FPS
- Keep bundle size minimal
- Profile before and after changes

## Accessibility

- Provide keyboard navigation
- Include ARIA labels
- Test with screen readers
- Ensure sufficient color contrast
- Support browser zoom

## Questions?

Feel free to open an issue for any questions about contributing!