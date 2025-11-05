import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdAdminPanelSettings, MdVisibility, MdVisibilityOff, MdSecurity } from 'react-icons/md'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

const AdminSignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const submit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }
        const response = await axios.get(`http://localhost:5000/users/getUserByEmail/${email}`)
        if (response.data.exist) {
            if (response.data.user.password !== password) {
                toast.error('Incorrect password')
                return
            }
            if (response.data.user.admin !== 1) {
                toast.error('Not an admin account')
                return
            }
            localStorage.setItem('user', JSON.stringify(response.data.user))
            toast.success('Signed in successfully')
            setTimeout(() => {
                location.reload()
            }, 1500);
        } else {
            console.log(response.data)
            toast.error('User does not exist')
        }
    }
    return (
        <div className="min-h-[80vh] grid place-items-center">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-16 w-16 rounded-full bg-linear-to-br from-orange-700 to-orange-600 grid place-items-center text-white text-2xl shadow-lg mb-4 ring-4 ring-orange-100">
                            <MdAdminPanelSettings />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            <MdSecurity className="text-orange-600" />
                            Authorized access only
                        </p>
                    </div>
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdEmail className="text-orange-600" />
                                Admin Email
                            </label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="admin@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdLock className="text-orange-600" />
                                Password
                            </label>
                            <div className="relative">
                                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                                </button>
                            </div>
                        </div>
                        <button onClick={submit} className="w-full bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-800 hover:to-orange-700 text-white rounded-xl px-4 py-3.5 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">Sign In as Admin</button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link to="/admin/signup" className="text-sm text-gray-600 hover:text-orange-600 font-medium">
                            Register as admin? <span className="text-orange-700 font-semibold">Sign up</span>
                        </Link>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}
export default AdminSignIn
