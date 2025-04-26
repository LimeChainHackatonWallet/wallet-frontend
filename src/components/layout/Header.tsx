import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarImage src={`https://avatar.vercel.sh/${user?.address}`} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.address?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Account:</p>
          <h2 className="text-xl font-bold">{formatAddress(user.address)}</h2>
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Header;
