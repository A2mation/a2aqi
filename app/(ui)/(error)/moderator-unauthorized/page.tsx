import { ROLE } from '@/types/type'

import { Unauthorized } from '../components/unauthorized'

export default function moderatorUnauthorized() {
    return (
        <>
            <Unauthorized type={ROLE.MODERATOR} />
        </>
    )
}
