import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdEventAvailable, MdLogin, MdPersonAdd, MdAdminPanelSettings, MdMenu, MdClose } from 'react-icons/md'
const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-orange-100 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
                <Link to="/signin" className="flex items-center gap-2 text-xl font-bold text-orange-600 hover:text-orange-700 transition">
                    <MdEventAvailable className="text-2xl" />
                    <span className="hidden xs:inline">Attendify</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-auto lg:hidden p-2 text-gray-700 hover:text-orange-600 transition" aria-label="Toggle menu">
                    {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
                </button>
                <nav className="hidden lg:flex ml-auto items-center gap-2">
                    <Link to="/signin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition">
                        <MdLogin className="text-lg" />
                        <span>Sign In</span>
                    </Link>
                    <Link to="/signup" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-md hover:shadow-lg transition">
                        <MdPersonAdd className="text-lg" />
                        <span>Sign Up</span>
                    </Link>
                    <Link to="/admin/signin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition">
                        <MdAdminPanelSettings className="text-lg" />
                        <span>Admin</span>
                    </Link>
                </nav>
            </div>
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-orange-100 bg-white">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition">
                            <MdLogin className="text-xl" />
                            <span>Sign In</span>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-md transition">
                            <MdPersonAdd className="text-xl" />
                            <span>Sign Up</span>
                        </Link>
                        <Link to="/admin/signin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition">
                            <MdAdminPanelSettings className="text-xl" />
                            <span>Admin Portal</span>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
export default Navbar
