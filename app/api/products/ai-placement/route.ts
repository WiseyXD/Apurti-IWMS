// app/api/products/ai-placement/route.ts
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
    const { productRequirements } = body;

    // Get the user's warehouse and sections
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        sections: true,
      },
    });

    if (!warehouse) {
      return new NextResponse("No warehouse found", { status: 404 });
    }

    // AI logic to determine the best section
    let bestSection = warehouse.sections[0]; // Default to first section
    let bestScore = 0;

    warehouse.sections.forEach((section) => {
      let score = 0;

      // Check cold storage requirement
      if (
        productRequirements.requiresColdStorage &&
        section.temperature !== null &&
        section.temperature < 10
      ) {
        score += 10;
      }

      // Temperature compatibility
      if (productRequirements.temperature && section.temperature !== null) {
        const tempDiff = Math.abs(
          section.temperature - productRequirements.temperature,
        );
        if (tempDiff < 5) {
          score += 7;
        } else if (tempDiff < 10) {
          score += 3;
        }
      }

      // Check fragile handling
      if (productRequirements.fragile && section.fragile) {
        score += 5;
      }

      // Check hazardous materials
      if (productRequirements.hazardous && section.hazardous) {
        score += 5;
      }

      // Weight consideration (heavier items should be at lower positions)
      if (productRequirements.weight > 10 && section.positionY <= 1) {
        score += 3;
      }

      // Check available space (lower occupancy gets higher score)
      const sectionProducts = await prisma.product.count({
        where: {
          sectionId: section.id,
        },
      });

      const sectionVolume = section.sizeX * section.sizeY * section.sizeZ;
      const occupancyRate = sectionProducts / sectionVolume;

      if (occupancyRate < 0.5) {
        score += 5;
      } else if (occupancyRate < 0.8) {
        score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestSection = section;
      }
    });

    // Calculate optimal position within the section
    const existingProducts = await prisma.product.findMany({
      where: {
        sectionId: bestSection.id,
      },
      select: {
        positionX: true,
        positionY: true,
        positionZ: true,
      },
    });

    // Find an empty spot - simple grid-based approach
    let positionX = 0;
    let positionY = 1;
    let positionZ = 0;
    let found = false;

    for (
      let x = -bestSection.sizeX / 2;
      x < bestSection.sizeX / 2 && !found;
      x += 1
    ) {
      for (
        let z = -bestSection.sizeZ / 2;
        z < bestSection.sizeZ / 2 && !found;
        z += 1
      ) {
        const isOccupied = existingProducts.some(
          (p) =>
            Math.abs(p.positionX! - x) < 0.5 &&
            Math.abs(p.positionZ! - z) < 0.5,
        );

        if (!isOccupied) {
          positionX = x;
          positionZ = z;
          found = true;
        }
      }
    }

    // If all spots are taken, stack on top
    if (!found) {
      positionY = Math.max(...existingProducts.map((p) => p.positionY!)) + 1;
    }

    return NextResponse.json({
      sectionId: bestSection.id,
      sectionName: bestSection.name,
      position: {
        x: positionX,
        y: positionY,
        z: positionZ,
      },
      score: bestScore,
    });
  } catch (error) {
    console.error("[AI_PLACEMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
