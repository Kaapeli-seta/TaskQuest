import { getSession } from "@/lib/authActions";
import {
  fetchOwnerSelectedMedia,
  fetchOwnerUncompleteMedia,
  updateCardSelect,
} from "@/models/mediaModel";
import { cardStyle } from "@/styles/style";
import Link from "next/link";
import React from "react";

const PartialCards = async () => {
  const userToken = await getSession();
  if (!userToken) return;
  const selectedCards = await fetchOwnerSelectedMedia(userToken);
  if (selectedCards.length < 3) {
    const cardList = await fetchOwnerUncompleteMedia(userToken);
    const randomizeArray = [...cardList].sort(() => 0.5 - Math.random());
    console.log("something");
    updateCardSelect(randomizeArray[0]);
    selectedCards.push(randomizeArray[0]);
  }

  return (
    <section className="flex flex-col p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
        {selectedCards.map((item, index) => (
          <div draggable="true" tabIndex={1} key={index} className={cardStyle}>
            <h3 className="text-lg font-bold self-center p-4">{item.title}</h3>
            <p className="text-center p-4">{item.quest_text}</p>
            <div className="flex justify-between p-4">
              <p>
                {item.reward_type}: {item.reward_count}
              </p>
              <p>
                Date: {new Date(item.created_at).toLocaleDateString("fi-FI")}
              </p>
            </div>
          </div>
        ))}
        <div className="flex flex-col justify-between transition shadow-lg shadow-regal-blue rounded-3xl bg-background hover:scale-110 border-double border-l-10 border-bg-shade text-inherit w-fit min-w-80 max-w-80 min-h-105">
          <div className="flex flex-col justify-between transition shadow-lg shadow-regal-blue rounded-3xl bg-background hover:scale-110 border-double border-l-10 border-b-5 border-bg-shade text-inherit h-full">
            <Link
              href="/cards"
              className="text-center flex-auto text-3xl h-full leading-95"
            >
              All cards
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartialCards;
