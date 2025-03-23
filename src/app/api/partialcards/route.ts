import { getSession } from "@/lib/authActions";
import {
  fetchOwnerSelectedMedia,
  fetchOwnerUncompleteMedia,
  updateCardById,
  updateCardSelect,
  updateUserExp,
} from "@/models/mediaModel";
import { NextRequest, NextResponse } from "next/server";

// gets the 3 cards/quests marked as selected
// if there are les than 3 adds new randomly selected cards/quest if available
export async function GET() {
  try {
    const userToken = await getSession();
    if (!userToken) return;
    const selectedCards = await fetchOwnerSelectedMedia(userToken);
    if (selectedCards.length < 3) {
      const cardList = await fetchOwnerUncompleteMedia(userToken);
      if (cardList.length != 0) {
        const randomizeArray = [...cardList].sort(() => 0.5 - Math.random());
        updateCardSelect(randomizeArray[0]);
        selectedCards.push(randomizeArray[0]);
      }
    }
    return new NextResponse(JSON.stringify(selectedCards), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error((error as Error).message, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
}

// Updates card completion status and ads new card
export async function PUT(request: NextRequest) {
  try {
    const val = await request.text();
    const values = val.split(" ");
    const userToken = await getSession();
    if (!userToken) return;
    updateCardById(parseInt(values[0]));
    // adds user exp based on set exp
    updateUserExp(userToken, parseInt(values[1]));
    const selectedCards = await fetchOwnerSelectedMedia(userToken);
    if (selectedCards.length < 3) {
      const cardList = await fetchOwnerUncompleteMedia(userToken);
      if (cardList.length != 0) {
        const randomizeArray = [...cardList].sort(() => 0.5 - Math.random());
        updateCardSelect(randomizeArray[0]);
        selectedCards.push(randomizeArray[0]);
      }
    }
    return new NextResponse(JSON.stringify(selectedCards), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error((error as Error).message, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
}
