// app/api/warehouse/get/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's warehouse with sections
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        sections: true,
      },
      orderBy: {
        createdAt: "desc", // Get the most recent warehouse
      },
    });

    if (!warehouse) {
      return new NextResponse("No warehouse found", { status: 404 });
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("[WAREHOUSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
