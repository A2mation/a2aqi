"use client";

import { useState } from "react";

import MobileBestQuoteModal from "@/components/modals/mobile-best-qoute-modal";
import MainDashboardShowcase from "@/components/aqi-ui/Dashboard-Showcase";
import UserDashboardPreview from "@/components/aqi-ui/User-Dashboard-Preview";

import Headers from "./components/Headers";
import Footer from "./components/Footer";
import ProductCard from "./components/Product-Card";
import CalibrationDashboard from "./components/CalibrationDashboard";





const ProductListingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen mt-5 pt-2 bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
      <main className="px-6 py-16">
        {/* HEADER SECTION */}
        <Headers />

        {/* PRODUCT GRID */}
        <ProductCard setIsModalOpen={setIsModalOpen} />

        {/* USER DASHBOARD PREVIEW */}
        <UserDashboardPreview />

        {/* USER DASHBOARD FEATURES SHOWCASE */}
        <MainDashboardShowcase />

        {/* CALIBRATION DASHBOARD FEATURES SHOWCASE */}
        <CalibrationDashboard />

        {/* BOTTOM INFO CARD */}
        <Footer setIsModalOpen={setIsModalOpen} />
      </main>

      <MobileBestQuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default ProductListingPage;
