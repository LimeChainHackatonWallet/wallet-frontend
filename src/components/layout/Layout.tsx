import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div className="app dark bg-background min-h-screen text-foreground">
      <Outlet />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Layout;
