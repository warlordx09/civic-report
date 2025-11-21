import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role?: "user" | "authority" | "admin";
    authorityId?: number;
}
interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
   const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: "user",
});
const [authorities, setAuthorities] = useState<{ id: number; name: string }[]>([]);

useEffect(() => {

    fetch("http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/authorities")
        .then(res => res.json())
        .then(data => setAuthorities(data))
        .catch(err => console.error(err));
}, []);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === "authorityId" ? Number(value) : value,
  }));
  if (formErrors[name as keyof FormErrors]) {
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  }
};

    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }


        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
               body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    authorityId: formData.authorityId || null
}),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
                console.log('Response:', data);
                window.location.href = '/login';
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex font-inter">
            {/* Left Side - Gradient/Image Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-300 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -ml-48 -mb-48"></div>

                <div className="relative z-10">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-2xl font-bold">NagarSeva</span>
                    </button>
                </div>

                <div className="relative z-10 space-y-6 text-white">
                    <h1 className="text-5xl font-bold leading-tight">Join the Movement</h1>
                    <p className="text-xl opacity-90">
                        Be the change you want to see in your community. Start reporting civic issues today.
                    </p>
                    <div className="space-y-4 pt-6">
                        <div className="flex items-center space-x-3">
                            <CheckCircle size={24} />
                            <span className="text-lg">Report issues in seconds</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle size={24} />
                            <span className="text-lg">Join a community of changemakers</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle size={24} />
                            <span className="text-lg">See real impact in your neighborhood</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-white text-sm opacity-75">
                    <p>🇮🇳 Already 45,280+ issues reported and resolved</p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                            <p className="text-gray-600 mt-2">Sign up to start reporting issues</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your full name"
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Confirm your password"
                                />
                                {formErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                                )}
                            </div>
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
    <select
        name="role"
        value={formData.role}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
    >
        <option value="user">User</option>
        <option value="authority">Authority</option>
        <option value="admin">Admin</option>
    </select>
</div>
{formData.role === "authority" && (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Authority</label>
        <select
            name="authorityId"
            value={formData.authorityId || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
        >
            <option value="">Select authority</option>
            {authorities.map(auth => (
                <option key={auth.id} value={auth.id}>{auth.name}</option>
            ))}
        </select>
    </div>
)}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Please wait...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                                    Login
                                </a>
                            </p>
                        </div>

                        <div className="lg:hidden pt-4 border-t">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}