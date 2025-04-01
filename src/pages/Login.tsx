
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import LoginForm from "@/components/Auth/LoginForm";
import Logo from "@/components/common/Logo";

const Login = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Add Logo at the top center */}
          <Logo />
          
          <LoginForm />
        </div>
      </div>
    </AuthProvider>
  );
};

export default Login;
