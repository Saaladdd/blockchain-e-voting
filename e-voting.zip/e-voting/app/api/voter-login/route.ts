import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { voterId } = await req.json();
    console.log("Voter:",voterId);

    if (!voterId) {
      return NextResponse.json({ error: "Missing voterId" }, { status: 400 });
    }

    const voter = await prisma.voter.findUnique({
      where: { voter_id:voterId },
    }); 
    console.log(voter);
    if (voter === null) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    else
      return NextResponse.json({ exists: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}