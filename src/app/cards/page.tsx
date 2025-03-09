import CardList from "@/components/CardList";
import Modal from "@/components/Modal";

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};

const Cards = async ({ searchParams }: SearchParamProps) => {
  const { show } = await searchParams;
  return (
    <main>
      <h1 className="text-4xl font-bold">Cards</h1>
      <CardList />
      {show && <Modal />}
    </main>
  );
};

export default Cards;
