export function calculateDiscount(amount: number, coupon: any) {

    if (coupon.discountType === "PERCENTAGE") {

        const discount = (amount * coupon.discountValue) / 100

        return Math.min(discount, amount)
    }

    if (coupon.discountType === "FIXED") {

        return Math.min(coupon.discountValue, amount)
    }

    return 0
}