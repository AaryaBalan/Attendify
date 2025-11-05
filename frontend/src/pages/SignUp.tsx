import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdPerson, MdPersonAdd, MdVisibility, MdVisibilityOff, MdBusiness } from 'react-icons/md'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        password: '',
        admin: 0
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const submitNewUser = async (e) => {
        e.preventDefault()
        console.log(formData);
        if (!formData.name || !formData.email || !formData.company || !formData.password) {
            toast.error('Please fill all fields')
            console.log('Please fill all fields');
            return
        }
        await axios.post('http://localhost:5000/users/create', formData)
        toast.success('Account created successfully, redirecting to sign in...')
        setTimeout(() => {
            location.href = '/signin'
        }, 1500);
    }

    return (
        <div className="min-h-[80vh] grid place-items-center">
            <div className="w-full max-w-lg">
                <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-16 w-16 rounded-full bg-linear-to-br from-orange-600 to-orange-500 grid place-items-center text-white text-2xl shadow-lg mb-4">
                            <MdPersonAdd />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-2">Join Attendify today</p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdPerson className="text-orange-600" />
                                Full Name
                            </label>
                            <input id="name" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="Alex Doe" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdEmail className="text-orange-600" />
                                Email Address
                            </label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdBusiness className="text-orange-600" />
                                Company Name
                            </label>
                            <input id="company" name="company" value={formData.company} onChange={handleChange} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="Acme Corporation" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MdLock className="text-orange-600" />
                                Password
                            </label>
                            <div className="relative">
                                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                                </button>
                            </div>
                        </div>
                        <button onClick={submitNewUser} className="w-full bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl px-4 py-3.5 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">Create Account</button>
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/signin" className="text-sm text-gray-600 hover:text-orange-600 font-medium">
                            Already have an account? <span className="text-orange-700 font-semibold">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}
export default SignUp
