import { Routes, Route, Navigate, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import AdminCreate from "./components/AdminCreate";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import AdminVideo from "./components/adminVideo";
import LandingPage from "./pages/LandingPage";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// ProtectedRoute component for route guarding
function ProtectedRoute({ isAuthenticated, redirectTo = "/login", children }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  return children;
}

// RedirectAuthenticated component to prevent logged-in users accessing login/signup
function RedirectAuthenticated({ isAuthenticated, redirectTo = "/homepage", children }) {
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

function App() {
  // Get authentication state from redux
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Homepage is protected */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login">
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* Login route redirects away if already logged in */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticated isAuthenticated={isAuthenticated} redirectTo="/homepage">
              <Login />
            </RedirectAuthenticated>
          }
        />

        {/* Signup route redirects away if already logged in */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticated isAuthenticated={isAuthenticated} redirectTo="/homepage">
              <Signup />
            </RedirectAuthenticated>
          }
        />

        {/* Admin routes protected by role and login */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
              redirectTo="/"
            >
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
              redirectTo="/"
            >
              <AdminCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delete"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
              redirectTo="/"
            >
              <AdminDelete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
              redirectTo="/"
            >
              <AdminUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/video"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
              redirectTo="/"
            >
              <AdminVideo />
            </ProtectedRoute>
          }
        />

        {/* Public Problem page */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />

        {/* Default/fallback to landing if unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default App;
