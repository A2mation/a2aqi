import { getAuthSession } from "@/auth";
import { ROLE } from "@/types/type";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await getAuthSession();

    if (session?.user && (session?.user.role === ROLE.USER)) {
        redirect("/user/dashboard");
    }
    return (
        <>
            {children}
        </>
    );
}