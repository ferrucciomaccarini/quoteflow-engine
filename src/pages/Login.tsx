
import LoginForm from "@/components/Auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-pmix-blue mb-2">Pmix EaaS Pricing</h1>
        <p className="text-gray-600 max-w-md">
          Equipment as a Service quoting platform for machinery owners
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
