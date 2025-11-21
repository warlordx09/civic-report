import  { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-700 tracking-tight"
                >
                    report.<span className="text-blue-500">issues</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/reports"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        View Issues
                    </Link>
                    <Link
                        to="/report"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Report Issue
                    </Link>

                    <Link to="/login">
                        <button className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            Sign Up
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-100 py-3 space-y-2 text-center">
                    <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="block text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/reports"
                        onClick={() => setOpen(false)}
                        className="block text-gray-700 hover:text-blue-600 font-medium"
                    >
                        View Issues
                    </Link>
                    <Link
                        to="/report"
                        onClick={() => setOpen(false)}
                        className="block text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Report Issue
                    </Link>
                    <div className="flex justify-center gap-3 mt-3">
                        <Link to="/login" onClick={() => setOpen(false)}>
                            <button className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup" onClick={() => setOpen(false)}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
