// app/qr/page.tsx
import { saveScan } from "@/actions";
import { QRScannerComponent } from "@/components/qr-scanner";

export default function ScanPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <QRScannerComponent onScanComplete={saveScan} />
    </div>
  );
}
