# MyNexJob - Intelligent Job Matching Platform

MyNexJob is a modern job matching platform built with React, TypeScript, and Vite. It connects job seekers with their ideal career opportunities through intelligent matching algorithms and personalized recommendations.

## 🚀 Features

- **Intelligent Job Matching**: AI-powered job recommendations based on skills and preferences
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Real-time Updates**: Fast and responsive user experience
- **Role-based Access**: Separate interfaces for candidates and employers
- **Performance Optimized**: Built with modern web technologies for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Backend**: Spring Boot + MongoDB (separate repository)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MyNexJob
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

MyNexJob uses a custom design system built on Tailwind CSS with:
- **Brand Colors**: Professional blue gradient palette
- **Typography**: Inter font family for modern readability
- **Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Logo, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   ├── auth/           # Authentication components
│   └── jobs/           # Job-related components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔐 Authentication & Route Protection

The application implements comprehensive route protection:

### Protected Routes
- **ProtectedRoute**: Redirects unauthenticated users to login
- **PublicRoute**: Redirects authenticated users away from auth pages
- **Role-based access**: Different routes for candidates, employers, and admins

### Smart Redirects
- **Candidates** → `/recommended-jobs`
- **Employers** → `/employer/dashboard`
- **Admins** → `/admin/recruiters`

### Auth Pages Protection
Authenticated users cannot access:
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset page

Even typing these URLs directly will redirect authenticated users to their appropriate dashboard.

## 🔧 Configuration

The project uses Vite for fast development and building. Key configuration files:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
