# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Cloud account (for OAuth)

### Initial Setup

1. **Clone and Install**
   ```powershell
   cd d:\Kooodaus\Derivaatta
   .\setup.ps1
   ```

2. **Configure Environment**
   Edit `.env` file with your credentials:
   - Get PostgreSQL URL from your database
   - Generate secret: `openssl rand -base64 32`
   - Setup Google OAuth (see below)

3. **Database Setup**
   ```powershell
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```powershell
   npm run dev
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Derivative Duel"
3. Enable APIs:
   - Google+ API
   - Google OAuth2 API
4. Create OAuth 2.0 Credentials:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.com/api/auth/callback/google` (production)
5. Copy Client ID and Secret to `.env`

## Database Commands

```powershell
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

## Development Workflow

### Adding New Features

1. **Database Changes**
   - Edit `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name your_change`
   - Run `npx prisma generate`

2. **API Endpoints**
   - Create in `app/api/your-endpoint/route.ts`
   - Use `getServerSession` for auth
   - Return `NextResponse.json()`

3. **Pages**
   - Create in `app/your-page/page.tsx`
   - Use `'use client'` for interactive components
   - Import from `next-auth/react` for client-side auth

### Testing Locally

```powershell
# Run dev server
npm run dev

# Build for production
npm run build

# Run production build
npm run start
```

## Useful Snippets

### Check User Authentication (Server)
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const session = await getServerSession(authOptions);
if (!session?.user?.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Check User Authentication (Client)
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
if (status === 'loading') return <div>Loading...</div>;
if (!session) return <div>Not authenticated</div>;
```

### Database Query
```typescript
import { prisma } from '@/lib/prisma';

const user = await prisma.user.findUnique({
  where: { email: session.user.email },
  include: { matchesAsPlayer1: true },
});
```

## Common Issues

### Issue: "Cannot find module 'next-auth'"
**Solution**: Run `npm install`

### Issue: "Prisma Client not found"
**Solution**: Run `npx prisma generate`

### Issue: Database connection error
**Solution**: Check DATABASE_URL in `.env`

### Issue: Google OAuth not working
**Solution**: 
- Verify redirect URI matches exactly
- Check Client ID and Secret
- Ensure NEXTAUTH_URL is set correctly

### Issue: TypeScript errors
**Solution**: Install dependencies first, errors should resolve

## Project Structure Best Practices

### API Routes
- Keep logic minimal
- Extract business logic to `lib/` files
- Always validate session
- Use proper HTTP status codes

### Components
- Small, focused components
- Use TypeScript interfaces
- Client components for interactivity
- Server components by default

### Database
- Use transactions for related updates
- Index frequently queried fields
- Use `select` to limit returned data
- Avoid N+1 queries with `include`

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection
- `NEXTAUTH_SECRET`: Random secret key
- `NEXTAUTH_URL`: App URL
- `GOOGLE_CLIENT_ID`: OAuth client ID
- `GOOGLE_CLIENT_SECRET`: OAuth secret

### Optional (Future)
- `REDIS_URL`: For matchmaking queue
- `WEBSOCKET_URL`: For real-time games
- `SENTRY_DSN`: Error tracking

## Performance Tips

1. **Use Server Components**: Default to server components, only use client when needed
2. **Database Indexes**: Index ELO, email, match status
3. **Limit Queries**: Use `select` to only get needed fields
4. **Cache Static Data**: Use Next.js caching for leaderboards
5. **Optimize Images**: Use Next.js Image component

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Test Google OAuth with production URL
- [ ] Add production redirect URI to Google Console
- [ ] Build succeeds (`npm run build`)
- [ ] Test in production mode (`npm run start`)
- [ ] Setup error monitoring (Sentry)
- [ ] Configure CORS if needed
- [ ] Setup database backups

## Debugging

### Enable Prisma Query Logging
```env
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=10"
DEBUG="prisma:query"
```

### Next.js Debug Mode
```powershell
$env:NODE_OPTIONS="--inspect"; npm run dev
```

### Check Logs
- Check browser console for client errors
- Check terminal for server errors
- Use `console.log` strategically
- Use Prisma Studio to inspect database

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
