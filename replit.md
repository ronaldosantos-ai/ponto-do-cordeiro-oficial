# Ponto do Cordeiro

A web application for Brazilian lamb producers to make smart selling decisions in 60 seconds.

## Overview

This is a React/Vite frontend application that uses Supabase as its backend for:
- User authentication
- Database storage (simulations history, alerts, subscriptions)
- Edge functions (payment webhook)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Backend**: Supabase (external service)
- **PWA**: vite-plugin-pwa for installable app

## Project Structure

```
src/
├── components/     # UI components
│   └── ui/        # shadcn/ui base components
├── hooks/         # Custom React hooks (useAuth, usePremium, etc.)
├── integrations/  # Supabase client and types
├── lib/           # Utility functions
├── pages/         # Route pages
│   └── admin/     # Admin dashboard pages
└── types/         # TypeScript type definitions
```

## Environment Variables

Required secrets (configured in Supabase):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Running the App

The app runs on port 5000 using `npm run dev`.

## Features

- Lamb sale simulation calculator (MVP and Premium modes)
- User authentication via Supabase Auth
- Simulation history storage
- Premium subscription management (via Ticto payment integration)
- Admin dashboard for managing users and subscriptions
- Alerts system for price notifications
- PWA support for mobile installation

## Supabase Tables

- `historico_simulacoes` - Simulation history
- `alertas` - User alerts
- `subscriptions` - Premium subscriptions
- `daily_queries` - Usage tracking
- `user_roles` - Admin role management
- `user_roles_audit` - Audit log for role changes

## Deployment

Configured for static deployment. Build output goes to `dist/` folder.
