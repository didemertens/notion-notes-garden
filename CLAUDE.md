# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run eval:dev` - Run AI evaluation development server with watch mode

## Architecture Overview

This is a Next.js 15 application using the App Router with AI SDK integration for working with language models. The project focuses on AI evaluation and testing capabilities.

**Key Technologies:**
- Next.js 15 with App Router and React 19
- TypeScript with strict configuration
- Vercel AI SDK (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/react`)
- Evalite framework for AI model evaluation and testing
- Tailwind CSS v4 with custom theming and dark mode support
- Anthropic Claude models (claude-3-5-haiku-latest)

**Project Structure:**
- `app/` - Next.js App Router pages and components
- `*.eval.ts` files - AI evaluation test files using Evalite framework
- Custom fonts: Geist Sans and Geist Mono via `next/font/google`

## AI Evaluation System

The project uses Evalite for systematic AI model evaluation:
- Evaluation files have `.eval.ts` extension
- Use `traceAISDKModel()` wrapper for AI SDK model tracing
- Supports various scorers like `Factuality` and `Levenshtein`
- Environment variables loaded via dotenv for API keys

## Development Practices

**TypeScript:**
- Prefer `type` over `interface` (only use interfaces when extending is needed)
- Avoid enums; use const maps instead
- Use `satisfies` operator for type validation

**React/Next.js:**
- Prefer React Server Components where possible
- Minimize 'use client' directives
- Use async versions of Next.js runtime APIs:
  ```typescript
  const cookieStore = await cookies()
  const headersList = await headers()
  const params = await props.params
  ```

**Naming Conventions:**
- Use descriptive names with auxiliary verbs (isLoading, hasError)
- Prefix event handlers with "handle" (handleClick, handleSubmit)
- Favor named exports for components

**Styling:**
- Uses Tailwind CSS v4 with `@tailwindcss/postcss`
- Custom CSS variables for theming in `app/globals.css`
- Automatic dark mode support via `prefers-color-scheme`