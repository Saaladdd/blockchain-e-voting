import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import hashid from "@/scripts/hashId"



export async function POST(req: Request) {
  try {
    console.log(req.json);
    const {fullName, voterId, otp, phoneNumber } = await req.json();
    console.log("Voter:",voterId);
    
    const idHash = await hashid(String(voterId));

    if (!voterId) {
      return NextResponse.json({ error: "Missing voterId" }, { status: 400 });
    }

    const voter = await prisma.voter.findUnique({
      where: { idHash:idHash, name: fullName},
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