# Setup Guide for Front Row Challenge

This guide walks through setting up the Front Row Challenge project for development or deployment.

## Prerequisites

- **Node.js:** 22.13.0 or higher
- **pnpm:** Latest version (package manager)
- **MySQL/TiDB:** Database server
- **Git:** Version control

## Environment Variables

Create a `.env` file in the project root with the following variables:

### Database
```env
DATABASE_URL=mysql://username:password@localhost:3306/front_row_challenge
```

### Authentication & Security
```env
JWT_SECRET=your-secure-random-secret-key-min-32-chars
```

### Manus OAuth (Required for Authentication)
```env
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Owner Information
```env
OWNER_NAME=Your Full Name
OWNER_OPEN_ID=your-open-id-from-manus
```

### Manus Forge API (LLM, Storage, Notifications)
```env
BUILT_IN_FORGE_API_KEY=your-forge-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Analytics (Optional)
```env
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### App Configuration (Optional)
```env
VITE_APP_TITLE=Front Row Challenge
VITE_APP_LOGO=https://your-domain.com/logo.svg
```

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/front-row-challenge.git
cd front-row-challenge
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 4. Set Up Database

```bash
# Generate and apply database migrations
pnpm db:push
```

This command:
- Generates migration files based on `drizzle/schema.ts`
- Applies migrations to your database
- Creates all required tables and indexes

### 5. Start Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:3000`

## Development Commands

### Start Development Server
```bash
pnpm dev
```

### Run Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/analysis.test.ts

# Run tests in watch mode
pnpm test --watch
```

### Format Code
```bash
pnpm format
```

### Build for Production
```bash
pnpm build
```

### Database Operations
```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Migrate database
pnpm db:migrate
```

## Troubleshooting

### Database Connection Issues

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
- Verify MySQL/TiDB is running
- Check DATABASE_URL is correct
- Ensure database user has proper permissions

```bash
# Test connection
mysql -h localhost -u username -p database_name
```

### Missing Dependencies

**Error:** `Module not found`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### OAuth Configuration Issues

**Error:** `OAuth callback failed` or `Invalid app ID`

**Solution:**
- Verify VITE_APP_ID matches your Manus application
- Check OAUTH_SERVER_URL is correct
- Ensure callback URL is registered in Manus console

### LLM API Errors

**Error:** `API key invalid` or `Unauthorized`

**Solution:**
- Verify BUILT_IN_FORGE_API_KEY is correct
- Check API endpoint is accessible
- Ensure API key has required permissions

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing: `pnpm test`
- [ ] No TypeScript errors: `pnpm build`
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security review completed

### Build for Production

```bash
pnpm build
```

This creates:
- `dist/` - Frontend build
- `dist/index.js` - Backend server

### Environment for Production

Update `.env` with production values:

```env
NODE_ENV=production
JWT_SECRET=your-production-secret-key
DATABASE_URL=mysql://prod_user:prod_password@prod_host:3306/prod_db
# ... other production values
```

### Running Production Server

```bash
# Start production server
node dist/index.js
```

## Database Schema

The project uses Drizzle ORM with the following main tables:

- **users** - User accounts and authentication
- **episodes** - Podcast episodes
- **arguments** - Extracted arguments from transcripts
- **topics** - Extracted topics
- **individuals** - Discovered individuals (contrarian and similar)
- **sources** - References and sources for arguments

See `drizzle/schema.ts` for complete schema definition.

## API Documentation

The project uses tRPC for type-safe API communication. Main procedures:

### Episodes Router
- `episodes.list` - List all episodes
- `episodes.getById` - Get episode details
- `episodes.analyze` - Analyze episode transcript
- `episodes.delete` - Delete episode

### Analysis Router
- `analysis.extractArguments` - Extract arguments from transcript
- `analysis.findContrarians` - Find contrarian individuals
- `analysis.findSimilar` - Find similar-minded individuals

### Auth Router
- `auth.me` - Get current user
- `auth.logout` - Logout user

## Performance Optimization

### Database Optimization
- Indexes are automatically created on foreign keys
- Add custom indexes for frequently queried fields
- Use query analysis to identify slow queries

### Frontend Optimization
- Code splitting enabled by default
- Lazy loading for routes
- Image optimization with Tailwind
- CSS minification in production

### Caching Strategy
- React Query handles request caching
- Set appropriate stale times for different data types
- Use optimistic updates for better UX

## Monitoring & Logging

### Log Files
- `.manus-logs/devserver.log` - Server startup and errors
- `.manus-logs/browserConsole.log` - Client-side console output
- `.manus-logs/networkRequests.log` - HTTP requests
- `.manus-logs/sessionReplay.log` - User interactions

### Health Checks
```bash
# Check dev server status
curl http://localhost:3000/api/health

# Check database connection
# Use database client to verify connection
```

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` template
2. **Rotate JWT_SECRET regularly** - Change in production
3. **Use HTTPS in production** - Enable SSL/TLS
4. **Validate all inputs** - Use zod schemas
5. **Keep dependencies updated** - Run `pnpm update` regularly
6. **Review security logs** - Monitor authentication failures

## Getting Help

- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Review [README.md](./README.md) for project overview
- Check existing GitHub issues
- Create a new issue for bugs or feature requests

## Next Steps

1. Read the [README.md](./README.md) for project overview
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
3. Check out the Episodes Dashboard at `/episodes`
4. Explore the codebase structure
5. Run tests to verify setup: `pnpm test`

---

**Last Updated:** April 2026
