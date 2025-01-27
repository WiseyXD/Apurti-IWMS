// app/qr/actions.ts
"use server";

interface ScanData {
  code: string;
  timestamp: string;
}

export async function saveScan(scanData: ScanData): Promise<void> {
  try {
    // Validate the scan data
    if (!scanData.code) {
      throw new Error("Invalid scan data");
    }

    // Here you would typically save to your database
    console.log("Saving scan data:", scanData);

    // Don't return anything to match the Promise<void> type
  } catch (error) {
    console.error("Error saving scan:", error);
    throw new Error("Failed to process scan");
  }
}
