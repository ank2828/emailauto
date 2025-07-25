# EmailAuto - Modern Summary Dashboard

A full-stack web application built with Next.js 14, featuring a clean dashboard for managing and viewing content summaries. Designed for integration with external automation workflows (n8n) via secure webhooks.

## 🚀 Features

- **Modern Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui with Framer Motion animations
- **Authentication**: NextAuth.js with email provider
- **Real-time Updates**: SWR for dynamic data fetching
- **Webhook Integration**: Secure API endpoint for external workflows
- **Responsive Design**: Mobile-first responsive interface
- **Clean Architecture**: Modular service layer with TypeScript

## 📋 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Data Fetching**: SWR
- **Code Quality**: ESLint, Prettier
- **Deployment**: Vercel-ready

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Email provider (for authentication)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/emailauto"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Webhook Security
WEBHOOK_SECRET="your-webhook-secret-here"

# Email Provider (for authentication)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📡 API Endpoints

### GET `/api/summaries`

Fetch summaries with optional filtering:

```bash
curl "http://localhost:3000/api/summaries?search=example&startDate=2024-01-01"
```

**Query Parameters:**
- `search`: Search in title, content, or URL
- `startDate`: Filter by creation date (ISO string)
- `endDate`: Filter by creation date (ISO string)

### POST `/api/summaries`

Create a new summary:

```bash
curl -X POST http://localhost:3000/api/summaries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Summary",
    "url": "https://example.com",
    "summaryText": "This is a summary of the content..."
  }'
```

### POST `/api/webhook`

Webhook endpoint for external integrations (n8n, Zapier, etc.):

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Automated Summary",
    "url": "https://example.com",
    "summaryText": "AI-generated summary content...",
    "secret": "your-webhook-secret-here"
  }'
```

**Security**: Requires `WEBHOOK_SECRET` in payload for authentication.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js configuration
│   │   ├── summaries/     # Summary CRUD operations
│   │   └── webhook/       # External webhook endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── SummaryCard.tsx   # Summary display component
│   └── SummaryFilters.tsx # Filter controls
├── lib/                  # Utilities
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Helper functions
├── services/            # Business logic
│   └── summaryService.ts # Summary operations
└── types/               # TypeScript definitions
    └── index.ts         # Shared types
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `WEBHOOK_SECRET`
- Email provider credentials

## 🔌 n8n Integration Example

Create an n8n workflow that sends HTTP POST requests to your webhook:

```json
{
  "method": "POST",
  "url": "https://your-app.vercel.app/api/webhook",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "title": "{{ $json.title }}",
    "url": "{{ $json.url }}",
    "summaryText": "{{ $json.summary }}",
    "secret": "{{ $env.WEBHOOK_SECRET }}"
  }
}
```

## 🛡️ Security Features

- **Webhook Authentication**: Secret-based verification
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Type Safety**: Full TypeScript coverage
- **Environment Isolation**: Secure environment variable handling

## 🎨 Customization

### Adding New Summary Fields

1. Update the Prisma schema in `prisma/schema.prisma`
2. Update TypeScript types in `src/types/index.ts`
3. Modify the service layer in `src/services/summaryService.ts`
4. Update UI components as needed

### Styling

- Customize colors in `src/app/globals.css`
- Modify component styles using Tailwind CSS classes
- Add new shadcn/ui components with `npx shadcn-ui@latest add [component]`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies. 