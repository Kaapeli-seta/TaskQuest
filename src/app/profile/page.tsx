import { getSession, logout, requireAuth } from "@/lib/authActions";
import { fetchUserStats } from "@/models/mediaModel";

const Profile = async () => {
  await requireAuth();
  const userToken = await getSession();
  if (!userToken) return;
  const stats = await fetchUserStats(userToken);

  return (
    <main className="bg-bg-shade">
      <h1 className="m-4 text-4xl font-bold">Profile</h1>
      <h2 className="m-4 text-4xl font-bold">Level {stats.user_level}</h2>
      <div className=" m-auto justify-center w-[90%] h-8 border-2 border-amber-50 ">
        <div className={`m-2 w-[${stats.user_exp / 1}%] h-3 bg-amber-50`}></div>
      </div>
      <div className="text-2xl text-center">
        <p>Points {stats.user_points}</p>
      </div>
      <div className="flex flex-col md:flex-row text-2xl text-center">
        <p className="m-4 w-fit">int: {stats.user_int}</p>
        <button
          type="submit"
          className="m-4 w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          +
        </button>
        <p className="m-4 w-fit">dex: {stats.user_dex}</p>
        <button
          type="submit"
          className="m-4 w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          +
        </button>
        <p className="m-4 w-fit">str: {stats.user_str}</p>
        <button
          type="submit"
          className="m-4 w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          +
        </button>
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
          className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </form>
    </main>
  );
};

export default Profile;
