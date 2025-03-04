# Deploying a Next.js + TypeScript App to Vercel with Supabase Integration

## 1. Prepare Your Next.js App
Ensure your Next.js app is production-ready:
- **TypeScript Configuration**: Ensure `tsconfig.json` is properly configured.
- **Environment Variables**: Use `.env.local` for local development and `.env` for production variables.
- **Build Configuration**: Ensure `next.config.js` is properly configured for production.

## 2. Set Up Supabase
- **Create a Supabase Project**: Sign up at [Supabase](https://supabase.io/) and create a new project.
- **Database Configuration**: Set up your database schema and tables.
- **API Keys**: Obtain your Supabase URL and API keys from the Supabase dashboard.

## 3. Configure Environment Variables
Add the following environment variables to your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public API key.

## 4. Update Your Next.js App
- **Install Supabase Client**: Install the Supabase client library.
  ```bash
  pnpm add @supabase/supabase-js
  ```
- **Initialize Supabase Client**: Create a file (e.g., `lib/supabaseClient.ts`) to initialize the Supabase client.
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

## 5. Deploy to Vercel
- **Connect to Vercel**: Push your code to a Git repository (GitHub, GitLab, or Bitbucket) and connect it to Vercel.
- **Configure Build Settings**: Ensure Vercel is set to use the correct build command (`pnpm build`) and output directory (`.next`).
- **Environment Variables**: Add the environment variables in the Vercel dashboard under the "Environment Variables" section.

## 6. Best Practices
- **Environment Variables Management**: Use Vercel's environment variable management to securely store and manage your variables.
- **Monitoring and Logging**: Use Vercel's built-in monitoring and logging tools to keep track of your app's performance and errors.
- **Security**: Ensure sensitive data is not exposed in the client-side code. Use server-side functions to handle sensitive operations.

## Example `.env.local` File
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Example `next.config.js`
```javascript
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};
```

## Example `lib/supabaseClient.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

By following these steps and best practices, you can ensure a smooth and production-ready deployment of your Next.js + TypeScript app with Supabase integration on Vercel.