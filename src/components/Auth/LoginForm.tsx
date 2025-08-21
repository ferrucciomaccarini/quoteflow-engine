
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = ({ onToggleForm }: { onToggleForm: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDemoAccess = () => {
    setEmail("test@test.com");
    setPassword("testtest");
    
    toast({
      title: "Modalità Demo",
      description: "Credenziali demo caricate. Clicca 'Accedi' per continuare.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campi richiesti",
        description: "Inserisci email e password per accedere.",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);
    console.log("Form submission - attempting login for:", email);

    const isDemoUser = email === "test@test.com";
    
    try {
      await login(email, password);
      console.log("Login form - login successful, showing success toast");
      
      toast({
        title: "Accesso effettuato",
        description: isDemoUser ? "Benvenuto nella modalità demo!" : "Benvenuto!",
      });
      
      // The useEffect hook will handle navigation after authentication state updates
    } catch (error: any) {
      console.error("Login form - login error:", error);
      
      let errorMessage = "Controlla le tue credenziali e riprova.";
      
      // Handle specific error cases
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email o password non corrette.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Conferma la tua email prima di accedere.";
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Troppi tentativi di accesso. Riprova più tardi.";
      }
      
      toast({
        title: "Accesso fallito",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pmix EaaS Login</CardTitle>
        <CardDescription className="text-center">
          Inserisci le tue credenziali per accedere alla piattaforma Pmix EaaS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Inserisci la tua email"
              required
              disabled={isLoggingIn}
              className={email === "test@test.com" ? "border-amber-500 bg-amber-50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              required
              disabled={isLoggingIn}
              className={email === "test@test.com" ? "border-amber-500 bg-amber-50" : ""}
            />
          </div>
          
          {email === "test@test.com" && (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 text-sm text-amber-800">
              🎯 <strong>Modalità Demo</strong> - Stai utilizzando le credenziali demo per testare la piattaforma.
            </div>
          )}
          
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Accesso in corso..." : "Accedi"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">oppure</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoAccess}
              disabled={isLoggingIn}
            >
              🚀 Accesso Demo
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p>
          Nuovo su Pmix?{" "}
          <Button variant="link" className="p-0" onClick={onToggleForm} disabled={isLoggingIn}>
            Crea un account
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
