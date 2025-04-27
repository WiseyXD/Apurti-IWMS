// app/api/warehouse/create/route.ts
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
    const { warehouse, sections } = body;

    // Create the warehouse
    const newWarehouse = await prisma.warehouse.create({
      data: {
        name: warehouse.name,
        description: warehouse.description,
        address: warehouse.address,
        length: warehouse.length,
        width: warehouse.width,
        height: warehouse.height,
        userId: session.user.id,
        sections: {
          create: sections.map((section: any) => ({
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
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    return NextResponse.json(newWarehouse);
  } catch (error) {
    console.error("[WAREHOUSE_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
