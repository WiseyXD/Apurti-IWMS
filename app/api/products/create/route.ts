// app/api/products/create/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Get the warehouse for the user
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!warehouse) {
      return new NextResponse("No warehouse found", { status: 404 });
    }

    // Create the product with enhanced fields
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        sku: body.sku,
        qrCode: body.qrCode,
        category: body.category,
        quantity: body.quantity,
        width: body.width,
        height: body.height,
        depth: body.depth,
        weight: body.weight,
        requiresColdStorage: body?.requiresColdStorage || false,
        minTemperature: body.minTemperature,
        maxTemperature: body.maxTemperature,
        humidity: body.humidity,
        fragile: body.fragile || false,
        hazardous: body.hazardous || false,
        warehouseId: warehouse.id,
        sectionId: body.sectionId,
        positionX: body.positionX,
        positionY: body.positionY,
        positionZ: body.positionZ,
        status: body.status,
        priority: body.priority,
      },
      include: {
        section: true,
      },
    });

    // Create a scan record
    await prisma.productScan.create({
      data: {
        productId: product.id,
        scanData: {
          action: "receive",
          timestamp: new Date().toISOString(),
          requirements: {
            requiresColdStorage: body.requiresColdStorage,
            fragile: body.fragile,
            hazardous: body.hazardous,
            temperature: body.temperature,
          },
        },
        scannedBy: session.user.id,
        action: "receive",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_CREATE]", error);

    // Handle unique constraint violation (duplicate SKU/QR code)
    if ((error as any).code === "P2002") {
      return new NextResponse(
        "Product with this SKU or QR code already exists",
        { status: 409 },
      );
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
