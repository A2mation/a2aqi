import { NextResponse } from "next/server";

import { addressSchema } from "@/lib/validation/UserAddressSchema";
import { UserBillingAddressService } from "../services/user.billing.address.service";

export class UserBillingAddressController {
    private service: UserBillingAddressService;

    constructor() {
        this.service = new UserBillingAddressService();
    }

    async createAddress(userId: string, body: any) {
        // 1. Validation
        const validation = addressSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        try {
            // 2. Transformation & Service Call
            const { isDefault, ...addressData } = validation.data;

            const newAddress = await this.service.addNewBillingAddress(userId, {
                ...addressData,
                isDefault: !!isDefault,
                country: "India",
            });

            return NextResponse.json(newAddress, { status: 201 });
        } catch (error: any) {
            console.error("[CONTROLLER_CREATE_ADDRESS_ERROR]", error);
            return NextResponse.json(
                { message: error.message || "Failed to create address" },
                { status: 500 }
            );
        }
    }

    async getAddressBook(userId: string) {
        try {
            const addresses = await this.service.getUserAddressBook(userId);
            return NextResponse.json(addresses, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    async patchAddress(userId: string, addressId: string, body: any) {
        const validation = addressSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.flatten().fieldErrors, { status: 400 });
        }

        try {
            const updated = await this.service.updateAddress(userId, addressId, validation.data);
            return NextResponse.json(updated, { status: 200 });
        } catch (error: any) {
            console.error("[CONTROLLER_PATCH_ADDRESS]", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    async deleteAddress(userId: string, addressId: string) {
        try {

            await this.service.removeAddress(userId, addressId);
            return new NextResponse(null, { status: 204 });

        } catch (error: any) {
            console.error("[CONTROLLER_DELETE_ADDRESS]", error);

            const isClientError = error.message.includes("Cannot delete");
            return NextResponse.json(
                { message: error.message || "Internal Error" },
                { status: isClientError ? 400 : 500 }
            );
        }
    }
}