import { ArrowLeft, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-12">
      <Navbar />
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Coins size={27} />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-950">
          Pricing
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-gray-600">
          Credit packages and payment options are coming soon. Each interview
          currently uses 50 credits.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <ArrowLeft size={17} />
          Go back
        </button>
      </section>
    </main>
  );
};

export default Pricing;