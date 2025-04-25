import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app dark bg-background min-h-screen text-foreground">
      <Outlet />
    </div>
  );
};

export default Layout;
