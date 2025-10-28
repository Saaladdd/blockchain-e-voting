import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if your prisma client is elsewhere
import { Prisma } from "@prisma/client"; // Import Prisma types for error handling

export async function POST(req: Request) {
  try {
    // 1. Parse the request body
    const body = await req.json();
    const { name } = body;

    // 2. Validate input
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: "Candidate name is required and must be a non-empty string." },
        { status: 400 } // Bad Request
      );
    }

    // 3. Create candidate in the database
    const newCandidate = await prisma.candidate.create({
      data: {
        name: name.trim(), // Trim whitespace from name
        // voteCount and createdAt will use the defaults defined in your schema
      },
    });

    // 4. Return success response
    return NextResponse.json(newCandidate, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Failed to create candidate:", error);

    // Handle specific Prisma errors (like unique constraint violation)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the code for unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "A candidate with this name already exists." },
          { status: 409 } // Conflict
        );
      }
    }

    // Generic server error for other issues
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}