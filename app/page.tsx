import { Categories } from "@/components/Categories/Categories";
import { Products } from "@/components/Products/Products";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Products />
    </section>
  );
}
