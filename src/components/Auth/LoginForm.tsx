
import React, { useState } from "react";
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
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

    try {
      await login(email, password);
      console.log("Login form - login successful, showing success toast");
      
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto!",
      });
      
      // Explicitly navigate to dashboard after successful login
      console.log("Login form - navigating to dashboard");
      navigate("/dashboard");
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
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Accesso in corso..." : "Accedi"}
          </Button>
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
