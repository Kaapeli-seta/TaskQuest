import { getSession } from "@/lib/authActions";
import { fetchOwnerMedia } from "@/models/mediaModel";

const CardList = async () => {
  const userToken = await getSession();
  if (!userToken) return;
  const mediaList = await fetchOwnerMedia(userToken);
  if (!mediaList) {
    return <p>No media found</p>;
  }

  return (
    <section className="flex flex-col p-8 bg-inherit">
      <div className="grid grid-cols-3 gap-4 bg-inherit">
        {mediaList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center border border-gray-300 p-4 shadow-lg rounded-md bg-inherit text-white"
          >
            <h3 className="text-lg font-bold self-start">{item.title}</h3>
            <p>Description: {item.quest_text}</p>
            <p>
              {item.reward_type}: {item.reward_count}
            </p>
            <p>Date: {new Date(item.created_at).toLocaleDateString("fi-FI")}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardList;
