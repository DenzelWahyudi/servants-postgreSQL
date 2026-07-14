# Servants Web & Mobile App

---

## Overview

Servants is a comprehensive management system designed for organizations (like churches) to coordinate servants, services, and roles. It provides a streamlined interface for both users and administrators to manage schedules, track service openings, handle role assignments, and communicate in real time across web and mobile platforms.

## Tech Stack

### Frontend (Web)
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Routing:** React Router 7
- **Icons:** Lucide React & Heroicons
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL (using `pg` driver)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Storage:** Multer & Cloudinary
- **Real-time:** WebSocket (`ws`)
- **Logging:** Pino & pino-http
- **Task Scheduling:** node-cron
- **Messaging:** Twilio

### Native (Mobile)
- **Framework:** React Native with Expo (SDK 57)
- **Routing:** Expo Router v57
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Animations/Gestures:** React Native Reanimated & React Native Gesture Handler
- **Storage:** AsyncStorage & Secure Store
- **Push Notifications:** Expo Notifications

## Features

- **Multi-Level Authentication:** Separate registration and login flows for users and administrators, with role-based protected routes.
- **Password Recovery:** OTP-based "Forgot Password" functionality via Twilio.
- **Dashboard:** At-a-glance view of upcoming services, active roles, and organizational statistics.
- **Service Management:** Admins can create, edit, and delete services, including specific opening slots.
- **Role System:** Flexible role management allowing admins to assign or relieve specific responsibilities to servants.
- **Openings:** Servants can view and sign up for open service slots.
- **Schedule Tracking:** Comprehensive view of service schedules and volunteer assignments.
- **Real-time Chat:** Live messaging powered by WebSockets, featuring group chats per service, image attachments, read receipts, and swipe-to-reply gestures on mobile.
- **Admin Panel:** Dedicated admin views for managing users, admissions, roles, and services.
- **Cross-Platform:** Available as a responsive Web App and a Native Mobile App (iOS/Android).

## Project Structure

```text
servants-postgresql/
├── client/                       # React Web Frontend
│   ├── src/
│   │   ├── api.ts                # API client configuration
│   │   ├── App.tsx               # Main routing component
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Auth and global state
│   │   ├── hooks/                # Custom React hooks (e.g., WebSocket)
│   │   └── pages/                # Full-page components
│   └── vite.config.ts
├── server/                       # Express Backend
│   ├── src/
│   │   ├── api/                  # API router and feature modules (CSR pattern)
│   │   ├── core/                 # Server config (db, websocket, cloudinary, etc.)
│   │   ├── models/               # PostgreSQL schema (schema.sql)
│   │   └── server.js             # Entry point
│   └── package.json
└── native/                       # Expo Mobile App
    ├── src/
    │   ├── app/                  # Expo Router pages (file-based routing)
    │   ├── context/              # Auth context
    │   └── hooks/                # Custom hooks (e.g., chat socket)
    ├── app.json                  # Expo configuration
    └── eas.json                  # EAS Build configuration
```

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment (`development` \| `production`) |
| `PORT` | Server port (default: `5000`) |
| `DB_CONNECTION` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CORS_ORIGIN` | Allowed origin for frontend requests |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS |
| `TWILIO_AUTH_TOKEN` | Twilio authentication token |
| `TWILIO_VERIFY_SERVICE_SID` | Twilio verify service SID |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for file storage |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | The base URL for the backend API |

### Native (`native/.env`)
| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | The base URL for the backend API (e.g., `http://10.0.2.2:5000/api` for Android emulator) |

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- A running PostgreSQL instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd servants-postgresql
   ```

2. **Database Setup**
   Ensure your PostgreSQL instance is running and create a database for the project. The schema will be automatically migrated on server start via `schema.sql`.

3. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in the values in .env, specifically DB_CONNECTION
   ```

4. **Web Client Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Native App Setup**
   ```bash
   cd ../native
   npm install
   ```

### Running the Application Locally

You will need multiple terminal windows to run all parts of the stack.

1. **Start the Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Web Client**
   ```bash
   cd client
   npm run dev
   ```
   The client will be available at `http://localhost:5173`.

3. **Start the Native App**
   ```bash
   cd native
   npx expo start
   ```
   Use the Expo Go app on your physical device to scan the QR code, or press `a` for Android emulator / `i` for iOS simulator.

## API & Database

The backend utilizes **PostgreSQL** with the following core entities:
- `users`, `roles`, `user_roles`
- `services`, `openings`, `assignments`
- `conversations`, `conversation_participants`, `messages`

The REST API is exposed under `/api` for resource management (users, services, roles, assignments, files). Real-time messaging uses WebSockets on the same server instance.

## Deployment

### Frontend (Web)
Configured for deployment on **Vercel** (`vercel.json` included for routing rewrites). Set `VITE_API_URL` in the environment variables.

### Backend
Can be deployed to any Node.js hosting provider (e.g., Render, Railway). Set all required environment variables and ensure the PostgreSQL connection string is correct.

### Native App
Configured for **EAS Build** (`eas.json` included). You can build APKs or iOS builds using Expo Application Services.
