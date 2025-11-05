import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Scanner } from '@yudiel/react-qr-scanner'
import { MdQrCodeScanner, MdClose, MdLogout, MdManageAccounts } from 'react-icons/md'
import axios from 'axios'

const Dashboard = () => {
    const [status, setStatus] = useState('Not Checked In')
    const [isScanning, setIsScanning] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('user')
        location.reload()
    }

    const handleScan = async (detectedCodes) => {
        console.log('Detected codes:', detectedCodes)
        detectedCodes.forEach(code => {
            console.log(`Format: ${code.format}, Value: ${code.rawValue}`)
        })
        const moveResponse = await axios.get(`http://localhost:5000/movements/getTodayMovementsById/${JSON.parse(localStorage.getItem('user')).id}`)
        console.log('Movement data:', moveResponse.data)
        setStatus(moveResponse.data.movement)
        setIsScanning(false)
    }

    useEffect(() => {
        document.title = 'Dashboard - Attendify'
        if (!localStorage.getItem('user')) {
            navigate('/signin')
        }
        if (JSON.parse(localStorage.getItem('user')).admin === 1) {
            setIsAdmin(true)
        }
        const fetchUserStatus = async () => {
            const response = await axios.get(`http://localhost:5000/movements/getTodayStatusById/${JSON.parse(localStorage.getItem('user')).id}`)
            console.log('Initial movement data:', response.data)
            setStatus(response.data.status)
        }
        fetchUserStatus()
    }, [])

    return (
        <div className="min-h-[80vh]">
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white border border-orange-100 hover:border-orange-300 text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    <MdLogout className="text-xl" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
            <div className="grid place-items-center">
                <div className="w-full max-w-2xl px-4">
                    {!isScanning ? (
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={() => setIsScanning(true)}
                                className="h-32 w-32 rounded-full bg-linear-to-br from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center"
                            >
                                <MdQrCodeScanner className="text-6xl" />
                            </button>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
                                <p className="text-gray-600">Click the button to start scanning</p>
                            </div>
                            <div className="bg-white border border-orange-100 rounded-xl shadow-md p-6 w-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanned Result:</h3>
                                <p className="text-gray-700">Status: {status}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Scanning QR Code...</h2>
                                <button
                                    onClick={() => setIsScanning(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-orange-600 transition"
                                >
                                    <MdClose className="text-2xl" />
                                </button>
                            </div>
                            <div className="rounded-xl overflow-hidden">
                                <Scanner
                                    onScan={handleScan}
                                    onError={(error) => console.error(error)}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {isAdmin && (
                    <div className="mt-8 bg-white border border-orange-100 rounded-xl shadow-md p-6 text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                            <MdManageAccounts className="text-orange-600 text-2xl" />
                            Admin Panel
                        </h2>
                        <p className="text-gray-600 mb-4">View and manage all company employee movements</p>
                        <Link
                            to="/manage"
                            className="inline-flex items-center gap-2 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            <MdManageAccounts className="text-xl" />
                            <span>Go to Manage Page</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard