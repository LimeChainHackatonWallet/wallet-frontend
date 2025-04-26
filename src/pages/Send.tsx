import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Send() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-bold">Send Crypto</h1>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-center text-muted-foreground">
          Send functionality will be implemented soon.
        </p>
      </div>
    </>
  );
}
