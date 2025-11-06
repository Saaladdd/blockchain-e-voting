import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if your prisma client is elsewhere

export async function GET(req: Request) {
  try {
    // 1. Fetch all candidates, selecting only the 'name' field
    const candidates = await prisma.candidate.findMany({
      select: {
        name: true, // Only include the name
      },
    });

    // 2. Extract just the names into an array of strings
    const candidateNames = candidates.map(candidate => candidate.name);

    // 3. Return the list of names
    return NextResponse.json(candidateNames, { status: 200 }); // OK

  } catch (error) {
    console.error("Failed to fetch candidate names:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

// You might need to keep the POST function in the same file if you haven't split them
// export { POST } from './your-post-handler-file'; // If POST is in another file
// OR include the POST function directly in this file if needed.