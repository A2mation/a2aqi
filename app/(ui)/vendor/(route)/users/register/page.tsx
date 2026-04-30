"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronLeft, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VendorUserForm } from "./components/vendor-user-form"

const VendorUserRegisterPage = () => {
  const router = useRouter()

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center cursor-pointer gap-1 text-muted-foreground hover:text-primary transition-colors -ml-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Form */}
        <VendorUserForm />

        {/* Warning Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Important Note</h3>
            <p className="text-sm text-red-700">
              Please double-check all information before submitting. As a vendor,
              <strong> you cannot edit or delete user details</strong> once the account has been created.
              Any corrections will require administrative intervention.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VendorUserRegisterPage