import * as z from "zod";

export const QRformSchema = z.object({
  shipmentNumber: z.string().min(1, "Shipment number is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  customerName: z.string().optional(),
  destination: z.string().optional(),
  weight: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Weight must be a valid number",
    })
    .optional(),
  deliveryDate: z.string().optional(),
});

export type QRFormSchema = z.infer<typeof QRformSchema>;
