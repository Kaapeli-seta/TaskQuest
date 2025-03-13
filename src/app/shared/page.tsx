import PublicCards from "@/components/PublicCards";
import { requireAuth } from "@/lib/authActions";

const Shared = async () => {
  await requireAuth();
  return (
    <main>
      <PublicCards />
    </main>
  );
};

export default Shared;
