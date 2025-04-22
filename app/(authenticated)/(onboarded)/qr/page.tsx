// app/qr/page.tsx
import { saveScan } from "@/actions";
import { QRScannerComponent } from "@/components/qr/qr-scanner";
import QRGenerator from "@/components/qr/qr-generator";

export default function QRPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">QR Code Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Scanner Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <QRScannerComponent onScanComplete={saveScan} />
        </div>

        {/* QR Generator Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
          <QRGenerator />
        </div>
      </div>
    </div>
  );
}
