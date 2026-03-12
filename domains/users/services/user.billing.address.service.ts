import { Address } from '@prisma/client';
import { UserBillingAddressRepository } from '../repositories/user.billing.address.repo';
import { DB, prisma } from '@/lib/prisma';

export class UserBillingAddressService {
    private repo: UserBillingAddressRepository;

    constructor() {
        this.repo = new UserBillingAddressRepository();
    }

    /**
     * Logic: Get the specific billing address. 
     * Fallback: If no billing address is set, return the 'isDefault' address.
     */
    async getEffectiveBillingAddress(userId: string): Promise<Address | null> {
        const primaryBilling = await this.repo.getPrimaryBillingAddress(userId);

        if (primaryBilling) return primaryBilling;

        // Fallback to the default address if the user hasn't picked a specific billing one
        return this.repo.getDefaultAddress(userId);
    }

    /**
     * Logic: Sets an address as the primary billing address.
     * Optional: Can also mark it as the 'isDefault' address for the whole profile.
     */
    async updateBillingSelection(userId: string, addressId: string, markAsDefault: boolean = false) {
        const address = await this.repo.getAddressById(addressId, userId);

        if (!address) {
            throw new Error("Address not found or does not belong to user.");
        }

        if (markAsDefault) {
            // You might need a method in repo to reset other defaults first
            await this.repo.updateBillingAddressDetails(addressId, { isDefault: true });
        }

        return this.repo.setPrimaryBillingAddress(userId, addressId);
    }

    async updateAddress(userId: string, addressId: string, data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt" | "country">) {
        // You can add business rules here (e.g., preventing updates to addresses linked to old invoices)
        return this.repo.updateAddressWithBillingSync(addressId, userId, data);
    }

    /**
     * Logic: Create a brand new address and immediately make it the billing address.
     */
    async addNewBillingAddress(userId: string, data: any) {
        // Basic validation or transformation can happen here
        return this.repo.createAndSetBillingAddress(userId, data);
    }

    /**
     * Logic: Lists all addresses but flags which one is currently the billing address.
     */
    async getUserAddressBook(userId: string) {
        const [allAddresses, billingAddress] = await Promise.all([
            this.repo.getAllUserAddresses(userId),
            this.repo.getPrimaryBillingAddress(userId)
        ]);

        return allAddresses.map(addr => ({
            ...addr,
            isBilling: addr.id === billingAddress?.id
        }));
    }

    /**
     * Logic: Get only the Primary Billing address
     */
    async getPrimaryBillingAddress(userId: string, tx?: DB) {
        return this.repo.getPrimaryBillingAddress(userId, tx);
    }

    /**
     * Logic: Delete User address
     */
    async removeAddress(userId: string, addressId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { billingAddressId: true }
        });

        if (user?.billingAddressId === addressId) {
            throw new Error("Cannot delete primary billing address. Set another address as default first.");
        }

        return this.repo.deleteAddress(userId, addressId);
    }
}