import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AdminSignIn from './pages/AdminSignIn'
import AdminSignUp from './pages/AdminSignUp'
import Dashboard from './pages/Dashboard'

const App = () => {
  const isLoggedIn = localStorage.getItem('user')

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-orange-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {isLoggedIn ? (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/signin" element={<AdminSignIn />} />
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        )}
      </main>
    </div>
  )
}

export default App