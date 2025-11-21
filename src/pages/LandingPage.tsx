import  { useState, useEffect } from 'react';
import { AlertCircle, Camera, MapPin, CheckCircle, Menu, X, Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [stats, setStats] = useState({ reports: 0, resolved: 0, cities: 0 });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current++;
            setStats({
                reports: Math.floor((current / steps) * 45280),
                resolved: Math.floor((current / steps) * 38450),
                cities: Math.floor((current / steps) * 142)
            });
            if (current >= steps) clearInterval(timer);
        }, increment);

        return () => clearInterval(timer);
    }, []);

    const issues = [
        { icon: '🚧', title: 'Potholes', desc: 'Report damaged roads' },
        { icon: '🗑️', title: 'Garbage Overflow', desc: 'Overflowing waste bins' },
        { icon: '💡', title: 'Street Lights', desc: 'Non-functional lighting' },
        { icon: '🚰', title: 'Water Supply', desc: 'Leaks & shortages' },
        { icon: '🌳', title: 'Parks & Gardens', desc: 'Maintenance issues' },
        { icon: '🚦', title: 'Traffic Signals', desc: 'Broken signals' }
    ];

    const steps = [
        { icon: Camera, title: 'Capture', desc: 'Take a photo of the issue' },
        { icon: MapPin, title: 'Locate', desc: 'Mark exact location' },
        { icon: AlertCircle, title: 'Describe', desc: 'Add details about the problem' },
        { icon: CheckCircle, title: 'Track', desc: 'Monitor resolution status' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br font-inter from-orange-50 via-white to-green-50">

            <nav className={`fixed w-full z-50 transition-all duration-300 border-b-1 border-slate-200 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <AlertCircle className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-orange-500 bg-clip-text text-transparent">
                                NagarSeva
                            </span>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors">How It Works</a>
                            <a href="#impact" className="text-gray-700 hover:text-orange-600 transition-colors">Impact</a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
                        </div>

                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-3 space-y-3">
                            <a href="#features" className="block text-gray-700 hover:text-orange-600">Features</a>
                            <a href="#how-it-works" className="block text-gray-700 hover:text-orange-600">How It Works</a>
                            <a href="#impact" className="block text-gray-700 hover:text-orange-600">Impact</a>
                            <a href="#contact" className="block text-gray-700 hover:text-orange-600">Contact</a>
                        </div>
                    </div>
                )}
            </nav>


            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in">
                            <div className="inline-block">
                                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                                    Empowering Citizens 🇮🇳
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Your Voice for a
                                <span className="block bg-gradient-to-r from-orange-600 via-green-500 to-green-600 bg-clip-text text-transparent">
                                    Better India
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Report civic issues instantly. Track their resolution. Make your city cleaner, safer, and better for everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="bg-orange-500 cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-orange-600 transform  transition-all duration-300"
                                    onClick={() => navigate("/login")}>
                                    Report an Issue
                                </button>
                                <button
                                    onClick={() => alert("Working on the docs!")}
                                    className="border-2 cursor-pointer border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-orange-500 hover:text-orange-600 transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-400 rounded-3xl transform rotate-6 opacity-20"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b">
                                    <h3 className="text-2xl font-bold text-gray-900">Quick Report</h3>
                                    <Camera className="text-orange-500" size={32} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {issues.map((issue, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gradient-to-br from-orange-50 to-green-50 p-4 rounded-xl text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="text-4xl mb-2">{issue.icon}</div>
                                            <div className="text-sm font-semibold text-gray-800">{issue.title}</div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-orange-500 from-orange-500 cursor-pointer text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                                    Start Reporting
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-gradient-to-r from-orange-600 to-orange-200 py-16" id="impact">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                        <div className="space-y-2">
                            <div className="text-5xl font-bold">{stats.reports.toLocaleString('en-IN')}+</div>
                            <div className="text-xl opacity-90">Issues Reported</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-bold">{stats.resolved.toLocaleString('en-IN')}+</div>
                            <div className="text-xl opacity-90">Problems Resolved</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-bold">{stats.cities}+</div>
                            <div className="text-xl opacity-90">Cities Connected</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 px-4 sm:px-6 lg:px-8" id="how-it-works">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Simple. Fast. Effective.
                        </h2>
                        <p className="text-xl text-gray-600">Report civic issues in just 4 easy steps</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-green-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="pt-6 text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="bg-green-100 p-4 rounded-full">
                                            <step.icon className="text-green-400" size={32} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <Users className="text-orange-500 mb-4" size={48} />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Driven</h3>
                            <p className="text-gray-600">Join thousands of citizens making a difference in their neighborhoods</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <TrendingUp className="text-green-500 mb-4" size={48} />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Tracking</h3>
                            <p className="text-gray-600">Monitor your report status and receive updates on resolution progress</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <Award className="text-orange-500 mb-4" size={48} />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Results</h3>
                            <p className="text-gray-600">Authorities respond faster with photo evidence and precise locations</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join millions of Indians building cleaner, safer cities
                    </p>
                    <button className="bg-green-500 cursor-pointer text-white px-12 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                        Start Reporting Now
                    </button>
                </div>
            </div>

            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8" id="contact">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 ">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="text-white" size={20} />
                                </div>
                                <span className="text-xl font-bold">NagarSeva</span>
                            </div>
                            <p className="text-gray-400">Empowering citizens to build better cities across India</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>About Us</div>
                                <div>How It Works</div>
                                <div>Report Issue</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>Help Center</div>
                                <div>Contact Us</div>
                                <div>Privacy Policy</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Connect</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>Facebook</div>
                                <div>Twitter</div>
                                <div>Instagram</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2025 NagarSeva. Building a Swachh and Smart Bharat 🇮🇳</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}