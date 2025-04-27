// app/api/warehouse/update/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { warehouseId, sections } = body;

    // Verify warehouse belongs to user
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        userId: session.user.id,
      },
    });

    if (!warehouse) {
      return new NextResponse("Warehouse not found", { status: 404 });
    }

    // Delete existing sections and create new ones in a transaction
    const updatedWarehouse = await prisma.$transaction(async (tx) => {
      // Delete existing sections
      await tx.warehouseSection.deleteMany({
        where: {
          warehouseId: warehouseId,
        },
      });

      // Create new sections
      const createdSections = await Promise.all(
        sections.map((section: any) =>
          tx.warehouseSection.create({
            data: {
              name: section.name,
              type: section.type,
              description: section.description,
              color: section.color,
              positionX: section.positionX,
              positionY: section.positionY,
              positionZ: section.positionZ,
              sizeX: section.sizeX,
              sizeY: section.sizeY,
              sizeZ: section.sizeZ,
              warehouseId: warehouseId,
            },
          }),
        ),
      );

      // Return updated warehouse with sections
      return tx.warehouse.findUnique({
        where: { id: warehouseId },
        include: { sections: true },
      });
    });

    return NextResponse.json(updatedWarehouse);
  } catch (error) {
    console.error("[WAREHOUSE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
