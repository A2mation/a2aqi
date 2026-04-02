"use client";
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";



const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {

  const [isScrolled, setIsScrolled] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      setIsScrolled(el.scrollTop > 10);
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.div
        transition={{ duration: 0.3 }}
        className={cn(
          "group flex flex-col italic gap-0.5 cursor-pointer text-lg md:text-xl font-bold text-black hover:opacity-[0.9] dark:text-white",
          isScrolled ? "text-blue-400" : "text-black"
        )}
      >
        {item}
        <div
          className={cn(
            "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
            "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
          )}
        />
      </motion.div>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%+1.2rem)] md:top-[calc(100%+0.5rem)] z-50 left-[53%] transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black rounded-2xl backdrop-blur-sm overflow-hidden border border-black/20 dark:border-white/20 shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full md:w-1/2 flex flex-col md:flex-row mx-auto border border-transparent dark:bg-black dark:border-white/20 bg-inherit shadow-input justify-start md:justify-center space-x-4 px-0 py-3 gap-0 md:gap-8"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  // description,
  href,
  src,
  onclick
}: {
  title: string;
  // description: string;
  href: string;
  src: string;
  onclick?: () => void
}) => {
  return (
    <Link
      href={href}
      className="flex items-center italic space-x-2 bg-blue-200 hover:bg-blue-300 border border-blue-600  p-4 rounded-2xl"
      onClick={onclick}
    >
      <img
        src={src}
        alt={title}
        className="shrink-0 h-20 w-20 rounded-full shadow-2xl "
      />
      <div>
        <h4 className="text-xl font-bold italic mb-1 text-black dark:text-white">
          {title}
        </h4>

      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </Link>
  );
};
