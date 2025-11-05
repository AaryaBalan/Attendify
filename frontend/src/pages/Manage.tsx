import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdCalendarToday, MdFilterList, MdPeople, MdAccessTime, MdBarChart } from 'react-icons/md'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Manage = () => {
    const [movements, setMovements] = useState([])
    const [filter, setFilter] = useState('today')
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState([])
    const [showCharts, setShowCharts] = useState(true)
    const navigate = useNavigate()

    const COLORS = ['#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ff9800', '#ffa726', '#ffb74d', '#ffcc80']

    useEffect(() => {
        document.title = 'Manage - Attendify'
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
        fetchMovements('today')
    }, [])

    const fetchMovements = async (filterType) => {
        setLoading(true)
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const response = await axios.get(`http://localhost:5000/movements/getMovements/${filterType}/${user.company}`)
            setMovements(response.data.movements)
            setFilter(filterType)
            processChartData(response.data.movements)
        } catch (error) {
            console.error('Error fetching movements:', error)
            toast.error('Failed to fetch movements data')
        } finally {
            setLoading(false)
        }
    }

    const processChartData = (movementsData) => {
        const userWorkTime = {}

        movementsData.forEach(movement => {
            if (movement.in_time && movement.out_time) {
                const duration = calculateDurationInMinutes(movement.in_time, movement.out_time)
                if (!userWorkTime[movement.name]) {
                    userWorkTime[movement.name] = {
                        name: movement.name,
                        totalMinutes: 0,
                        email: movement.email
                    }
                }
                userWorkTime[movement.name].totalMinutes += duration
            }
        })

        const chartArray = Object.values(userWorkTime).map(user => ({
            name: user.name,
            hours: parseFloat((user.totalMinutes / 60).toFixed(2)),
            totalMinutes: user.totalMinutes,
            email: user.email
        })).sort((a, b) => b.hours - a.hours)

        setChartData(chartArray)
    }

    const calculateDurationInMinutes = (inTime, outTime) => {
        if (!inTime || !outTime) return 0
        const [inH, inM, inS] = inTime.split(':').map(Number)
        const [outH, outM, outS] = outTime.split(':').map(Number)

        const inSeconds = inH * 3600 + inM * 60 + inS
        const outSeconds = outH * 3600 + outM * 60 + outS

        const diffSeconds = outSeconds - inSeconds
        return Math.floor(diffSeconds / 60)
    }

    const formatTime = (time) => {
        if (!time) return '-'
        return time
    }

    const formatDate = (date) => {
        if (!date) return '-'
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const calculateDuration = (inTime, outTime) => {
        if (!inTime || !outTime) return '-'
        const [inH, inM, inS] = inTime.split(':').map(Number)
        const [outH, outM, outS] = outTime.split(':').map(Number)

        const inSeconds = inH * 3600 + inM * 60 + inS
        const outSeconds = outH * 3600 + outM * 60 + outS

        const diffSeconds = outSeconds - inSeconds
        const hours = Math.floor(diffSeconds / 3600)
        const minutes = Math.floor((diffSeconds % 3600) / 60)

        return `${hours}h ${minutes}m`
    }

    return (
        <div className="min-h-[80vh]">
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <MdPeople className="text-orange-600" />
                            Company Movements
                        </h1>
                        <p className="text-gray-600 mt-2">View and manage employee attendance records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdFilterList className="text-gray-600 text-xl" />
                        <span className="text-sm font-semibold text-gray-700">Filter:</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => fetchMovements('today')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'today'
                            ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        <MdCalendarToday className="inline mr-2" />
                        Today
                    </button>
                    <button
                        onClick={() => fetchMovements('yesterday')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'yesterday'
                            ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        Yesterday
                    </button>
                    <button
                        onClick={() => fetchMovements('week')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'week'
                            ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => fetchMovements('month')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'month'
                            ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => fetchMovements('year')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'year'
                            ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        This Year
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <>
                    {chartData.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <MdBarChart className="text-orange-600" />
                                    Work Hours Analytics
                                </h2>
                                <button
                                    onClick={() => setShowCharts(!showCharts)}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all"
                                >
                                    {showCharts ? 'Hide Charts' : 'Show Charts'}
                                </button>
                            </div>

                            {showCharts && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Total Hours by Employee</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis
                                                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #fb8c00',
                                                        borderRadius: '8px'
                                                    }}
                                                    formatter={(value) => [`${value} hours`, 'Total Hours']}
                                                />
                                                <Legend />
                                                <Bar dataKey="hours" fill="#fb8c00" name="Hours Worked" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Work Distribution</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="hours"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #fb8c00',
                                                        borderRadius: '8px'
                                                    }}
                                                    formatter={(value) => [`${value} hours`, 'Total Hours']}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-6 lg:col-span-2">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Work Hours Summary</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {chartData.map((user, index) => (
                                                <div key={index} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        ></div>
                                                        <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-600 truncate mb-2">{user.email}</p>
                                                    <p className="text-2xl font-bold text-orange-600">{user.hours}h</p>
                                                    <p className="text-xs text-gray-500">{Math.floor(user.totalMinutes % 60)}m</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-orange-50 to-orange-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Employee Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Check In</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Check Out</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Duration</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {movements.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                <MdAccessTime className="inline text-4xl mb-2 text-gray-400" />
                                                <p className="text-lg font-medium">No movements found</p>
                                                <p className="text-sm">Try selecting a different time period</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        movements.map((movement) => (
                                            <tr key={movement.id} className="hover:bg-orange-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{movement.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{movement.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(movement.date)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatTime(movement.in_time)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatTime(movement.out_time)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{calculateDuration(movement.in_time, movement.out_time)}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${movement.out_time
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                            }`}
                                                    >
                                                        {movement.out_time ? 'Checked Out' : 'Checked In'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {movements.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{movements.length}</span> record{movements.length !== 1 ? 's' : ''}
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

export default Manage
