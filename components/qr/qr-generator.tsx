"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QRFormSchema } from "@/lib/validation";

export function QRGenerator() {
  const [qrValue, setQrValue] = useState<string>("");

  // Initialize form with react-hook-form and shadcn/ui Form
  const form = useForm<QRFormSchema>({
    defaultValues: {
      shipmentNumber: "",
      orderNumber: "",
      customerName: "",
      destination: "",
      weight: "",
      deliveryDate: "",
    },
  });

  function onSubmit(data: QRFormSchema) {
    try {
      const jsonData = JSON.stringify(data);
      setQrValue(jsonData);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  }

  const handleDownloadQR = (): void => {
    const svgElement = document.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shipment-${form.getValues("shipmentNumber")}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment QR Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="shipmentNumber"
                  rules={{
                    required: "Shipment number is required",
                    minLength: {
                      value: 1,
                      message: "Shipment number is required",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Shipment Number*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shipment number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderNumber"
                  rules={{
                    required: "Order number is required",
                    minLength: {
                      value: 1,
                      message: "Order number is required",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Order Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter order number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter destination" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  rules={{
                    validate: (value) => {
                      if (value && isNaN(Number(value))) {
                        return "Weight must be a valid number";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter weight"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryDate"
                  rules={{
                    validate: (value) => {
                      if (value && isNaN(new Date(value).getTime())) {
                        return "Invalid date format";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Generate QR Code
                </Button>
              </form>
            </Form>

            <div className="flex flex-col items-center justify-center space-y-4">
              {qrValue && (
                <>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <QRCode value={qrValue} size={256} level="H" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDownloadQR}
                    className="w-full"
                  >
                    Download QR Code
                  </Button>
                  <div className="w-full">
                    <p className="font-medium mb-2">Preview of encoded data:</p>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-48 text-sm">
                      {JSON.stringify(JSON.parse(qrValue), null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QRGenerator;
