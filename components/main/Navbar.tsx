import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Navbar = () => {
  const connectWalletHandler = () => {};

  return (
    <nav className="bg-slate-200 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/web3dev.svg"
              alt="Logo"
              className="h-8"
              width={28}
              height={28}
            />
          </Link>
        </div>

        {/* Link */}
        <div>
          <Separator orientation="vertical" />
          <Link href="/" className="text-black hover:text-slate-600">
            Rank
          </Link>
          <Separator orientation="vertical" />
        </div>

        {/* Botão */}
        <div>
          <Button className="bg-slate-800 hover:bg-slate-600 p-4 rounded text-white">
          Conectar Carteira
          </Button>
        </div>
      </div>
    </nav>
  );
};
