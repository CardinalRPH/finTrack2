'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-slate-400 hover:text-white"
        >
          Logout
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 p-0.5">
          <img
            src={session.user?.image ?? ""}
            alt="Avatar"
            className="rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-bold transition-colors"
    >
      <FaDiscord className="text-indigo-400" />
      Log In
    </button>
  );
}