# Environment Configuration

This project supports different API base URLs for development and production environments through environment variables.

## Setup Instructions

### 1. Development Environment

For local development, copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file will contain:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
```

### 2. Production Environment

For production deployment on Vercel, set the following environment variables in your Vercel dashboard:

```env
REACT_APP_API_BASE_URL=https://astro-backend-xi.vercel.app/api/v1
REACT_APP_ENVIRONMENT=production
```

## Environment Variable Priority

The application uses the following priority order for determining the API base URL:

1. **REACT_APP_API_BASE_URL** (from environment variables)
2. **NODE_ENV-based fallback**:
   - Development: `http://localhost:8000/api/v1`
   - Production: `https://astro-backend-xi.vercel.app/api/v1`

## Available Environment Variables

| Variable | Description | Default (Dev) | Default (Prod) |
|----------|-------------|---------------|----------------|
| `REACT_APP_API_BASE_URL` | API base URL for all backend calls | `http://localhost:8000/api/v1` | `https://astro-backend-xi.vercel.app/api/v1` |
| `REACT_APP_ENVIRONMENT` | Environment identifier for logging | `development` | `production` |

## Vercel Deployment

When deploying to Vercel, add these environment variables in your project settings:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:

```
REACT_APP_API_BASE_URL = https://astro-backend-xi.vercel.app/api/v1
REACT_APP_ENVIRONMENT = production
```

## Development Tips

- Environment variables are logged to console in development mode
- Check browser console for API URL confirmation: `🔗 API Base URL: ...`
- All `.env*` files except `.env.example` are git-ignored for security

## File Structure

```
├── .env                    # Local development (git-ignored)
├── .env.example           # Template file (committed)
├── .env.production        # Production defaults (committed)
├── .env.local             # Local overrides (git-ignored)
└── src/config/api.js      # API configuration logic
```
