"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const data = {
  tagline: "BARBEARIA DO CANHOTO",
  titleLine1: "ESTILO QUE IMPÕE.",
  titleLine2: "CONFIANÇA QUE FICA.",
  subtitle:
    "Mais que um corte, uma experiência completa pensada para homens que valorizam sua imagem.",
  backgroundImage:
    "https://i.pinimg.com/1200x/17/d2/6a/17d26a30f9d5e1558e772d29ed448c70.jpg",
};

type Props = {
  slug?: string;
};

export default function Premium3Page({ slug }: Props) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isLoggedIn = status === "authenticated" && !!session?.user;
  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const avatarUrl = session?.user?.image;

  return (
    <section className="relative w-full min-h-[600px] lg:h-[100vh] flex items-center bg-stone-950 overflow-hidden select-none">
      {/* Overlay de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('${data.backgroundImage}')`,
          backgroundPosition: "right center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-black/60 lg:hidden block" />
      </div>

      {/* Barra do usuário logado */}
      {status !== "loading" && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-6 py-4">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-stone-200 hover:text-white hover:bg-black/60 transition-all"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#c59b5f] flex items-center justify-center text-xs font-bold text-stone-900 shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{firstName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {firstName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform shrink-0 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-stone-950/90 backdrop-blur-xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  {session.user.isOwner && (
                    <div className="py-1">
                      <Link
                        href="/meu-negocio"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        Painel do Negócio
                      </Link>
                      {slug && (
                        <Link
                          href={`/${slug}/cliente`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4 shrink-0" />
                          Área do Cliente
                        </Link>
                      )}
                    </div>
                  )}
                  <div className="border-t border-white/10 py-1">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-stone-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="border-[#4a3f35] text-stone-200 hover:bg-stone-900/50 hover:text-white text-xs tracking-widest px-4 h-9 bg-black/20 backdrop-blur-sm transition-all rounded-sm"
              >
                ENTRAR
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 max-w-7xl w-full">
        <div className="max-w-2xl flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#c59b5f] text-xs font-bold tracking-[0.3em] uppercase">
              {data.tagline}
            </span>
            <div className="w-12 h-[1px] bg-[#c59b5f]/40" />
          </div>

          <h1 className="font-serif tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white">
            <span className="block font-medium drop-shadow-md">
              {data.titleLine1}
            </span>
          </h1>
          <h1 className="font-serif tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white">
            <span className="block font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#f3e5ab] drop-shadow-md mt-1">
              {data.titleLine2}
            </span>
          </h1>

          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-lg mt-2 leading-relaxed font-light">
            {data.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 w-full sm:w-auto">
            <Link href={slug ? `/${slug}/cliente` : "#"}>
              <Button className="bg-gradient-to-b from-[#b88e4c] to-[#86612d] hover:brightness-110 text-stone-900 border border-[#cfa666]/30 font-semibold tracking-widest text-sm rounded-sm px-6 h-12 transition-all shadow-lg">
                <Calendar className="mr-2 h-4 w-4 stroke-[2.5]" />
                AGENDAR
              </Button>
            </Link>

            <Link
              href={
                isLoggedIn && session.user.isOwner
                  ? "/meu-negocio"
                  : slug
                    ? `/${slug}/cliente`
                    : "#"
              }
            >
              <Button
                variant="outline"
                className="border-[#4a3f35] text-stone-200 hover:bg-stone-900/50 hover:text-white font-semibold tracking-widest text-sm rounded-sm px-6 h-12 bg-black/20 backdrop-blur-sm transition-all"
              >
                <User className="mr-2 h-4 w-4 stroke-[2.5]" />
                {isLoggedIn ? "ACESSAR PAINEL" : "ACESSAR"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
