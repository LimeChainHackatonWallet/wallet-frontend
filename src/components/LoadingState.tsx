import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const LoadingState = () => {
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
