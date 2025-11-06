import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import fs from "fs";



export async function POST(req: Request) {
  try {
    const { voterId, candidate, contract } = await req.json();
    console.log("Voter:",voterId);

    if (!voterId) {
      return NextResponse.json({ error: "Missing voterId" }, { status: 400 });
    }

    const voter = await prisma.voter.findUnique({
      where: { idHash:voterId },
    }); 
    console.log(voter);
    if (voter === null) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    try{
        const proof = JSON.parse(fs.readFileSync("../../../../bc/circuits/build/proof.json", "utf8"));
        const publicSignals = JSON.parse(fs.readFileSync("../../../../bc/circuits/build/public.json", "utf8"));
        const a: [bigint, bigint] = [
            BigInt(proof.pi_a[0]),
            BigInt(proof.pi_a[1]),
            ];

        const b: [[bigint, bigint], [bigint, bigint]] = [
            [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
            [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
        ];

        const c: [bigint, bigint] = [
            BigInt(proof.pi_c[0]),
            BigInt(proof.pi_c[1]),
        ];

        const input: [bigint, bigint] = [
            BigInt(publicSignals[0]),
            BigInt(publicSignals[1])
        ];

        try{
            if(!contract){
                return NextResponse.json({ error: "Contract not deployed" }, { status: 500 });
            }
            const tx = contract.vote(candidate, voterId, a, b, c, input);
            console.log("Vote Reciept:", tx);
        }
        catch (error){
            console.error("1",error);
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
    }
    catch (FileNotFoundError) {
      console.error(FileNotFoundError);
      return NextResponse.json({ error: "FileNotFoundError" }, { status: 500 });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}