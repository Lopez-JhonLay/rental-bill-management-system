# 🏠 Rental Bill Management System

A comprehensive full-stack web application designed for landlords to efficiently manage rental properties, tenants, and monthly billing with automated calculations for electricity, water, and rent charges.

**Live Demo:** [https://rental-bill-management-system.vercel.app/](https://rental-bill-management-system.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Workflows](#key-workflows)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Rental Bill Management System is a modern web application that streamlines the rental property management process. It enables landlords to:

- Manage multiple rental units and tenants
- Track electricity consumption with meter readings
- Calculate water charges based on occupancy
- Generate and confirm monthly bills automatically
- Maintain historical rate settings for accurate billing
- Download bills for tenant distribution

The system ensures billing accuracy by snapshotting utility rates at the time of bill generation and preventing edits to confirmed bills, maintaining a reliable audit trail.

---

## ✨ Features

### 🏢 Unit Management

- Create and manage multiple rental units
- Track unit occupancy status (vacant/occupied)
- Set monthly rent per unit
- View unit details with tenant information and billing history

### 👥 Tenant Management

- Assign tenants to units (one tenant per unit)
- Track person count for water billing calculations
- Update tenant information
- Remove tenants when units become vacant

### 💰 Bill Generation & Management

- **Automated Bill Creation**: Generate monthly bills with automatic calculations
- **Smart Meter Reading**: System validates that current readings exceed previous readings
- **Rate Snapshotting**: Bills capture electricity and water rates at generation time
- **Draft & Confirm Workflow**:
  - Bills start as DRAFT (editable)
  - Confirm to lock bills permanently
  - Rate change warnings before confirmation
- **Bill Recomputation**: Update draft bills with latest rates if needed
- **Billing Components**:
  - Electricity charges (based on kWh consumption)
  - Water charges (based on person count)
  - Monthly rent
  - Total amount calculation

### ⚙️ Rate Settings

- Configure electricity rates (per kWh)
- Configure water rates (per person)
- Historical rate tracking with effective dates
- Automatic rate selection based on billing month
- View rate history and active rates

### 📊 Dashboard & Analytics

- Overview of total units (occupied vs vacant)
- Pending bills count
- Confirmed bills count
- Total collectibles from pending bills
- Recent bills list
- Quick action shortcuts

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- Protected API routes
- User-specific data isolation

### 📄 Bill Export

- Download bills as images for sharing with tenants
- Professional bill layout with all charge breakdowns

---

## 🛠️ Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI with Scalar UI
- **Security**: bcrypt for password hashing, cookie-parser

### Frontend

- **Framework**: [React 19](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Export**: html2canvas, html-to-image

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest (backend), Supertest (E2E)
- **Deployment**: Vercel (frontend), Railway/Render (backend options)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │    Units     │  │   Settings   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tenants    │  │    Bills     │  │     Auth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API (JWT)
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │ Units Module │  │Settings Module│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Tenants Module│  │ Bills Module │  │Prisma Service│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                      Prisma ORM
                            │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Units   │  │ Tenants  │  │  Bills   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                               │
│  │RateSettings│                                              │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### User

- `id` (UUID, Primary Key)
- `full_name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (DateTime)

### Unit

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User)
- `unit_name` (String)
- `monthly_rent` (Decimal)
- `created_at` (DateTime)

### Tenant

- `id` (UUID, Primary Key)
- `unit_id` (UUID, Foreign Key → Unit, Unique)
- `tenant_name` (String)
- `person_count` (Integer)
- `created_at` (DateTime)

### RateSetting

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → User)
- `electricity_rate` (Decimal)
- `water_rate` (Decimal)
- `effective_from` (Date)
- `created_at` (DateTime)
- **Unique Constraint**: (user_id, effective_from)

### Bill

- `id` (UUID, Primary Key)
- `unit_id` (UUID, Foreign Key → Unit)
- `tenant_id` (UUID, Foreign Key → Tenant)
- `billing_month` (String, e.g., "2026-04")
- `previous_kwh` (Decimal)
- `current_kwh` (Decimal)
- `electricity_rate` (Decimal, snapshot)
- `water_rate` (Decimal, snapshot)
- `electricity_charge` (Decimal, computed)
- `water_charge` (Decimal, computed)
- `rent_charge` (Decimal, computed)
- `total_amount` (Decimal, computed)
- `status` (Enum: DRAFT | CONFIRMED)
- `created_at` (DateTime)
- `confirmed_at` (DateTime, nullable)
- **Unique Constraint**: (unit_id, billing_month)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/rental_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

6. **Start the development server**

   ```bash
   npm run start:dev
   ```

   The backend API will be available at `http://localhost:3000`

   API documentation available at `http://localhost:3000/reference`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Building for Production

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

The API follows RESTful conventions and is fully documented with Swagger/OpenAPI.

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require JWT authentication via HTTP-only cookies or Bearer token.

### Main Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Units

- `GET /api/units` - Get all units
- `POST /api/units` - Create new unit
- `GET /api/units/:id` - Get unit details
- `PATCH /api/units/:id` - Update unit
- `DELETE /api/units/:id` - Delete unit

#### Tenants

- `GET /api/tenants` - Get all tenants
- `POST /api/tenants` - Create new tenant
- `GET /api/tenants/:id` - Get tenant details
- `PATCH /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

#### Bills

- `GET /api/bills` - Get all bills (optional query: ?billingMonth=2026-04)
- `POST /api/bills` - Generate new bill
- `GET /api/bills/:id` - Get bill details
- `PATCH /api/bills/:id` - Update draft bill
- `POST /api/bills/:id/confirm` - Confirm bill (lock permanently)
- `POST /api/bills/:id/recompute` - Recompute bill with latest rates

#### Rate Settings

- `GET /api/settings/rates` - Get all rate settings
- `POST /api/settings/rates` - Create new rate setting
- `GET /api/settings/rates/active?billingMonth=2026-04` - Get active rate for month

### Interactive API Documentation

Visit `http://localhost:3000/reference` when the backend is running to explore the full API documentation with Scalar UI.

---

## 📁 Project Structure

```
rental-bill-management-system/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── decorators/    # Custom decorators (current user)
│   │   │   ├── dto/           # Data transfer objects
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt.auth.guard.ts
│   │   ├── bills/             # Bills management module
│   │   │   ├── dto/
│   │   │   ├── bills.controller.ts
│   │   │   ├── bills.service.ts
│   │   │   └── bills.module.ts
│   │   ├── tenants/           # Tenants management module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── tenants.controller.ts
│   │   │   ├── tenants.service.ts
│   │   │   └── tenants.module.ts
│   │   ├── units/             # Units management module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── units.controller.ts
│   │   │   ├── units.service.ts
│   │   │   └── units.module.ts
│   │   ├── settings/          # Rate settings module
│   │   │   ├── dto/
│   │   │   ├── settings.controller.ts
│   │   │   ├── settings.service.ts
│   │   │   └── settings.module.ts
│   │   ├── prisma/            # Prisma module
│   │   │   └── prisma.module.ts
│   │   ├── types/             # Shared types
│   │   ├── app.module.ts      # Root module
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── prisma.service.ts
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── test/                  # E2E tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API service layer
│   │   │   ├── axios.ts       # Axios configuration
│   │   │   ├── auth.service.ts
│   │   │   ├── bills.service.ts
│   │   │   ├── tenants.service.ts
│   │   │   ├── units.service.ts
│   │   │   └── rates.service.ts
│   │   ├── components/        # React components
│   │   │   ├── bill/          # Bill-related components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── settings/      # Settings components
│   │   │   └── shared/        # Shared/common components
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useBillActions.ts
│   │   │   ├── useUnitActions.ts
│   │   │   └── useTenantActions.ts
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── bills/         # Bill pages
│   │   │   ├── settings/      # Settings pages
│   │   │   ├── units/         # Unit pages
│   │   │   └── Dashboard.tsx
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Root component with routing
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🔄 Key Workflows

### 1. Bill Generation Workflow

```
1. Landlord navigates to a unit with an active tenant
2. Clicks "Generate Bill" for a specific month
3. System validates:
   ✓ No existing bill for that month
   ✓ Current meter reading > previous reading
   ✓ Active rate settings exist
4. System automatically:
   ✓ Fetches previous meter reading from last confirmed bill
   ✓ Retrieves active electricity and water rates
   ✓ Calculates electricity charge: (current_kwh - previous_kwh) × rate
   ✓ Calculates water charge: person_count × water_rate
   ✓ Adds monthly rent
   ✓ Computes total amount
5. Bill created as DRAFT status
6. Landlord reviews and can:
   - Edit meter readings (recalculates charges)
   - Recompute with latest rates if rates changed
   - Confirm bill (locks it permanently)
```

### 2. Rate Change Handling

```
1. Landlord adds new rate setting with effective date
2. When generating bills:
   - System selects rate where effective_from ≤ billing_month
   - Rate is "snapshotted" into the bill record
3. If rate changes after bill generation but before confirmation:
   - System warns landlord during confirmation
   - Landlord can choose to:
     a) Recompute bill with new rate
     b) Confirm with original rate (force confirm)
4. Once confirmed, bill rates are immutable
```

### 3. Tenant Assignment Workflow

```
1. Landlord creates a unit
2. Unit shows as "Vacant"
3. Landlord assigns tenant:
   - Tenant name
   - Person count (for water billing)
4. Unit status changes to "Occupied"
5. Bills can now be generated for this unit
6. When tenant moves out:
   - Landlord removes tenant
   - Unit returns to "Vacant" status
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable       | Description                  | Example                                    |
| -------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`   | Secret key for JWT signing   | `your-secret-key-here`                     |
| `PORT`         | Server port                  | `3000`                                     |
| `NODE_ENV`     | Environment mode             | `development` or `production`              |
| `FRONTEND_URL` | Frontend URL for CORS        | `http://localhost:5173`                    |

### Frontend (.env)

| Variable       | Description          | Example                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
# Run tests (when configured)
npm run test
```

---

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching with DaisyUI
- **Smooth Animations**: Page transitions with Framer Motion
- **Loading States**: Skeleton loaders and spinners for better UX
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: Success/error feedback for user actions
- **Accessible**: Semantic HTML and ARIA labels

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Configuration**: Restricted to allowed origins
- **Input Validation**: class-validator on all DTOs
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **User Data Isolation**: All queries filtered by user_id

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch
4. Run Prisma migrations: `npx prisma migrate deploy`

### Frontend Deployment (Vercel)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the UNLICENSED License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ for landlords who want to streamline their rental management process.

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [DaisyUI](https://daisyui.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Happy Renting! 🏠**
