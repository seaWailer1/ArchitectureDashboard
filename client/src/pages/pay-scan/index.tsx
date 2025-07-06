import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, QrCode, Camera, Upload, Plus } from "lucide-react";

export default function PayScanIndex() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('scan');

  const handleScanQR = () => {
    navigate('/pay-scan/scan');
  };

  const handleGenerateQR = () => {
    navigate('/pay-scan/generate');
  };

  const handleUploadQR = () => {
    navigate('/pay-scan/upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Pay & Scan</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">QR code payments</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan & Pay</TabsTrigger>
            <TabsTrigger value="generate">Request Money</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            {/* Scan Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Scan a QR code to make payments or transfer money instantly
                </p>
                
                <div className="space-y-3">
                  <Button onClick={handleScanQR} className="w-full h-12 flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Open Camera</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleUploadQR}
                    className="w-full h-12 flex items-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload from Gallery</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Pay */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Scan these demo QR codes for testing
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Coffee Shop</p>
                    <p className="text-sm font-medium">$4.50</p>
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Restaurant</p>
                    <p className="text-sm font-medium">$12.75</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            {/* Generate QR */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Request Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Generate a QR code to request money from others
                </p>
                
                <Button onClick={handleGenerateQR} className="w-full h-12">
                  Create Payment Request
                </Button>
              </CardContent>
            </Card>

            {/* Recent Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Lunch Split</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">$25.00</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Share Again
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Coffee Money</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">$8.50</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Share Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}