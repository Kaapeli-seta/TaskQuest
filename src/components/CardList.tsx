import { getSession } from "@/lib/authActions";
import { fetchOwnerMedia } from "@/models/mediaModel";
import { cardComplete, cardStyle } from "@/styles/style";

import Link from "next/link";

const CardList = async () => {
  const userToken = await getSession();
  if (!userToken) return;
  const mediaList = await fetchOwnerMedia(userToken);

  return (
    <section className="flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
        {mediaList.map((item, index) => (
          <div
            draggable="true"
            tabIndex={item.is_done ? 2 : 1}
            key={index}
            className={item.is_done ? cardComplete : cardStyle}
          >
            <h3 className="text-lg font-bold self-center p-4">{item.title}</h3>
            <p className=" m-4 text-center break-all p-4 border-2 rounded-2xl border-foreground-opose">
              {item.quest_text}
            </p>
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
        <div className="flex border-6 border-dashed transition rounded-md bg-transparent hover:scale-103 hover:cursor-pointer text-inherit w-fit min-w-75 max-w-80 min-h-105">
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
