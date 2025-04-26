import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import { Copy, Share2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReceiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReceiveDialog({ open, onOpenChange }: ReceiveDialogProps) {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    if (user?.address) {
      setWalletAddress(user.address);
    } else {
      // Fallback address for demo/development
      setWalletAddress("G5RWouv5H8pkN4bqTnoo21NuNXtxVmQWB6yX");
    }

    // Get the base URL for the application
    setBaseUrl(window.location.origin);
  }, [user]);

  // Create a URL for the Send page with the address pre-filled
  const generateQRValue = () => {
    return `${baseUrl}/send?address=${walletAddress}`;
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard");
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(generateQRValue());
    toast.success("Payment URL copied to clipboard");
  };

  const shareAddress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wallet Address",
          text: `My wallet address: ${walletAddress}`,
          url: generateQRValue(),
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Failed to share address");
      }
    } else {
      copyAddressToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border border-gray-700"
        style={{ backgroundColor: "#1f2937", color: "white" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "white" }}>Receive Payment</DialogTitle>
          <DialogDescription style={{ color: "#9ca3af" }}>
            Scan this QR code to send funds to your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="bg-white p-4 rounded-lg mb-6">
            <QRCodeSVG
              value={generateQRValue()}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>

          <div className="w-full space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md break-all">
                <span className="text-sm font-mono text-white">
                  {walletAddress}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 flex-shrink-0 text-white hover:bg-gray-700"
                  onClick={copyAddressToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                variant="outline"
                onClick={copyUrlToClipboard}
              >
                <Link className="h-4 w-4 mr-2" />
                Copy Payment URL
              </Button>
              <Button
                className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                variant="outline"
                onClick={shareAddress}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
