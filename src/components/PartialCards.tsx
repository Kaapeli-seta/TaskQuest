"use client";
import CustomError from "@/classes/CustomError";
import { fetchData } from "@/lib/functions";
import {
  cardStack_bottom,
  cardStack_midel,
  cardStack_top,
  cardStyle,
} from "@/styles/style";
import { QuestItem } from "@/types/DBTypes";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PartialCards = () => {
  const [selectedCards, setSelectedCards] = useState<QuestItem[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completeCard = async (evt: any) => {
    try {
      // Returns cards that have been chosen as selected.
      // If there are les than 3 cards adds random one if availabe
      const statsResult = await fetchData<QuestItem[]>("/api/partialcards", {
        method: "PUT",
        body: evt.target.value,
      });
      if (!statsResult) {
        throw new CustomError("Erro uploading media", 500);
      }
      // Updates shown cards
      setSelectedCards(statsResult);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCards = async () => {
      try {
        const statsResult = await fetchData<QuestItem[]>("/api/partialcards", {
          method: "GET",
        });

        if (!statsResult) {
          throw new CustomError("Erro uploading media", 500);
        }
        // Updates shown cards
        setSelectedCards(statsResult);
      } catch (error) {
        console.error(error);
      }
    };
    getCards();
  }, []);
  return (
    <section className="flex flex-col p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
        {selectedCards.map((item, index) => (
          <div draggable="true" tabIndex={1} key={index} className={cardStyle}>
            <h3 className="text-lg font-bold self-center p-4">{item.title}</h3>
            <p className="m-4 text-center break-all p-4 border-2 rounded-2xl border-foreground-opose">
              {item.quest_text}
            </p>
            <div className="flex flex-col p-4">
              <button
                type="submit"
                value={`${item.quest_id} ${item.reward_count}`}
                className="m-4 bg-background shadow-lg shadow-regal-blue hover:bg-bg-darker text-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={completeCard}
              >
                Complete <FontAwesomeIcon icon={faCheck} size="1x" />
              </button>

              <div className="flex justify-between p-4">
                <p>
                  {item.reward_type}: {item.reward_count}
                </p>
                <p>
                  Date: {new Date(item.created_at).toLocaleDateString("fi-FI")}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className={cardStack_bottom}>
          <div className={cardStack_midel}>
            <div className={cardStack_top}>
              <Link
                href="/cards"
                className="text-center flex-auto text-3xl h-full leading-95"
              >
                All cards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartialCards;
