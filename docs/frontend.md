# Attendify Frontend

A modern, responsive attendance management system built with React, TypeScript, and Vite. Features beautiful UI with orange-themed design, authentication flows for users and admins, and mobile-first responsive design.

## 🚀 Features

-  **User Authentication**: Sign in and sign up pages for regular users
-  **Admin Authentication**: Separate sign in and sign up pages for administrators
-  **Responsive Design**: Fully responsive navbar with mobile hamburger menu
-  **Material Icons**: Professional UI using React Icons (Material Design)
-  **Toast Notifications**: Real-time feedback using React Toastify
-  **Modern Styling**: Tailwind CSS with custom orange theme
-  **Type Safety**: Built with TypeScript for robust code
-  **Fast Development**: Powered by Vite with Hot Module Replacement (HMR)

## 🎨 Design Highlights

-  **Orange Color Palette**: Primary orange family colors for a warm, energetic look
-  **Professional UI**: Material Design-inspired components with smooth animations
-  **Mobile-First**: Responsive design that works on all screen sizes
-  **Password Toggle**: Show/hide password functionality on all auth forms
-  **Gradient Buttons**: Eye-catching gradient backgrounds on CTAs
-  **Form Validation**: Client-side validation with toast notifications

## 📋 Prerequisites

Before running the frontend, ensure you have:

-  **Node.js**: Version 20.x or higher
-  **npm**: Version 10.x or higher (comes with Node.js)

## 🛠️ Installation

1. **Clone the repository** (if not already done):

```bash
git clone https://github.com/AaryaBalan/Attendify.git
cd Attendify/frontend
```

2. **Install dependencies**:

```bash
npm install
```

This will install all required packages including:

-  React 19.x
-  React Router DOM (routing)
-  React Toastify (notifications)
-  React Icons (Material Design icons)
-  Tailwind CSS (styling)
-  TypeScript
-  Vite (build tool)

## 🚀 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.tsx       # Responsive navigation bar
│   ├── pages/               # Page components
│   │   ├── SignIn.tsx       # User sign in page
│   │   ├── SignUp.tsx       # User sign up page
│   │   ├── AdminSignIn.tsx  # Admin sign in page
│   │   └── AdminSignUp.tsx  # Admin sign up page
│   ├── assets/              # Static assets (images, etc.)
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Public static files
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## 🔑 Available Routes

-  `/` - Redirects to sign in page
-  `/signin` - User sign in
-  `/signup` - User sign up
-  `/admin/signin` - Admin sign in
-  `/admin/signup` - Admin sign up

## 🎯 Key Technologies

-  **React 19**: Latest React with modern features
-  **TypeScript**: Type-safe development
-  **Vite**: Lightning-fast build tool and dev server
-  **Tailwind CSS**: Utility-first CSS framework
-  **React Router DOM**: Client-side routing
-  **React Toastify**: Toast notifications
-  **React Icons**: Material Design icon library

## 📱 Responsive Breakpoints

-  **Mobile**: < 1024px (Hamburger menu)
-  **Desktop**: ≥ 1024px (Full horizontal navbar)
-  **Small devices**: Optimized padding and spacing
-  **Large screens**: Maximum width container (7xl)

## 🎨 Theme Colors

Primary orange palette:

-  Orange 500: `#fb8c00`
-  Orange 600: `#f57c00`
-  Orange 700: `#ef6c00`

## 🔧 Configuration

### Tailwind CSS

Custom configuration in `tailwind.config.js` with orange as primary color.

### TypeScript

Strict type checking enabled in `tsconfig.json` for better code quality.

### Vite

Fast HMR and optimized builds configured in `vite.config.ts`.

## 🐛 Troubleshooting

### Port already in use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Dependencies issues

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors

Ensure TypeScript compilation passes:

```bash
npx tsc --noEmit
```

## 📝 Development Notes

-  Uses React Compiler for optimized performance
-  ESLint configured for React and TypeScript
-  No comments in code as per project requirements
-  Clean, maintainable component structure
-  Toast notifications for user feedback on all actions

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test the build: `npm run build`
5. Submit a pull request

## 📄 License

This project is part of the Attendify attendance management system.

---

Built with ❤️ using React + TypeScript + Vite
