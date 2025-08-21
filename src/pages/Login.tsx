
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/Auth/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm";
import Logo from "@/components/common/Logo";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if this is a password recovery or auth callback and redirect accordingly (preserve query AND hash)
  useEffect(() => {
    const hash = location.hash || '';
    const hashParams = new URLSearchParams(hash.replace(/^#/, ''));

    const searchType = searchParams.get('type');
    const hashType = hashParams.get('type');

    const hasAccessToken = hashParams.has('access_token') || searchParams.has('access_token');
    const hasCode = hashParams.has('code') || searchParams.has('code');

    if (searchType === 'recovery' || hashType === 'recovery' || hasAccessToken || hasCode) {
      console.debug('[Auth] Redirecting to /reset-password with params', { search: location.search, hash: location.hash });
      navigate(`/reset-password${location.search}${hash}`, { replace: true });
    }
  }, [searchParams, navigate, location.search, location.hash]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If the user is authenticated, don't render the login form (we're redirecting)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Add Logo at the top center */}
        <Logo />
        
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Login;
