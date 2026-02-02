"use client";
import { useAuth } from "@/context/AuthContext";
import { IconMenu3, IconSchool, IconSettings } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { NAVLINKS } from "./navlink";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

export default function Navbar({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    applyTheme(storedTheme);
  }, []);
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const handleThemeChange = (theme: string) => {
    applyTheme(theme);
  };

  const handleLogout = async () => {
    toast.promise(axios.get("/api/auth/logout"), {
      loading: "Logging out...",
      success: () => {
        router.push("/");
        return "Logged out successfully";
      },
      error: "Error logging out",
    });
  };
  return (
    <>
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle hidden"
        />
        <div className="drawer-content">
          <div className="navbar bg-base-300 shadow-sm h-20 lg:px-10">
            <div className="navbar-start">
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <IconMenu3 size={24} />
                </div>
                <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  {NAVLINKS.map((link) =>
                    link.children ? (
                      <li key={link.title} className="text-base">
                        <details>
                          <summary>{link.title}</summary>
                          <ul className="p-2 w-full">
                            {link.children.map((child) => (
                              <li key={child.title} className="w-32">
                                <Link href={child.href}>{child.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ) : (
                      <li key={link.title}>
                        <Link href={link.href}>{link.title}</Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <Link
                href={`/${user?.role}/dashboard`}
                className="space-x-3 flex items-center hover:transform-3d"
              >
                <IconSchool size={50} className="text-neutral" />
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-[2px]">
                    <span className="text-primary font-extrabold text-xl">
                      Vidya
                    </span>
                    <span className="text-accent font-semibold text-xl">
                      Rakshak
                    </span>
                  </div>
                  <hr className="w-full border border-base-content hidden lg:block" />
                  <span className="text-sm text-base-content/70 italic hidden lg:block">
                    SPVP's SB Patil College, Indapur
                  </span>
                </div>
              </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 text-base fond-semibold">
                {NAVLINKS.map((link) =>
                  link.children ? (
                    <li key={link.title}>
                      <details>
                        <summary>{link.title}</summary>
                        <ul className="p-2 z-10 w-52">
                          {link.children.map((child) => (
                            <li key={child.title}>
                              <Link href={child.href}>{child.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={link.title}>
                      <Link href={link.href}>{link.title}</Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="navbar-end">
              <div className="block">
                <ul className="menu menu-horizontal flex items-center space-x-4">
                  <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                    <Image
                      src={user?.profileImage!}
                      alt="Avatar"
                      className="rounded-full h-16 w-16 object-cover avatar-online border-2 border-primary"
                      width={55}
                      height={55}
                      tabIndex={0}
                      role="button"
                    />
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-72 p-2 shadow"
                    >
                      {/* User Initial */}
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                          {user?.name[0].toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-lg font-semibold text-base-content">
                          {user?.name}
                        </span>
                      </div>
                      <hr className="my-2 border-base-content" />
                      <div className="flex flex-col">
                        <Link
                          className="text-left px-4 py-2 text-base-content hover:bg-base-200 transition duration-200"
                          href={`/${user?.role}/settings`}
                        >
                          My Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="text-left px-4 py-2 text-base-content text-dark hover:bg-base-200 transition duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </ul>
                  </div>
                </ul>
              </div>
            </div>
          </div>
          {children}
          <div className="fab">
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button"
            >
              <IconSettings size={24} className="animate-spin" />
            </label>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-100 space-y-3 text-base-content min-h-full w-80 p-4">
            <p className="font-bold text-xl text-center mb-4">Change Theme</p>
            {themes.sort().map((theme) => (
              <li key={theme} className="w-full">
                <div
                  className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline-2 outline-offset-2 outline-transparent w-full"
                  onClick={() => handleThemeChange(theme)}
                  role="button"
                >
                  <div
                    className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                    data-theme={theme}
                  >
                    <div className="grid grid-cols-6 grid-rows-3">
                      <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{" "}
                      <div className="bg-base-300 col-start-1 row-start-3"></div>{" "}
                      <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div className="font-bold capitalize">{theme}</div>{" "}
                        <div className="flex flex-wrap gap-1">
                          <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-primary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-secondary-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-accent-content text-sm font-bold">
                              A
                            </div>
                          </div>{" "}
                          <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div className="text-neutral-content text-sm font-bold">
                              A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
