# Convex Integration Plan for AndrieWijayaMe

This plan outlines the steps to integrate **Convex** as the backend for the "Digital Journal of Andrie Wijaya". Convex will provide a real-time database, serverless functions, and file storage.

## 1. Installation & Initial Setup

1. **Install Dependencies**:
   ```bash
   npm install convex
   ```

2. **Initialize Convex**:
   Run the following command to create a Convex project and link it to your local environment:
   ```bash
   npx convex dev
   ```
   This will create a `convex/` directory and a `.env.local` file with your deployment URL.

## 2. Database Schema Definition

Create `convex/schema.ts` to define the structure of your data (e.g., projects, blog posts, contact messages).

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    year: v.string(),
    url: v.optional(v.string()),
  }),
  messages: defineTable({
    name: v.string(),
    email: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }),
});
```

## 3. Creating Backend Functions

Create functions in the `convex/` directory to interact with the data.

### Example: Query Projects (`convex/projects.ts`)
```typescript
import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});
```

### Example: Mutation for Messages (`convex/messages.ts`)
```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: { name: v.string(), email: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
```

## 4. Frontend Integration (Next.js App Router)

### A. Create a Client Provider
Create `src/components/ConvexClientProvider.tsx` to wrap the client-side parts of the app.

```tsx
"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### B. Update Root Layout
Wrap the `children` in `src/app/layout.tsx` with the provider.

```tsx
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```

## 5. Usage in Components

Use the `useQuery` and `useMutation` hooks in your React components.

```tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ProjectList() {
  const projects = useQuery(api.projects.get);
  // ... render projects
}
```

## 6. Server-Side Integration

### Can Convex be used from a server backend?
**Yes.** Convex provides multiple ways to interact from a server (Node.js, Next.js Server Actions, or external backends):

1. **ConvexHttpClient**: Use this for standard HTTP calls to your functions from a server environment.
   ```typescript
   import { ConvexHttpClient } from "convex/browser";
   import { api } from "./convex/_generated/api";

   const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
   const data = await client.query(api.projects.get);
   ```
2. **Action Functions**: You can create `action` functions in Convex that can perform side effects (like calling external APIs) and these can be triggered via HTTP.

## Next Steps
- [ ] Run `npm install convex`
- [ ] Initialize project with `npx convex dev`
- [ ] Define the initial schema for your projects and blog.
