"use client";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation'
import { PencilLine } from "lucide-react";


import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Searchbar from "./Searchbar";
import { NavbarMiddleSection } from "./NavMiddleSection";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavbarMain() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-50 w-full m-0">
      <Navbar className="bg-white m-0 py-0">
        {/* Desktop Navigation */}
        <NavBody>
          <div className="flex flex-row items-center gap-4">
            <NavbarLogo />
            <Searchbar />
          </div>

          <div className="flex justify-center md:justify-start" >
            <NavbarMiddleSection className="bg-inherit" />
          </div>


          <div className="flex items-start gap-4">
            {pathname.startsWith('/blog') ? <>
              <Button variant="secondary" className="text-base cursor-pointer" onClick={() => router.push('/blogs/write')}> <PencilLine /> Write </Button>
            </> : <>
              <Link
                href={"/user/sign-in"}
                className={
                  cn(
                    "cursor-pointer",
                    buttonVariants({
                      variant: "secondary"
                    })
                  )
                }
              >
                Sign In
              </Link>
            </>}

            <Button variant="default">Book a call</Button>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center justify-center">
              <Searchbar />
            </div>

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >


            <div className="flex w-full flex-col gap-4">
              <NavbarMiddleSection className="top-10" />

              {pathname.startsWith('/blog') ? <>
                <Button variant="secondary" className="text-base w-full cursor-pointer" onClick={() => router.push('/blogs/write')}> <PencilLine /> Write </Button>
              </> : <>
                <Link
                  href={"/user/sign-in"}
                  className={
                    cn(
                      "cursor-pointer",
                      buttonVariants({
                        variant: "secondary"
                      })
                    )
                  }
                >
                  Sign In
                </Link>
              </>}

              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                variant="default"
                className="w-full"
              >
                Book a call
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* <DummyContent /> */}

      {/* Navbar */}
    </div>
  );
}


