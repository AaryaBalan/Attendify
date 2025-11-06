import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdPerson, MdEmail, MdBusiness, MdEdit, MdSave, MdCancel, MdAdminPanelSettings, MdVisibility, MdVisibilityOff, MdLock } from 'react-icons/md'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const Profile = () => {
    const [user, setUser] = useState({
        id: 0,
        name: '',
        email: '',
        company: '',
        admin: 0,
        created_at: ''
    })
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Profile - Attendify'
        const userData = localStorage.getItem('user')
        if (!userData) {
            navigate('/signin')
            return
        }
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setFormData({
            name: parsedUser.name,
            email: parsedUser.email,
            company: parsedUser.company,
            password: ''
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
            company: user.company,
            password: ''
        })
        setEditMode(false)
        setShowPassword(false)
    }

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.company) {
            toast.error('Please fill all required fields')
            return
        }

        try {
            const updateData = {
                id: user.id,
                name: formData.name,
                email: formData.email,
                company: formData.company
            }

            if (formData.password) {
                updateData.password = formData.password
            }

            const response = await axios.put('http://localhost:5000/users/update', updateData)

            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
                company: formData.company
            }

            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))

            toast.success('Profile updated successfully')
            setEditMode(false)
            setFormData(prev => ({ ...prev, password: '' }))
            setShowPassword(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-[80vh] flex items-center py-4 sm:py-8">
            <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
                <div className="bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-linear-to-r from-orange-600 to-orange-500 px-4 sm:px-8 py-4 sm:py-6">
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-lg grid place-items-center text-white text-2xl sm:text-3xl shadow-lg ring-4 ring-white/30">
                                {user.admin === 1 ? <MdAdminPanelSettings /> : <MdPerson />}
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-orange-100 flex items-center justify-center sm:justify-start gap-2 mt-1 text-sm sm:text-base">
                                    {user.admin === 1 ? (
                                        <>
                                            <MdAdminPanelSettings className="text-lg" />
                                            Administrator
                                        </>
                                    ) : (
                                        <>
                                            <MdPerson className="text-lg" />
                                            Employee
                                        </>
                                    )}
                                </p>
                            </div>
                            {!editMode && (
                                <button
                                    onClick={handleEdit}
                                    className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-md text-sm sm:text-base"
                                >
                                    <MdEdit className="text-lg" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 sm:p-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        <MdPerson className="text-orange-600 text-base sm:text-lg" />
                                        Full Name
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-200">
                                            {user.name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        <MdEmail className="text-orange-600 text-base sm:text-lg" />
                                        Email Address
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-200 break-all">
                                            {user.email}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        <MdBusiness className="text-orange-600 text-base sm:text-lg" />
                                        Company
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-200">
                                            {user.company}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        <MdAdminPanelSettings className="text-orange-600 text-base sm:text-lg" />
                                        Account Type
                                    </label>
                                    <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-200">
                                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${user.admin === 1
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.admin === 1 ? 'Administrator' : 'Employee'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {editMode && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        <MdLock className="text-orange-600 text-base sm:text-lg" />
                                        New Password (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <MdVisibilityOff className="text-lg sm:text-xl" /> : <MdVisibility className="text-lg sm:text-xl" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">Leave this field empty if you don't want to change your password</p>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-4 sm:pt-6">
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                        Member Since
                                    </label>
                                    <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-200">
                                        {formatDate(user.created_at)}
                                    </div>
                                </div>
                            </div>

                            {editMode && (
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    >
                                        <MdSave className="text-lg sm:text-xl" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all"
                                    >
                                        <MdCancel className="text-lg sm:text-xl" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}

export default Profile
