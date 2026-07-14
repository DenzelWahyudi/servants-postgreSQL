# Servants Native

Servants is a mobile application built with React Native and Expo, designed to streamline scheduling, role assignments, and communication for volunteers and service workers (e.g., church services, event organizations, or volunteer teams).

## 🚀 Features

- **Authentication**: Secure login, registration, and password recovery.
- **Home Dashboard**: Get a quick overview of upcoming services, pending sign-ups, and open recruitment roles.
- **Schedule Management**: Keep track of your assigned roles and upcoming service schedules.
- **Openings**: Browse through unfilled roles and volunteer for specific tasks where help is needed.
- **Chats**: In-app messaging functionality to stay in touch with other team members.
- **Role Assignments**: Track the status (pending, confirmed, etc.) of your service assignments.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons**: `@expo/vector-icons` & `lucide-react-native`
- **Utilities**: `date-fns` for robust date formatting and manipulation

## 📂 Project Structure

The project uses Expo Router's file-based routing mechanism. Key directories include:

```text
src/
├── app/                  # Application routes (Expo Router)
│   ├── (tabs)/           # Main tab navigation (Home, Schedule, Openings, Chats)
│   ├── login.tsx         # Login screen
│   ├── register.tsx      # Registration screen
│   ├── forgot-password.tsx
│   └── _layout.tsx       # Root layout & Authentication provider
├── components/           # Reusable UI components
├── context/              # React Context providers (e.g., AuthProvider)
├── hooks/                # Custom React hooks (e.g., useAuth)
├── utils/                # Utility functions and helpers
└── images/               # Local image assets
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo Go app on your physical device, or an iOS Simulator / Android Emulator installed.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd servants-native
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Ensure you have a `.env` file in the root directory based on `.env.example` that includes your backend `API_URL` and any other required secrets.

4. **Start the development server**:
   ```bash
   npm start
   ```
   Or explicitly using Expo:
   ```bash
   npx expo start
   ```

5. **Run the app**:
   - Press `a` to open in Android Emulator
   - Press `i` to open in iOS Simulator
   - Scan the QR code with the **Expo Go** app on your physical device.

## 📜 Scripts

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the app in development mode on Android.
- `npm run ios` - Starts the app in development mode on iOS.
- `npm run web` - Starts the app in development mode for the web.
- `npm run lint` - Runs ESLint to check for code issues.
