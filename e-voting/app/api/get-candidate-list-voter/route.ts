import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if needed

export async function GET(req: Request) {
  try {
    // ✅ Fetch both 'id' and 'name'
    const candidates = await prisma.candidate.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // ✅ Return directly — array of objects like [{ id, name }]
    return NextResponse.json(candidates, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch candidate list:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
