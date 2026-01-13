"use client";
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
import { useState } from "react";

import Searchbar from "./Searchbar";
import { NavbarMiddleSection } from "./NavMiddleSection";
import { Button } from "@/components/ui/button";

export function NavbarMain() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full m-0">
      <Navbar className="bg-sky-50 m-0 py-0">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />

          <Searchbar />
          <div className="flex justify-center md:justify-start" >
            <NavbarMiddleSection className="bg-inherit" />
          </div>


          <div className="flex items-center gap-4">
            <Button variant="secondary">Login</Button>
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
              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                variant="default"
                className="w-full"
              >
                Login
              </Button>
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


