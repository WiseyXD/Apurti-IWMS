// app/api/products/search/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // Get the user's warehouse
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!warehouse) {
      return new NextResponse("No warehouse found", { status: 404 });
    }

    // Search products in the user's warehouse
    const products = await prisma.product.findMany({
      where: {
        warehouseId: warehouse.id,
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { qrCode: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        section: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20, // Limit to 20 results
    });

    // Transform the data to match the expected format
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      location: product.section?.name || "Unknown",
      position: [
        product.positionX || 0,
        product.positionY || 1,
        product.positionZ || 0,
      ],
      quantity: product.quantity,
      lastUpdated: product.updatedAt.toISOString(),
      category: product.category,
      priority: product.priority,
      status: product.status,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("[PRODUCTS_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
