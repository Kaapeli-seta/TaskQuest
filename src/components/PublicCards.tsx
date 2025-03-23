import { fetchPublicMedia } from "@/models/mediaModel";
import { cardStyle } from "@/styles/style";

const PublicCards = async () => {
  const mediaList = await fetchPublicMedia();

  return (
    <section className="flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
        {mediaList.map((item, index) => (
          <div draggable="true" tabIndex={1} key={index} className={cardStyle}>
            <div className="self-center p-4">
              <h2 className="text-sm font-bold text-center p-4">
                {item.username}
              </h2>
              <h3 className="text-lg font-bold text-center p-4">
                {item.title}
              </h3>
            </div>
            <p className="m-4 text-center break-all p-4 border-2 rounded-2xl border-foreground-opose">
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
      </div>
    </section>
  );
};

export default PublicCards;
