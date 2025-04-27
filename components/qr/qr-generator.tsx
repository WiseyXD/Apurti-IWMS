// components/qr/qr-generator.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface QRFormSchema {
  shipmentNumber: string;
  orderNumber: string;
  customerName: string;
  destination: string;
  weight: string;
  deliveryDate: string;
  category: string;
  requiresColdStorage: boolean;
  fragile: boolean;
  hazardous: boolean;
  temperature?: string;
}

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
      category: "",
      requiresColdStorage: false,
      fragile: false,
      hazardous: false,
      temperature: "",
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category (e.g., Electronics, Food)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Requirements Switches */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium">Storage Requirements</h3>

                  <FormField
                    control={form.control}
                    name="requiresColdStorage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Requires Cold Storage</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("requiresColdStorage") && (
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Temperature (°C)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter temperature"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="fragile"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Fragile Item</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hazardous"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Hazardous Material</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

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
