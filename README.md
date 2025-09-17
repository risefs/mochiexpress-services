# MochiExpress Services API

Backend services for MochiExpress built with NestJS and Supabase.

## Features

- ✅ **NestJS Framework** - Latest stable version with TypeScript
- ✅ **Supabase Integration** - Using `nestjs-supabase-js` for seamless integration
- ✅ **Environment Configuration** - Secure environment variable management
- ✅ **Input Validation** - Global validation with `class-validator`
- ✅ **Error Handling** - Global exception filter with consistent responses
- ✅ **API Documentation** - Swagger/OpenAPI integration
- ✅ **TypeScript Strict Mode** - Enhanced type safety
- ✅ **ESLint Configuration** - Code quality and consistency
- ✅ **Unit & E2E Tests** - Comprehensive test coverage with Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mochiexpress-services
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Update `.env` with your Supabase credentials:
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
```

## Database Setup

Create a `users` table in your Supabase database:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Working with Custom Schemas

If you're using a custom schema (e.g., `web_app`) instead of the default `public` schema, you'll need to grant permissions to the `service_role`:

```sql
-- Grant permissions to service_role for custom schema access
GRANT USAGE ON SCHEMA web_app TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA web_app TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA web_app TO service_role;
```

**Important**: Run these permission commands whenever you create new tables in custom schemas to ensure your API can access them.

## Available Scripts

```bash
# Development
npm run start:dev        # Start in watch mode - here we are going to using staging enviroment(depends on yours .env)

npm run dev #here we are going to use .env (directly supabase remote environment)

npm run dev:local        #here we are going to using emulators enviroment (depends on yours .env.local)
npm run start:debug      # Start in debug mode

# Production
npm run build           # Build the application
npm run start          # Start in normal mode
npm run start:prod     # Start compiled application

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

## API Endpoints

### Health Check
- `GET /` - Service health check

### Users
- `GET /api/v1/users` - Get all users

## API Documentation

When running in development mode, visit:
- **Swagger UI**: http://localhost:3000/api/docs

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Environment (development/production) |
| `PORT` | No | Server port (default: 3000) |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE` | Yes | Your Supabase service_role key (for backend APIs) |

## Project Structure

```
src/
├── common/
│   └── filters/         # Global exception filters
├── config/              # Configuration and validation
├── supabase/           # Supabase module configuration
├── users/              # Users module
│   ├── dto/            # Data transfer objects
│   ├── entities/       # Entity definitions
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Error Handling

The application includes comprehensive error handling:

- **Global Exception Filter**: Consistent error responses
- **Validation Errors**: Input validation with detailed messages
- **Database Errors**: Graceful handling of connection issues
- **Environment Validation**: Startup validation for required variables

## Security

- Environment variables are properly managed
- Sensitive data is not exposed in logs or responses
- Input validation prevents malicious data
- CORS configuration for development/production

## Testing

The project includes:

- **Unit Tests**: For services and controllers
- **E2E Tests**: For endpoint integration
- **Test Coverage**: Available via `npm run test:cov`

## Development

1. Start the development server:
```bash
npm run start:dev
```

2. The API will be available at:
   - **API**: http://localhost:3000/api/v1
   - **Docs**: http://localhost:3000/api/docs

3. The application will automatically restart when files change.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the production server:
```bash
npm run start:prod
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure `.env` file exists with required variables
   - Check Supabase URL and key are correct

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database tables exist

3. **Permission Denied for Table (Error 42501)**
   - Make sure you're using the `service_role` key, not the `anon` key
   - If using custom schemas, grant permissions with the SQL commands in Database Setup
   - Verify the schema name in your queries matches your database structure

4. **Build Issues**
   - Clear `dist` folder and rebuild
   - Check TypeScript configuration
   - Verify all dependencies are installed

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Run linting and tests before committing
