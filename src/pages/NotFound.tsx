import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Orbit, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-glow">
          <Orbit className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="font-display text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page seems to have drifted out of orbit.
        </p>
        
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
