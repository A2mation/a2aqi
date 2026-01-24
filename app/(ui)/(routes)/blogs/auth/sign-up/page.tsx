'use client'

import { BlogLoginCard, BLOGPAGEAUTHTYPE } from '@/app/(ui)/(routes)/blogs/auth/components/Blog-Login-card'

const SignUpPage = () => {
    return (
        <section className='min-h-screen'>
            <div className='max-w-7xl mx-auto '>
                <div className='flex items-center justify-center h-screen'>
                    <BlogLoginCard title='Sign Up' desc='Create a new blog account' type={BLOGPAGEAUTHTYPE.SIGNUP}/>
                </div>
            </div>
        </section>
    )
}

export default SignUpPage