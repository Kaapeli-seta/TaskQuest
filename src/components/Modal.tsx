"use client";

import CustomError from "@/classes/CustomError";
import { fetchData } from "@/lib/functions";
import { MediaResponse } from "@/types/MessageTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

// this is a Modal for posting a new card/quest
const Modal = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const options = {
        method: "POST",
        body: formData,
      };
      const uploadResult = await fetchData<MediaResponse>(
        "/api/cards",
        options
      );
      if (!uploadResult) {
        throw new CustomError("Erro uploading media", 500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };
  return (
    <div className="fixed inset-0 bg-transparent overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-background">
        <div className="flex flex-col p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-foreground text-sm font-bold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="shadow appearance-none border bg-bg-shade rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-foreground text-sm font-bold mb-2"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                maxLength={150}
                className="shadow appearance-none border bg-bg-shade rounded w-full h-50 py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="public"
                className="mx-4 text-foreground text-sm font-bold mb-2"
              >
                Public
              </label>
              <input type="checkbox" name="public" id="public" />
            </div>
            <label htmlFor="exp" className="text-foreground">
              Choose exp amount:
            </label>
            <select
              id="exp"
              name="exp"
              className="mx-2 p-1 text-foreground bg-bg-shade rounded-2xl"
            >
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
            <div className=" mt-2 flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <Link
              href="/cards"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
