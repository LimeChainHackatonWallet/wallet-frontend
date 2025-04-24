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
import { ArrowRight, DollarSign, CreditCard, Send } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-slate-100 p-4">
                <DollarSign className="h-10 w-10 text-slate-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                CryptoWallet
              </h1>
              <p className="text-slate-500">
                A simple and intuitive wallet for your daily financial needs
              </p>
            </div>

            <Card className="border-slate-100 shadow-md">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>
                  Everything you need for your daily financial activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureItem
                  icon={<Send className="h-5 w-5 text-slate-500" />}
                  title="Send & Receive Money"
                  description="Instantly transfer funds to friends and family"
                />
                <Separator className="my-2" />
                <FeatureItem
                  icon={<DollarSign className="h-5 w-5 text-slate-500" />}
                  title="Buy Currency"
                  description="Purchase digital currency directly in the app"
                />
                <Separator className="my-2" />
                <FeatureItem
                  icon={<CreditCard className="h-5 w-5 text-slate-500" />}
                  title="Online Purchases"
                  description="Use your wallet for seamless online shopping"
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full gap-2"
                  onClick={handleCreateAccount}
                  disabled={isLoading}
                >
                  Create Account
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
      <div className="rounded-full bg-slate-50 p-2">{icon}</div>
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
