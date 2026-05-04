export function vendorKey(email: string) {
    return `vendor:temp_vendor:${email}`
}

export function vendorOtpKey(otp: string) {
    return `vendor:otp:${otp}`
}