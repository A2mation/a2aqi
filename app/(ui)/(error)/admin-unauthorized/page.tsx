import { ROLE } from '@/types/type'

import { Unauthorized } from '../components/unauthorized'

export default function AdminUnauthorized() {
    return (
        <>
            <Unauthorized type={ROLE.ADMIN} />
        </>
    )
}
