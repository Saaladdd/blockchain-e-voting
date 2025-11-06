import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPoseidon } from "circomlibjs";
import { calculatePoseidonHash } from "@/lib/zkp-helper";

export async function POST(req: Request) {
  try {
    const { voterId } = await req.json();
    console.log("Voter:",voterId);
    
    const idHash = calculatePoseidonHash(voterId);

    if (!voterId) {
      return NextResponse.json({ error: "Missing voterId" }, { status: 400 });
    }

    const voter = await prisma.voter.findUnique({
      where: { idHash:idHash },
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