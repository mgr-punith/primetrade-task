"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface NavbarProps {
  username: string;
  role: string;
}

export default function Navbar({ username, role }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/");
  };

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-lg tracking-widest uppercase">
          PrimeTrade
        </span>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 uppercase tracking-wider">
          {role}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">Welcome, {username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
