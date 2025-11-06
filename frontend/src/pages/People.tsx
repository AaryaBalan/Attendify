import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdPeople, MdPersonAdd, MdPersonRemove, MdCheck, MdClose, MdAdminPanelSettings, MdEmail, MdBusiness, MdSearch } from 'react-icons/md'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const People = () => {
    const [employees, setEmployees] = useState([])
    const [pendingEmployees, setPendingEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showPending, setShowPending] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'People - Attendify'
        const user = localStorage.getItem('user')
        if (!user) {
            navigate('/signin')
            return
        }
        const userData = JSON.parse(user)
        if (userData.admin !== 1) {
            toast.error('Access denied. Admin only.')
            navigate('/dashboard')
            return
        }
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        setLoading(true)
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const response = await axios.get(`http://localhost:5000/users/getEmployeesByCompany/${user.company}`)
            const allEmployees = response.data.employees || []

            const accepted = allEmployees.filter(emp => emp.status === 'accepted')
            const pending = allEmployees.filter(emp => emp.status === 'pending')

            setEmployees(accepted)
            setPendingEmployees(pending)
        } catch (error) {
            console.error('Error fetching employees:', error)
            toast.error('Failed to fetch employees')
        } finally {
            setLoading(false)
        }
    }

    const handleAccept = async (employeeId) => {
        try {
            await axios.put(`http://localhost:5000/users/updateStatus/${employeeId}`, { status: 'accepted' })
            toast.success('Employee accepted successfully')
            fetchEmployees()
        } catch (error) {
            console.error('Error accepting employee:', error)
            toast.error('Failed to accept employee')
        }
    }

    const handleRemove = async (employeeId, employeeName) => {
        if (window.confirm(`Are you sure you want to remove ${employeeName}?`)) {
            try {
                await axios.delete(`http://localhost:5000/users/delete/${employeeId}`)
                toast.success('Employee removed successfully')
                fetchEmployees()
            } catch (error) {
                console.error('Error removing employee:', error)
                toast.error('Failed to remove employee')
            }
        }
    }

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredPending = pendingEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-[80vh]">
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <MdPeople className="text-orange-600" />
                            Company People
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage employees in your organization</p>
                    </div>
                    {pendingEmployees.length > 0 && (
                        <button
                            onClick={() => setShowPending(!showPending)}
                            className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition-all"
                        >
                            <MdPersonAdd className="text-lg" />
                            {pendingEmployees.length} Pending Request{pendingEmployees.length !== 1 ? 's' : ''}
                        </button>
                    )}
                </div>

                <div className="relative mb-6">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-sm sm:text-base"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <>
                    {showPending && pendingEmployees.length > 0 && (
                        <div className="mb-8 bg-orange-50 border-2 border-orange-200 rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-orange-100 px-4 sm:px-6 py-4 border-b border-orange-200 flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold text-orange-900 flex items-center gap-2">
                                    <MdPersonAdd className="text-xl sm:text-2xl" />
                                    Pending Requests
                                </h2>
                                <button
                                    onClick={() => setShowPending(false)}
                                    className="text-orange-700 hover:text-orange-900 transition"
                                >
                                    <MdClose className="text-2xl" />
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 space-y-4">
                                {filteredPending.map((employee) => (
                                    <div key={employee.id} className="bg-white rounded-xl p-4 sm:p-6 border border-orange-200 shadow-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 grid place-items-center text-orange-600">
                                                        <MdPeople className="text-xl sm:text-2xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{employee.name}</h3>
                                                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                                            <MdEmail className="text-orange-600" />
                                                            {employee.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAccept(employee.id)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                                                >
                                                    <MdCheck className="text-lg" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(employee.id, employee.name)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                                                >
                                                    <MdClose className="text-lg" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-linear-to-r from-orange-50 to-orange-100 px-4 sm:px-6 py-4 border-b border-orange-200">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MdPeople className="text-orange-600 text-xl sm:text-2xl" />
                                Active Employees ({filteredEmployees.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-900">Name</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-900">Email</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-900">Role</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEmployees.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <MdPeople className="inline text-4xl mb-2 text-gray-400" />
                                                <p className="text-base sm:text-lg font-medium">No employees found</p>
                                                <p className="text-xs sm:text-sm">Try adjusting your search</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee.id} className="hover:bg-orange-50 transition-colors">
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-100 grid place-items-center text-orange-600">
                                                            {employee.admin === 1 ? (
                                                                <MdAdminPanelSettings className="text-base sm:text-lg" />
                                                            ) : (
                                                                <MdPeople className="text-base sm:text-lg" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm sm:text-base font-medium text-gray-900">{employee.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">{employee.email}</td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${employee.admin === 1
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {employee.admin === 1 ? 'Admin' : 'Employee'}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <button
                                                        onClick={() => handleRemove(employee.id, employee.name)}
                                                        className="flex items-center gap-1 sm:gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm"
                                                    >
                                                        <MdPersonRemove className="text-base sm:text-lg" />
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {filteredEmployees.length > 0 && (
                            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employee{filteredEmployees.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
            <Toaster position="bottom-right" />
        </div>
    )
}

export default People
