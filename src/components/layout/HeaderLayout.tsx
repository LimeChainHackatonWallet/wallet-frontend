import { Outlet } from "react-router-dom";
import Header from "./Header";

const HeaderLayout = () => {
  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">
      <Header />
      <Outlet />
    </div>
  );
};

export default HeaderLayout;
