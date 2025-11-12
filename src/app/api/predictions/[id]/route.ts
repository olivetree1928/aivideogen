import { NextResponse } from "next/server";
import Replicate from "replicate";
export const revalidate = 0
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getReplicate() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  return new Replicate({ auth: token });
}
 
export async function GET(request: Request, {params}: {params: {id: string}}) {
  const { id } = params;
  const replicate = getReplicate();
  if (!replicate) {
    return NextResponse.json({ detail: "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it." }, { status: 500 });
  }
  const prediction = await replicate.predictions.get(id);
 
  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }
 
  return NextResponse.json(prediction);
}