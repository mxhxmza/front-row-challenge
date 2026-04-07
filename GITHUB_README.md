# Front Row Challenge: AI Agent Framework for Podcast Guest Discovery

An intelligent AI agent framework that transforms podcast transcripts into a dynamic network of ideas, connecting analysts with like-minded thinkers and contrarian voices for compelling conversations.

## 🎯 Overview

Front Row Challenge solves three critical pain points for podcast analysts:

1. **Reading Transcripts End-to-End** - Manually parsing lengthy transcripts to identify key arguments and claims
2. **Searching for Related Viewpoints** - Finding adjacent thinkers and operators with similar or opposing views
3. **Connecting Ideas to People** - Linking abstract ideas to specific individuals, companies, and prior discussions

The framework automates these tasks using advanced LLM-powered analysis, multi-source search, and knowledge graph construction.

## ✨ Core Capabilities

### 1. Transcript Analysis & Argument Extraction
Ingests raw podcast transcripts and uses advanced argument mining to extract key claims, premises, and topics. The system identifies both simple and complex arguments, categorizing them by theme and subject matter.

**Features:**
- Argument mining with claim/premise/rebuttal detection
- Topic extraction and categorization
- Argument strength scoring
- Singlish term identification for regional context

### 2. Viewpoint Discovery Engine
Uses extracted arguments to initiate multi-faceted search across academic papers, industry publications, social media, and personal blogs to find aligned, contrarian, and nuanced perspectives.

**Features:**
- Multi-source search (academic, industry, social, personal)
- Contrarian viewpoint detection
- Relevance scoring and ranking
- Source credibility validation

### 3. Knowledge Graph & Recommendation
Transforms flat guest lists into a rich, interconnected network of ideas and experts using entity and relationship extraction for intelligent guest recommendations.

**Features:**
- Dynamic knowledge graph construction
- Entity relationship mapping
- Intelligent recommendation engine
- Guest similarity scoring

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL/TiDB database
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/front-row-challenge.git
cd front-row-challenge

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id

# API Keys
BUILT_IN_FORGE_API_KEY=your-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## 📁 Project Structure

```
front-row-challenge/
├── client/                    # React 19 frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   └── index.html            # HTML template
├── server/                    # Express backend
│   ├── _core/                # Core framework (OAuth, context, etc.)
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   ├── storage.ts            # S3 file storage helpers
│   ├── analysis.ts           # Transcript analysis logic
│   ├── argument-sources.ts   # Source extraction and validation
│   ├── similar-individuals.ts # Similar person discovery
│   └── *.test.ts             # Vitest test files
├── drizzle/                   # Database schema and migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # Migration files
├── shared/                    # Shared types and constants
├── storage/                   # S3 storage configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Test configuration
```

## 🛠 Development Workflow

### Adding a New Feature

1. **Update Database Schema** (if needed)
   ```bash
   # Edit drizzle/schema.ts
   pnpm db:push
   ```

2. **Add Database Helpers**
   - Create query functions in `server/db.ts`

3. **Create tRPC Procedures**
   - Add procedures in `server/routers.ts`
   - Use `publicProcedure` or `protectedProcedure`

4. **Build Frontend UI**
   - Create components in `client/src/pages/` or `client/src/components/`
   - Call procedures with `trpc.*.useQuery()` or `trpc.*.useMutation()`

5. **Write Tests**
   ```bash
   # Create test file: server/feature.test.ts
   pnpm test
   ```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/analysis.test.ts

# Run tests in watch mode
pnpm test --watch
```

### Building for Production

```bash
pnpm build
```

## 🔑 Key Technologies

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Express 4, tRPC 11, Drizzle ORM
- **Database:** MySQL/TiDB
- **Authentication:** Manus OAuth
- **LLM Integration:** Built-in Forge API
- **Storage:** AWS S3
- **Testing:** Vitest
- **Build Tool:** Vite, esbuild

## 📊 Architecture

### Data Flow

```
Podcast Transcript
    ↓
[Transcript Analysis Module]
    ├─ Extract Arguments
    ├─ Identify Topics
    └─ Score Strength
    ↓
[Viewpoint Discovery Module]
    ├─ Search Multi-Sources
    ├─ Detect Contrarians
    └─ Validate Sources
    ↓
[Knowledge Graph Module]
    ├─ Extract Entities
    ├─ Map Relationships
    └─ Generate Recommendations
    ↓
Episodes Dashboard
    ├─ Contrarian Individuals
    ├─ Similar-Minded Thinkers
    └─ Sources & References
```

### API Architecture

All backend communication uses tRPC with the following structure:

```typescript
// Server-side procedure definition
export const router = {
  episodes: {
    analyze: protectedProcedure
      .input(z.object({ episodeId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Implementation
      })
  }
};

// Client-side usage
const { mutate } = trpc.episodes.analyze.useMutation();
```

## 🔐 Security Features

- **OAuth 2.0 Authentication** - Secure user authentication via Manus
- **Session Management** - JWT-based session cookies
- **Role-Based Access Control** - Admin and user roles
- **URL Validation** - Prevents broken links in sources
- **Input Validation** - zod schemas for all inputs
- **CORS Protection** - Configured for production domains

## 📈 Performance Optimizations

- **Optimistic Updates** - Instant UI feedback for mutations
- **Query Caching** - React Query handles request deduplication
- **Lazy Loading** - Components load on demand
- **Database Indexing** - Optimized queries with proper indexes
- **S3 Storage** - Offload file storage to cloud

## 🧪 Testing Strategy

The project includes comprehensive test coverage:

- **Unit Tests** - Individual function testing with Vitest
- **Integration Tests** - tRPC procedure testing
- **URL Validation Tests** - Source link verification
- **Email Tests** - Email sending functionality
- **Auth Tests** - Authentication flow validation

Run tests with:
```bash
pnpm test
```

## 📝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Standards

- Follow TypeScript strict mode
- Write tests for new features
- Use Prettier for code formatting
- Follow the existing code structure
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Support

For issues, questions, or suggestions:

1. Check existing [GitHub Issues](https://github.com/yourusername/front-row-challenge/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce bugs
4. Provide relevant logs or screenshots

## 🎓 Learning Resources

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🚀 Deployment

The project is optimized for deployment on Manus hosting with custom domain support. For external hosting (Railway, Render, Vercel), additional configuration may be required.

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build completes without errors
- [ ] Security review completed
- [ ] Performance tested

## 📊 Project Statistics

- **Test Coverage:** 67 tests across 6 test files
- **TypeScript:** 100% strict mode
- **Code Quality:** ESLint + Prettier configured
- **Performance:** Optimized for sub-100ms response times

## 🙏 Acknowledgments

Built for the AI For All #CREATE-A-THON with support from the Manus framework.

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Production Ready
