import { getSession, logout } from "@/lib/authActions";
import { fetchUserStats, updateUserLevel } from "@/models/mediaModel";

const Profile = async () => {
  const userToken = await getSession();
  if (!userToken) return;

  let stats = await fetchUserStats(userToken);
  if (stats.user_exp > 100) {
    stats = await updateUserLevel(userToken);
  }

  if (!stats) return;
  const status = `[${stats.user_exp}%]`;
  return (
    <div className="bg-bg-shade w-full">
      <h1 className="p-4 text-4xl font-bold">Level {stats.user_level}</h1>
      <div className=" m-auto rounded-2xl justify-center w-[90%] h-8 border-2  border-amber-50 ">
        <div className={`m-2 rounded-2xl w-${status} h-3 bg-amber-50`}></div>
      </div>
      <div className="text-2xl text-center">
        <p>Points {stats.user_points}</p>
      </div>
      <div className="flex flex-col md:flex-row text-2xl text-center items-center">
        <div className="m-4 flex bg-stone-800 rounded-4xl">
          <p className="m-4 w-fit">int: {stats.user_int}</p>
          <button
            type="submit"
            className=" w-fit bg-background hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
          >
            +
          </button>
        </div>

        <div className="m-4 flex bg-stone-800 rounded-4xl">
          <p className="m-4 w-fit">dex: {stats.user_dex}</p>
          <button
            type="submit"
            className=" w-fit bg-background hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
          >
            +
          </button>
        </div>
        <div className="m-4 flex bg-stone-800 rounded-4xl">
          <p className="m-4 w-fit">str: {stats.user_str}</p>
          <button
            type="submit"
            className=" w-fit bg-background hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
          >
            +
          </button>
        </div>
      </div>
      <form
        className="flex justify-end"
        action={async () => {
          "use server";
          await logout();
          // redirect('/');
        }}
      >
        <button
          type="submit"
          className="m-4 bg-background hover:bg-stone-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default Profile;
