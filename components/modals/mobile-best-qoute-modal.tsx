"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Wind, ShieldCheck, Activity, Phone } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface MobileBestQuoteModalProps {
  isOpen: boolean;
  setIsOpen?: (v: boolean) => void;
}

const MobileBestQuoteModal = ({
  isOpen,
  setIsOpen,
}: MobileBestQuoteModalProps) => {
  const handleOpenChange = (v: boolean) => {
    if (setIsOpen) setIsOpen(v);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none bg-transparent shadow-none">
        <VisuallyHidden.Root>
          <DialogTitle>
            Request Best Quote - a2aqi Industrial Systems
          </DialogTitle>
        </VisuallyHidden.Root>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden rounded-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/10 blur-3xl rounded-full" />

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Get Best Quote
                    </h2>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                      a2aqi Industrial Solutions
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Industry-leading accuracy for your environment. Get a
                    customized quote for our CAAQMS systems today.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <ShieldCheck size={18} className="text-green-500" />
                      <span className="text-sm font-bold">
                        ISO Certified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <Wind size={18} className="text-blue-500" />
                      <span className="text-sm font-bold">
                        Real-time Data
                      </span>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Phone size={14} />
                      <span className="text-sm font-black uppercase tracking-widest">
                        Speak Directly
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {[{ number: "8777353002" }, { number: "7980264700" }].map(
                        (item) => (
                          <div
                            key={item.number}
                            className="flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50"
                          >
                            <div className="flex flex-row gap-x-4">
                              <Phone size={20} className="text-blue-500 mt-0.75" />
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {item.number}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Dismiss */}
                  <Button
                    onClick={() => handleOpenChange(false)}
                    variant={"destructive"}
                    className="w-full py-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Close & Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default MobileBestQuoteModal;
