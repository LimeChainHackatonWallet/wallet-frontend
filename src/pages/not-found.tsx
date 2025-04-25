import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center dark bg-background p-4 text-foreground">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8 rounded-full bg-background border border-primary/20 p-5">
          <SearchX className="h-14 w-14 text-primary" />
        </div>

        <h1 className="mb-3 text-5xl font-bold text-primary">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>

        <div className="mb-8 px-2 py-4 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Please
            check the URL or go back to the homepage.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto hover:bg-primary/90"
            size="lg"
          >
            Return Home
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-primary/20 hover:bg-primary/10 hover:text-primary"
            size="lg"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
