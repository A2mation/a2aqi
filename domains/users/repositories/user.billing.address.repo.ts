import { DB, prisma } from "@/lib/prisma";
import { Address } from "@prisma/client";


export class UserBillingAddressRepository {

    async setPrimaryBillingAddress(userId: string, addressId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                billingAddressId: addressId,
            },
            include: {
                billingAddress: true,
            },
        });
    }

    /**
     * Creates a brand new address and immediately sets it as the user's primary billing address.
     */
    async createAndSetBillingAddress(userId: string, addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
        return prisma.$transaction(async (tx) => {
            // 1. Create the address with strict typing
            const newAddress = await tx.address.create({
                data: {
                    ...addressData,
                    userId
                }
            });

            const addressCount = await tx.address.count({
                where: { userId }
            });

            // 2. Logic for default/billing assignment
            if (addressData.isDefault || addressCount === 1) {
                // Set as Primary Billing link on the User model
                await tx.user.update({
                    where: { id: userId },
                    data: { billingAddressId: newAddress.id }
                });

                // Toggle other addresses to not be default
                await tx.address.updateMany({
                    where: {
                        userId,
                        id: { not: newAddress.id }
                    },
                    data: { isDefault: false }
                });

                // Ensure this specific address is set to default 
                if (!newAddress.isDefault) {
                    return await tx.address.update({
                        where: { id: newAddress.id },
                        data: { isDefault: true }
                    });
                }
            }

            return newAddress;
        });
    }

    /**
    * Updated a address and immediately sets it as the user's primary billing address.
    */
    async updateAddressWithBillingSync(
        addressId: string,
        userId: string,
        data: Partial<Address> & { isDefault?: boolean }
    ): Promise<Address> {
        return prisma.$transaction(async (tx) => {
            // 1. Update the address itself
            const updatedAddress = await tx.address.update({
                where: { id: addressId, userId },
                data: {
                    type: data.type,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    street: data.street,
                    city: data.city,
                    country: "India",
                    state: data.state,
                    zipCode: data.zipCode,
                    isDefault: data.isDefault
                },
            });

            // 2. If this address is now the default, update the User's primary billing pointer
            if (data.isDefault) {
                await tx.user.update({
                    where: { id: userId },
                    data: { billingAddressId: addressId },
                });

                // Set all other user addresses to NOT be default
                await tx.address.updateMany({
                    where: { userId, id: { not: addressId } },
                    data: { isDefault: false },
                });
            }

            return updatedAddress;
        });
    }

    /**
     * Fetches the full billing address details for a specific user.
     */
    async getBillingAddress(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                billingAddress: true,
            },
        });
        return user?.billingAddress || null;
    }

    /**
     * Updates the details of the current billing address.
     * Note: This updates the Address record itself.
     */
    async updateBillingAddressDetails(addressId: string, updateData: Partial<Address>) {
        return prisma.address.update({
            where: { id: addressId },
            data: updateData,
        });
    }

    /**
     * Removes the billing address association from the user.
     * (Does not delete the Address record, just unlinks it).
     */
    async unsetBillingAddress(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                billingAddressId: null,
            },
        });
    }

    /**
     * Retrieves the current Primary Billing Address for a user.
     * This navigates the specific "PrimaryBillingAddress" relation.
     */
    async getPrimaryBillingAddress(userId: string, tx?: DB): Promise<Address | null> {
        const db = tx || prisma;
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                billingAddress: true, // This is the relation "PrimaryBillingAddress"
            },
        });
        return user?.billingAddress || null;
    }

    /**
     * Retrieves ALL addresses associated with a user.
     * Useful for letting a user "Pick from existing addresses" for billing.
     */
    async getAllUserAddresses(userId: string): Promise<Address[]> {
        return prisma.address.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Gets a single address by its ID.
     * Includes an optional check to ensure it belongs to the requesting user.
     */
    async getAddressById(addressId: string, userId?: string): Promise<Address | null> {
        return prisma.address.findFirst({
            where: {
                id: addressId,
                ...(userId && { userId }), // Security: ensures address belongs to user
            },
        });
    }

    /**
     * Retrieves the user's default address (isDefault: true).
     * Often used as a fallback if no specific billing address is set.
     */
    async getDefaultAddress(userId: string, tx?: DB): Promise<Address | null> {
        const db = tx || prisma;
        return db.address.findFirst({
            where: {
                userId: userId,
                isDefault: true,
            },
        });
    }

    /**
     * Delete User Address
     */
    async deleteAddress(userId: string, addressId: string): Promise<void> {
        await prisma.address.delete({
            where: {
                id: addressId,
                userId: userId,
            },
        });
    }
}