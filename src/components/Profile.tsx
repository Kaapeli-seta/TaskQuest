"use client";

import CustomError from "@/classes/CustomError";
import { fetchData } from "@/lib/functions";
import { switcher } from "@/lib/switch";
import { UserStats } from "@/types/DBTypes";
import { useEffect, useState } from "react";

const Profile = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const statsResult = await fetchData<UserStats>("/api/stats", {
          method: "GET",
        });
        if (!statsResult) {
          throw new CustomError("Erro uploading media", 500);
        }
        setStats(statsResult);
      } catch (error) {
        console.error(error);
      }
    };
    getStats();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPoints = async (evt: any) => {
    try {
      const statsResult = await fetchData<UserStats>("/api/stats", {
        method: "PUT",
        body: evt.target.value,
      });
      if (!statsResult) {
        throw new CustomError("Erro uploading media", 500);
      }
      setStats(statsResult);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return;

  // Tailwind does not support asyncronous varibles for some reason
  const state = switcher(stats);
  return (
    <div className="bg-bg-shade w-full">
      <h1 className="p-4 text-4xl font-bold">Level {stats.user_level}</h1>
      <div className=" m-auto rounded-2xl justify-center w-[90%] h-8 border-2  border-amber-50 ">
        <div className={`m-2 rounded-2xl ${state} h-3 bg-amber-50`}></div>
      </div>
      <div className="text-2xl text-center">
        <p>Points {stats.user_points}</p>
      </div>
      <div className="flex flex-col md:flex-row text-2xl text-center items-center">
        <div className="m-4 flex shadow-lg shadow-regal-blue rounded-4xl">
          <p className="m-4 w-fit">Int: {stats.user_int}</p>
          <button
            type="submit"
            value="int"
            className=" w-fit bg-background hover:bg-bg-darker text-foreground font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
            onClick={setPoints}
          >
            +
          </button>
        </div>

        <div className="m-4 flex shadow-lg shadow-regal-blue rounded-4xl">
          <p className="m-4 w-fit">Dex: {stats.user_dex}</p>
          <button
            type="submit"
            value="dex"
            className=" w-fit bg-background hover:bg-bg-darker text-foreground  font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
            onClick={setPoints}
          >
            +
          </button>
        </div>
        <div className="m-4 flex shadow-lg shadow-regal-blue rounded-4xl">
          <p className="m-4 w-fit">Str: {stats.user_str}</p>
          <button
            type="submit"
            value="str"
            className=" w-fit bg-background hover:bg-bg-darker text-foreground font-bold py-2 px-4 rounded-r-2xl focus:outline-none focus:shadow-outline"
            onClick={setPoints}
          >
            +
          </button>
        </div>
      </div>
      {/* logout button is a server element so it is passed as a child element*/}
      {children}
    </div>
  );
};

export default Profile;
