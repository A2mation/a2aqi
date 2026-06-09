import type { Dispatch, SetStateAction } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, ShoppingBag } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RightColumn = ({
  quantity,
  product,
  computedTotal,
  setQuantity
}: {
  quantity: number
  product: {
    title: string
    subtitle: string
    basePrice: number
    delivery: string
    image: string
  },
  computedTotal: number
  setQuantity: Dispatch<SetStateAction<number>>
}) => {
  const handleIncrement = () => setQuantity(prev => Math.min(prev + 1, 10))
  const handleDecrement = () => setQuantity(prev => Math.max(prev - 1, 1))

  return (
    <>
      <div className="lg:col-span-1">
        <Card className="border-slate-200 shadow-md bg-white rounded-xl sticky top-6">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-slate-800">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-lg font-bold">Hardware Order Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{product.title}</h4>
                <p className="text-xs text-slate-400">{product.subtitle}</p>
                {/* <p className="text-xs text-amber-600 font-medium">Est: {product.delivery}</p> */}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-xs font-semibold text-slate-600">Device Quantity</span>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-inner p-1 overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Animated Counter Roll Effect */}
                <div className="w-8 text-center text-sm font-bold text-slate-800 relative select-none">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={quantity}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block w-full"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= 10}
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Base Station Subtotal</span>
                <span className="font-medium text-slate-800">
                  ₹{(product.basePrice * quantity).toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping Logistics</span>
                <span className="text-emerald-600 font-medium uppercase text-xs tracking-wide bg-emerald-50 px-2 py-0.5 rounded">Free</span>
              </div>
              <div className="h-px bg-dashed bg-slate-200 my-2" />
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
                <span>Total Due</span>
                <motion.span
                  layout
                  className="text-emerald-600 text-lg font-extrabold"
                >
                  ₹{computedTotal.toLocaleString('en-IN')}.00
                </motion.span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default RightColumn
