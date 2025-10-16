import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { fullName, dateOfBirth, otp, phoneNumber} = await req.json();

    if (!fullName || !dateOfBirth || !otp || !phoneNumber) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    console.log("Voter:",fullName, dateOfBirth, otp, phoneNumber);

    const voter = await prisma.voter.findFirst({
      where: { name: fullName,
                dob: {
                    gte: new Date(dateOfBirth + "T00:00:00.000Z"),
                    lt: new Date(dateOfBirth + "T23:59:59.999Z"),
                },
                otp: parseInt(otp,10),
                phone: phoneNumber
       },
    }); 
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