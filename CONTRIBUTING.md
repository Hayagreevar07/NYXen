# Contributing to Nyxen

Thank you for your interest in contributing to Nyxen! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow the established coding style
- Report security issues responsibly

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/nyxen.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Test your changes
6. Commit with descriptive messages
7. Push to your fork
8. Create a Pull Request

## Development Workflow

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

## Code Style

### TypeScript
- Use strict mode
- Define types explicitly
- Avoid `any` type

### JavaScript
- Use ES6+ features
- Use arrow functions
- Use const/let, avoid var

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Use custom components for reuse

## Commit Messages

Follow conventional commits:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor code`
- `test: Add tests`

## Testing

```bash
# Frontend
npm test

# Backend
npm test
```

## Pull Request Process

1. Update README.md with changes
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Request review from maintainers
6. Address review feedback

## Reporting Issues

- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Provide expected vs actual behavior
- Include environment information

## Security

- Report security vulnerabilities via email: security@nyxen.ai
- Do not disclose vulnerabilities publicly
- Allow time for fix before disclosure

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🚀
