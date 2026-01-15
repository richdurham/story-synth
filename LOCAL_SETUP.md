# Story Synth - Local Development Setup

This guide will help you run Story Synth locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install with `npm install -g pnpm`
- **MySQL** (v8 or higher) or **MariaDB** - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repo-url> story-synth
cd story-synth
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/story_synth"

# OAuth Configuration (from Manus)
VITE_APP_ID="your-app-id"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"
OAUTH_SERVER_URL="https://api.manus.im"
JWT_SECRET="your-jwt-secret-key"

# Owner Information
OWNER_OPEN_ID="your-open-id"
OWNER_NAME="Your Name"

# LLM API (from Manus)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-api-key"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
```

**Note:** You can obtain these values from the Manus project dashboard or contact your administrator.

## Step 3: Create the Database

```bash
# Login to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE story_synth;
EXIT;
```

## Step 4: Install Dependencies

```bash
pnpm install
```

## Step 5: Run Database Migrations

```bash
pnpm db:push
```

This will create all the necessary tables in your database.

## Step 6: Seed Sample Data (Optional)

To populate the database with sample game data:

```bash
node seed-db.mjs
```

This will add:
- 4 game roles (Regent, Treasury Minister, Military Commander, Chief Diplomat)
- 3 sample issues
- 4 game variables
- Initial game state

## Step 7: Start the Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

## Step 8: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Sign In to Play"
3. You'll be redirected to Manus OAuth for authentication
4. After login, you'll be redirected back to the game interface
5. Select a role and start playing!

## Development Workflow

### Running Tests

```bash
pnpm test
```

### Building for Production

```bash
pnpm build
```

### Formatting Code

```bash
pnpm format
```

### Type Checking

```bash
pnpm check
```

## Project Structure

```
story-synth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers/           # tRPC procedure definitions
│   ├── db.ts              # Database queries
│   ├── narrative.ts       # AI narrative generation
│   └── _core/             # Core framework files
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── seed-db.mjs            # Database seeding script
```

## Key Features

- **Role-Based Gameplay**: Play as different political roles (Regent, Treasury Minister, etc.)
- **AI-Powered Narratives**: LLM-generated story outcomes based on player decisions
- **Real-Time State Management**: Dynamic game state synchronized across players
- **Private Communication**: Send notes between players
- **Game Variables**: Track kingdom metrics (treasury, militarism, diplomacy, morale)

## Troubleshooting

### Database Connection Error

If you get a database connection error:
1. Verify MySQL is running: `mysql -u root -p`
2. Check your DATABASE_URL in `.env.local`
3. Ensure the database exists: `SHOW DATABASES;`

### OAuth Authentication Failed

If OAuth login fails:
1. Verify VITE_APP_ID is correct
2. Check VITE_OAUTH_PORTAL_URL is accessible
3. Ensure your redirect URI matches the OAuth configuration

### Missing Dependencies

If you get module not found errors:
1. Delete `node_modules` and `.pnpm-lock.yaml`
2. Run `pnpm install` again

### Port Already in Use

If port 3000 is already in use:
1. Change the port: `PORT=3001 pnpm dev`
2. Or kill the process using port 3000

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | MySQL connection string | `mysql://user:pass@localhost:3306/story_synth` |
| VITE_APP_ID | Manus OAuth app identifier | `abc123def456` |
| VITE_OAUTH_PORTAL_URL | Manus OAuth portal URL | `https://oauth.manus.im` |
| OAUTH_SERVER_URL | Manus OAuth server URL | `https://api.manus.im` |
| JWT_SECRET | Session token signing key | `your-secret-key` |
| BUILT_IN_FORGE_API_KEY | LLM API key | `sk-...` |

## Support

For issues or questions:
1. Check the logs in the terminal
2. Review the error messages in the browser console
3. Check the database for data integrity
4. Consult the Manus documentation

## Next Steps

After setting up locally:
1. Explore the game interface
2. Test role selection and gameplay
3. Try sending private notes between roles
4. Experiment with issue resolution and narrative generation
5. Customize game roles, issues, and variables in the database

Happy gaming! 🎮
