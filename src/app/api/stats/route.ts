import { getSession } from "@/lib/authActions";
import {
  fetchUserStats,
  updateUserLevel,
  updateUserStats,
} from "@/models/mediaModel";
import { NextRequest, NextResponse } from "next/server";

// Updates user level when exp is 100
export async function GET() {
  try {
    const userToken = await getSession();
    if (!userToken) return;
    let stats = await fetchUserStats(userToken);
    if (stats.user_exp > 100) {
      stats = await updateUserLevel(userToken);
    }
    return new NextResponse(JSON.stringify(stats), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error((error as Error).message, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

// Updates user stats
export async function PUT(request: NextRequest) {
  try {
    const val = await request.text();
    const userToken = await getSession();
    if (!userToken) return;
    let stats = await fetchUserStats(userToken);
    if (stats.user_points > 0) {
      stats = await updateUserStats(userToken, val);
    }

    return new NextResponse(JSON.stringify(stats), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error((error as Error).message, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
}
