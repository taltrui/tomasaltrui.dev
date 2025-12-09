---
layout: ../../layouts/blog-post.astro
title: "TanStack Start + Better Auth - How to"
description: "A (hope it is) comprehensive guide for building a TanStack Start application with Better Auth, Drizzle ORM, and PostgreSQL"
date: "2024-12-09"
---

## Table of Contents

- [Initial comments](#initial-comments)
- [What I use](#what-i-use)
- [Project Setup](#project-setup)
- [Database Configuration](#database-configuration)
- [Authentication Setup](#authentication-setup)
- [Routing Architecture](#routing-architecture)

## Initial comments

I been trying out Tanstack Start for a while now, I think the dev experience is amazing, it is pretty simple to grasp and it is way less complex overall than Next and Remix.

Since I been tinkering with some integrations: Neon, Convex, Netlify, Cloudflare, Clerk, Supabase, Prisma, and some other I may be forgetting, I though it would be good to write down the stack that worked best for me.

What is best for me (maybe it is for you too)? 
- I'm cheap, so I didn't want to spend too much on MVPs to try out my ideas
- Vendor lock-in to be as little as possible
- Wanted to experiment and learn about infra, so as little as managed as possible.

So that being said, bear with me and let's start

## What I use

> *We won't be using/going through all these in this guide, but if you want me to go deep in some of them, let me know!*

- **TanStack Start** - Mister obvious, am I right.
- **TanStack Router** - There may be a pattern here.
- **TanStack Query** - Yeah, I get it!
- **TanStack Form** - Oh ffs.
- **Better Auth** - Auth is hard man (not that hard actually, I'm lazy), leave it to the pros.
- **Drizzle** - LOVE IT. PERIOD.
- **Tailwind** - HATED IT. Now I tolerate it.
- **React Aria Components** - I think right now the best UI primitives you can get. But use what you fancy.
- **Biome** - Idk, was trying out stuff, Prettier/ESLint is solid too.
- **Vitest** - Joke, we ain't testing.

## WE WILL USE PNPM. YOU CAN USE WHAT YOU WANT, BUT WHY ISN'T PNPM WHAT YOU WANT?

## Project Setup

### 1. First, the first, let's create our project

Folks at TanStack created an awesome step by step setup, so lets use that.

There are a few main things that you can accept or not, it won't change the outcome much, but some others you need to:
- **Would you like to use Tailwind CSS?** - Up to you
- **Toolchain** - Up to you 
- **Deployment adapter** - I will be using Nitro to deploy into a VPS, but up to you!
- **Add-ons**
  - Drizzle and Query: Must
  - All the others: up to you
- **Do not start with any example**.
- **DB provider** - PostgreSQL will be our choice, but up to you.

```bash
pnpm create @tanstack/start
```

Now you will have your project almost done, we just need to add `better-auth`
```bash
pnpm add better-auth
```

It is also a good time to add any other dependencies you want, like `react-aria` components.

## Database Configuration

### 1. Drizzle

You will have a `src/db/index.ts` file with the initial Drizzle config.

It is using `Pool` (very good). You can use the default config for `pg` Pool, but I use this one:

```typescript
{
	connectionString: process.env.DATABASE_URL,
	max: 10,
	min: 2,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 5000,
}

```

### 2. Which DB to use

You can use whatever you want to use. Neon, Supabase and Convex are all good options if you want something fully managed.

I particularly wanted to not use any of them, so I rented a VPS in Hetzner and used Coolify to host my own DB.

Locally I just use Docker to spin-up a Postgres DB and PGAdmin for me using a `docker-compose.yml`

```yml
services:
  postgres:
    image: postgres:17-alpine
    container_name: app-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: app-pgadmin
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres

volumes:
  postgres_data:
  pgadmin_data:
```

*tip: you can use Drizzle Studio instead of PGAdmin.*

*tip 2: your DB url is*

```bash
postgresql://[POSTGRES_USER]:[POSTGRES_PASSWORD]@localhost:5432/[POSTGRES_DB]
```

## Authentication Setup

### 1. Setting up Better Auth

First of all you need to set up two env vars:
- **BETTER_AUTH_SECRET** - you can use `openssl rand -base64 32` to create it
- **BETTER_AUTH_URL** - `http://localhost:3000` for local or your actual URL

Then you can create `src/lib/auth.ts` - This will hold our server configuration.

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
```

Let me explain some little things before we continue.

- `session`: The idea behind this is to not call the session endpoint everytime we do a call or enter a page (it will come clearer later)
- `plugins`: This is the official better-auth plugin to automatically handle cookies, so it is a must have. 
- You can add other providers, like Google, and things like email verification, but I think it doesn't add to this guide, so we will skip it.

### 2. We need an API route to handle auth

Create `src/routes/api/auth/$.ts` with:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => auth.handler(request),
			POST: ({ request }) => auth.handler(request),
		},
	},
});
```

And that's it, `better-auth` will call this EP for all auth related and the plugin we added will handle all that is cookie related.

### 3. We also have a client for the client!

We will use this client to handle everything but routes authentication.

Create `src/lib/auth-client.ts` and paste this:

```typescript
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

Exporting the utilities is not needed, I just think it is a bit cleaner.

### 4. DB work

We now need to run

```bash
npx @better-auth/cli generate
```


This will create a `auth-schema.ts` file. My recomendation is that you paste it's content into your `src/db/schema.ts` file, so you have everything in one place.

Then, we create the migration and push it to our local DB:

```bash
pnpm db:generate
pnpm db:push
```

Now you are all set, good job!

### 5. Getting the session on the server

We need to somehow get the session on the server to authenticate routes, so, create `src/services/auth.ts` and add:

```typescript
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const headers = getRequestHeaders();

		const session = await auth.api.getSession({
			headers,
		});

		return session;
	},
);
```

`better-auth` will get the session from the cookies (it is all coming into pieces, right??) and we can use it on the server!


### 6. Auth middleware (AMAZING!!)

Create `src/middlewares/auth.ts` with:

```typescript
import { createMiddleware } from "@tanstack/react-start";
import { getSessionFn } from "@/services/auth";

const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await getSessionFn();
		if (!session?.user) {
			throw new Error("Unauthorized");
		}
		return next({ context: { session } });
	},
);

export default authMiddleware;
```

This is awesome, I can't express how good middlewares are. You can very, very easily authenticate any server function with this, for example, say you want to list all the `dogs` that belong to a user in your Dog App:

```typescript
export const listDogsFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const allDogs = await db
			.select()
			.from(dogs)
			.where(eq(dogs.userId, context.session.user.id))
			.orderBy(desc(dogs.createdAt));

		return dogs;
	});
```

If someone is not authenticated this will throw an error, but if they are, you just have the user id from the session. **How awesome is that??**

This (and route auth, that comes later) is also the reason we use a cookie cache in the session config. If we don't add that, `auth.api.getSession` will **always** make a call for the session, which is not ideal. 

### 6. Authenticating an user

The official recommendation by the beter-auth team (and mine, of course) is to handle auth flow in the client side. So I'll leave you here a simple version of what I did (without verification emails and social auth).

```typescript
export const useSignUp = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (data: {
			email: string;
			password: string;
			name: string;
		}) => {
			const result = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
			});

			if (result.error) {
				throw result.error;
			}

			return { ...result, email: data.email };
		},
		onSuccess: (data) => {
			router.navigate({ to: "/" });
		},
		onError: (error) => {
			// do something with the error
		},
	});
};
```
```typescript
export const useLogin = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				const err = result.error as AuthError;
				throw { ...err, email: data.email };
			}

			return result;
		},
		onSuccess: () => {
			router.navigate({ to: "/" });
		},
		onError: (error: (Error | AuthError) & { email?: string }) => {
			// do something with the error
		},
	});
};
```
```typescript
export const useLogout = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async () => {
			await authClient.signOut();
		},
		onSuccess: () => {
			router.navigate({ to: "/sign_in" });
		},
	});
};
```

The idea behind using Query's Mutations to handle this is to have a standarized way of handling states and being consistent on how we interact with our services. 

## Routing Architecture

### 1. The gist

The main concept here is to have clearly separated universe of routes:

- Authenticated routes: only accessible when the user is logged in.
- Public routes: only accessible when the user is NOT logged in.
- Mixed routes: always accessible, it changes based on if we have a session or not.

We can very easily handle this with **layout routes** and keep us organized with some folders.

### 2. Exposing the session to our routes

You have two options here, use the `getSessionFn` server function that we created earlier or use the root route to put the session in the router context.

I like the second option better as it is cleaner and you don't have to go calling `getSessionFn`, you just have the session in the context.

So, in order to do that you just need to return the `session` in the `beforeLoad` of the root route:

```jsx
// src/__root.tsx
export const Route = createRootRouteWithContext<MyRouterContext>()({
	//...other configs
	beforeLoad: async () => {
		const session = await getSessionFn();
		return { session };
	},
});

```

Now you can access `context.session` in any route `beforeLoad`

### 3. Folder structure

```json
src/routes/_authed/ - this is where all the authenticated routes lives
├── route.jsx - this is where the auth logic lives
├── index.jsx - this is "yourdomain.com/"
├── settings.jsx - this is "yourdomain.con/settings"
```

This is a visual representation of how this works:
```jsx
// yourdomain.com/
<Route>
  <Index /> -- this is what <Outlet /> renders
</Route>

```

And this is how the `route.jsx` file would look. Here you should also add things like footers, sidebars, headers, etc., that all routes should have
```jsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/sign_in" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />
}
```

For the public routes the concept is exactly the same, but inverted:

```typescript
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}

```

## Fin

Thats it! You have all the building blocks and initial architecture to build a very successfull *something*.

You can check a working example of this in my github: [tanstackstart-betterauth-example](https://github.com/taltrui/tanstackstart-betterauth-example)

Next, I will be writing about setting up a VPS with Coolify and deploying a Postgres DB and our app there, so stay tuned!

*If you have any suggestion, doubt, need help or just want to say hi, write me at hello@tomasaltrui.dev!*