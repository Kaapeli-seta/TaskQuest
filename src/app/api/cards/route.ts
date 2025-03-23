import { getSession } from "@/lib/authActions";
import { postCard } from "@/models/mediaModel";
import { MediaResponse } from "@/types/MessageTypes";
import { NextRequest, NextResponse } from "next/server";

// Posts a new card/quest
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userToken = await getSession();
    if (!userToken) return;
    const postResult = await postCard(formData, userToken);

    const uploadResponse: MediaResponse = {
      message: "Media added to database",
      media: postResult,
    };

    return new NextResponse(JSON.stringify(uploadResponse), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error((error as Error).message, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
}
