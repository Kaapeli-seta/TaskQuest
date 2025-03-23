import PartialCards from "@/components/PartialCards";
import { requireAuth } from "@/lib/authActions";
import Profile from "../components/Profile";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  // Checks if the user is loged in
  await requireAuth();
  return (
    <div className=" w-full">
      <main className=" mx-auto flex flex-col gap-8 row-start-2 items-center sm:items-start bg-inherit">
        <div className="w-full">
          {/* displays chosen cards */}
          <PartialCards />
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Profile>
          <LogoutButton />
        </Profile>
      </footer>
    </div>
  );
}
