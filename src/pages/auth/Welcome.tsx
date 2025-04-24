import React from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowRight, DollarSign, CreditCard, Send, Shield } from "lucide-react";

const Welcome = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateAccount = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigation logic will be added later
    }, 1000);
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigation logic will be added later
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-primary/20 p-4">
                <DollarSign className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                CryptoWallet
              </h1>
              <p className="text-muted-foreground">
                Everyday finance, powered by blockchain technology
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-xs">
                Secured by advanced crypto technology, with the simplicity of
                traditional banking
              </p>
            </div>

            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Key Features
                </CardTitle>
                <CardDescription>
                  Blockchain-powered solutions for your daily financial needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureItem
                  icon={<Send className="h-5 w-5 text-primary" />}
                  title="Send & Receive Money"
                  description="Instantly transfer funds using secure blockchain technology"
                />
                <Separator className="my-2 bg-border" />
                <FeatureItem
                  icon={<DollarSign className="h-5 w-5 text-primary" />}
                  title="Buy Cryptocurrency"
                  description="Seamlessly purchase digital assets that work like cash"
                />
                <Separator className="my-2 bg-border" />
                <FeatureItem
                  icon={<CreditCard className="h-5 w-5 text-primary" />}
                  title="Crypto-Powered Payments"
                  description="Shop online with the security of blockchain technology"
                />
                <Separator className="my-2 bg-border" />
                <FeatureItem
                  icon={<Shield className="h-5 w-5 text-primary" />}
                  title="Bank-Level Security"
                  description="Protected by the same blockchain technology trusted by institutions"
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full gap-2"
                  onClick={handleCreateAccount}
                  disabled={isLoading}
                >
                  Create Wallet Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  Login to Existing Account
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="rounded-full bg-secondary p-2">{icon}</div>
      <div>
        <h3 className="font-medium text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full bg-muted" />
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="h-4 w-64 bg-muted" />
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-36 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-12 w-full bg-muted" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Skeleton className="h-10 w-full bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
