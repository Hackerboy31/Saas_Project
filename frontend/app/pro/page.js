"use client";
import { useRouter } from "next/navigation";

export default function ProPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Upgrade to Pro </h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
        You’ve reached the FREE plan limit of <strong>3 notes</strong>.  
        Unlock unlimited notes, premium features, and more by upgrading to Pro.
      </p>
      <button
        onClick={() => alert("Payment integration goes here!")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md"
      >
        Upgrade Now
      </button>

      <button
        onClick={() => router.push("/notes")}
        className="mt-4 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Notes
      </button>
    </div>
  );
}
