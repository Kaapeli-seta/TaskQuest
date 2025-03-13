import PartialCards from "@/components/PartialCards";
import { requireAuth } from "@/lib/authActions";
import Profile from "../components/Profile";

// grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]
export default async function Home() {
  await requireAuth();
  return (
    <div className=" w-full">
      <main className=" mx-auto flex flex-col gap-8 row-start-2 items-center sm:items-start bg-inherit">
        <div className="w-full">
          <PartialCards />
        </div>
      </main>
      <Profile />
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
