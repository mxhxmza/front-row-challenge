# Contributing to Front Row Challenge

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Front Row Challenge project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/front-row-challenge.git
cd front-row-challenge

# Add upstream remote
git remote add upstream https://github.com/original/front-row-challenge.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
pnpm install

# Create .env file with required variables
cp .env.example .env

# Set up database
pnpm db:push

# Start development server
pnpm dev
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
```

## Development Guidelines

### Code Style

- **TypeScript:** Use strict mode, no `any` types unless absolutely necessary
- **Formatting:** Run `pnpm format` before committing
- **Linting:** Ensure no ESLint errors: `pnpm lint`
- **Naming:** Use descriptive names for variables, functions, and components

### File Organization

**Backend (server/):**
- Procedures in `routers.ts`
- Database queries in `db.ts`
- Business logic in feature-specific files
- Tests in `*.test.ts` files

**Frontend (client/src/):**
- Page components in `pages/`
- Reusable components in `components/`
- Custom hooks in `hooks/`
- Utilities in `lib/`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`  
**Scope:** The area affected (e.g., `analysis`, `ui`, `auth`, `db`)

**Examples:**
```
feat(analysis): add argument strength scoring
fix(ui): correct source display formatting
docs(readme): update installation instructions
test(sources): add URL validation tests
```

### Writing Tests

All new features must include tests. Use Vitest:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', async () => {
    // Arrange
    const input = { /* ... */ };

    // Act
    const result = await functionUnderTest(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

**Test Requirements:**
- Minimum 80% code coverage for new features
- Test both success and error cases
- Use descriptive test names
- Mock external dependencies (LLM, APIs, etc.)

Run tests:
```bash
pnpm test
```

### Database Changes

When modifying the database schema:

1. Edit `drizzle/schema.ts`
2. Run `pnpm db:push` to generate and apply migrations
3. Update `server/db.ts` with new query helpers
4. Add tests for new queries
5. Document schema changes in commit message

### API Changes

When adding or modifying tRPC procedures:

1. Define input schema using zod
2. Add procedure to `server/routers.ts`
3. Update frontend to use new procedure
4. Add tests for the procedure
5. Update API documentation if needed

**Example:**
```typescript
// server/routers.ts
export const router = {
  episodes: {
    analyze: protectedProcedure
      .input(z.object({
        episodeId: z.string().min(1),
        includeContrarians: z.boolean().default(true)
      }))
      .mutation(async ({ ctx, input }) => {
        // Implementation with proper error handling
        return result;
      })
  }
};
```

### Frontend Components

- Use shadcn/ui components for consistency
- Leverage Tailwind CSS utilities
- Implement loading and error states
- Add accessibility attributes (aria-labels, roles)
- Test responsive design on mobile/tablet/desktop

**Component Template:**
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: ComponentProps) {
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
}
```

## Pull Request Process

### Before Submitting

1. **Update from upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks:**
   ```bash
   pnpm format
   pnpm lint
   pnpm test
   pnpm build
   ```

3. **Verify no conflicts:**
   ```bash
   git status
   ```

### Creating a Pull Request

1. Push your branch to your fork
2. Create a PR with a clear title and description
3. Reference related issues (e.g., "Fixes #123")
4. Include screenshots for UI changes
5. Wait for review and CI checks to pass

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

- Maintainers will review your PR within 2-3 days
- Address feedback and push updates
- Once approved, your PR will be merged
- Your contribution will be credited in release notes

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error logs or screenshots
- Possible solutions (if known)

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if applicable)
- Potential impact on existing features

## Development Tips

### Debugging

**Server-side:**
```bash
# Add console.log statements
console.log('[Feature]', variable);

# Check server logs
tail -f .manus-logs/devserver.log
```

**Client-side:**
```bash
# Browser DevTools
# Check network requests in Network tab
# View console errors in Console tab

# Check client logs
tail -f .manus-logs/browserConsole.log
```

### Performance Testing

```bash
# Check build size
pnpm build

# Monitor performance
# Use browser DevTools Performance tab
# Check network request timing in Network tab
```

### Database Debugging

```bash
# Access database via Management UI
# Or use MySQL client
mysql -h host -u user -p database
```

## Documentation

When contributing:

- Update README.md if adding major features
- Add JSDoc comments to complex functions
- Update CONTRIBUTING.md if changing development process
- Include inline comments for non-obvious logic

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

Maintainers handle releases and will credit all contributors.

## Questions?

- Check existing issues and discussions
- Ask in pull request comments
- Open a discussion for design questions
- Email maintainers for urgent matters

## Recognition

Contributors will be recognized in:
- Release notes
- README contributors section
- GitHub insights page

Thank you for contributing to Front Row Challenge! 🎉

---

**Last Updated:** April 2026
