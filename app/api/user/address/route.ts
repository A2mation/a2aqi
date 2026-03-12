import { userGuard } from "@/lib/userAuth";
import { UserBillingAddressController } from "@/domains/users/controllers/user.billing.address.controller";


const controller = new UserBillingAddressController();

export async function POST(req: Request) {
    const { user } = await userGuard();
    const body = await req.json();

    return controller.createAddress(user.id, body);
}

export async function GET(req: Request) {
    const { user } = await userGuard();

    return controller.getAddressBook(user.id);
}