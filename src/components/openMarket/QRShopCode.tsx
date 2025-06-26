import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  QrCode,
  Download,
  Share2,
  Printer,
  Copy,
  CheckCircle,
  Smartphone,
  Users,
  TrendingUp,
} from "lucide-react";

interface QRShopCodeProps {
  shopId: string;
  shopName: string;
  ownerName: string;
  shopUrl: string;
}

export const QRShopCode = ({
  shopId,
  shopName,
  ownerName,
  shopUrl,
}: QRShopCodeProps) => {
  const [copied, setCopied] = useState(false);
  const [qrStats, setQrStats] = useState({
    scansToday: 23,
    scansThisWeek: 156,
    scansThisMonth: 847,
    conversionRate: 34,
  });

  const qrCodeValue = `${shopUrl}?ref=qr&shop=${shopId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadQRCode = () => {
    // In a real implementation, this would generate and download a QR code image
    console.log("Downloading QR code for:", qrCodeValue);
  };

  const printQRCode = () => {
    // In a real implementation, this would open a print dialog
    console.log("Printing QR code for:", qrCodeValue);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Visit ${shopName} on Savannah Market`,
          text: `Check out ${shopName} by ${ownerName} on our marketplace!`,
          url: qrCodeValue,
        });
      } catch (err) {
        console.error("Error sharing: ", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          Shop QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-orange-500" />
            Your Shop QR Code
          </DialogTitle>
          <DialogDescription>
            Share your personalized QR code to let customers visit your shop
            instantly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-6 text-center space-y-4">
              {/* QR Code Placeholder - In real implementation, use a QR code library */}
              <div className="w-48 h-48 mx-auto bg-white border-2 border-orange-300 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <QrCode className="h-16 w-16 mx-auto text-orange-500" />
                  <div className="text-sm font-mono text-gray-600 break-all px-2">
                    {qrCodeValue.substring(0, 30)}...
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-orange-800">{shopName}</h3>
                <p className="text-sm text-orange-600">by {ownerName}</p>
                <Badge className="bg-orange-500 text-white">
                  Scan to Visit Shop
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={printQRCode} variant="outline" className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={shareQRCode} variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* QR Code Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QR Code Performance</CardTitle>
              <CardDescription>
                See how customers are discovering your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Scans Today</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {qrStats.scansToday}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">This Week</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {qrStats.scansThisWeek}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">This Month</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {qrStats.scansThisMonth}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-600">Conversion</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {qrStats.conversionRate}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                💡 QR Code Marketing Tips
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Print on business cards and flyers</li>
                <li>• Display at your physical market stall</li>
                <li>• Share on WhatsApp and social media</li>
                <li>• Add to product packaging and receipts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
