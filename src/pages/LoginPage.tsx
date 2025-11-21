"use client";
import React, { useState } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
        if (!formData.password) errors.password = "Password is required";
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://ec2-3-109-208-236.ap-south-1.compute.amazonaws.com:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
  alert("✅ Login successful!");
  console.log("Response:", data);


  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("authorityId", data.user.authorityId ?? "");


  if (data.user.role === "admin") {
    navigate("/admin");
  } else if (data.user.authorityId) {
    navigate("/authority");
  } else {
    navigate("/dashboard");
  }
}


        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex font-inter">

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-400 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>

                <div className="relative z-10">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-2xl font-bold">NagarSeva</span>
                    </button>
                </div>

                <div className="relative z-10 space-y-6 text-white">
                    <h1 className="text-5xl font-bold leading-tight">Welcome Back!</h1>
                    <p className="text-xl opacity-90">
                        Continue making your city better, one report at a time.
                    </p>
                    <div className="space-y-4 pt-6">
                        {["Track your reports", "Connect with authorities", "Make an impact"].map(
                            (text, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <CheckCircle size={24} />
                                    <span className="text-lg">{text}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="relative z-10 text-white text-sm opacity-75">
                    <p>🇮🇳 Proudly serving 142+ cities across India</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-300">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                            <p className="text-gray-600 mt-2">
                                Enter your credentials to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formErrors.password}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                {isSubmitting ? "Please wait..." : "Login"}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Don’t have an account?{" "}
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>

                        <div className="lg:hidden pt-4 border-t">
                            <button
                                onClick={() => navigate("/")}
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
};

export default LoginPage;
