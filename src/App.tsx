import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import AuthorityDashboard from "./pages/AuthorityDashboard";
// import ReportForm from "./pages/ReportForm";
// import ReportsList from "./pages/ReportsList";

function App() {
  return (
   <Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* User Dashboard */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

   <Route
  path="/authority"
  element={
   <ProtectedRoute requiredRole="authority">
  <AuthorityDashboard />
</ProtectedRoute>
  }
/>
  </Routes>
</Router>
  );
}

export default App;
