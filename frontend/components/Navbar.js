"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="font-bold">SaaS Notes</h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}
