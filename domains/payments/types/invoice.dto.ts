export interface BillingAddress {
    billingAddress: {
        email: string | null;
        phoneNumber: string | null;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    } | null
}