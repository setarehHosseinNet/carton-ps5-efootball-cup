"use client";
import NavClient from "@/components/NavClient";

export default function ClientShell({ loggedIn = false }: { loggedIn?: boolean }) {
  return <NavClient loggedIn={loggedIn} />;
}
