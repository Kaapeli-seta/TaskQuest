import PartialCards from "@/components/PartialCards";
import { requireAuth } from "@/lib/authActions";
import Profile from "./profile/page";

// grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]
export default async function Home() {
  await requireAuth();
  return (
    <div className="flex flex-col-reverse">
      <Profile />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-inherit">
        <div>
          <PartialCards />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
