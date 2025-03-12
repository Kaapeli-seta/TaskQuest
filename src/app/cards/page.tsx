import CardList from "@/components/CardList";
import Modal from "@/components/Modal";
import { requireAuth } from "@/lib/authActions";

type SearchParamProps = {
  searchParams: Promise<{ show: string }>;
};

const Cards = async ({ searchParams }: SearchParamProps) => {
  const { show } = await searchParams;
  await requireAuth();
  return (
    <main>
      <h1 className="text-4xl font-bold">Cards</h1>
      <CardList />
      {show && <Modal />}
    </main>
  );
};

export default Cards;
