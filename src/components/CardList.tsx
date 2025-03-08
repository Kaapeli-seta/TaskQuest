import { getSession } from "@/lib/authActions";
import { fetchOwnerMedia } from "@/models/mediaModel";

import Link from "next/link";

const CardList = async () => {
  const userToken = await getSession();
  if (!userToken) return;
  const mediaList = await fetchOwnerMedia(userToken);

  const stated =
    "flex flex-col justify-between transition p-4 shadow-lg shadow-regal-blue rounded-md bg-background hover:scale-110 hover:cursor-grab active:cursor-grabbing text-inherit w-fit max-w-80 min-h-110";

  const statea = "";

  return (
    <section className="flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
        {mediaList.map((item, index) => (
          <div
            draggable="true"
            key={index}
            className={item.is_done ? stated : stated}
          >
            <h3 className="text-lg font-bold self-center">{item.title}</h3>
            <p className="text-center">{item.quest_text}</p>
            <div className="flex justify-between">
              <p>
                {item.reward_type}: {item.reward_count}
              </p>
              <p>
                Date: {new Date(item.created_at).toLocaleDateString("fi-FI")}
              </p>
            </div>
          </div>
        ))}
        <div className="flex border-6 border-dashed transition p-4 rounded-md bg-transparent hover:scale-103 hover:cursor-pointer text-inherit w-fit min-w-75 max-w-80 min-h-105">
          <Link
            href="/cards/?show=true"
            className="text-center flex-auto text-5xl h-full leading-95"
          >
            +
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CardList;
