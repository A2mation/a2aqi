'use client'

import { BlogLoginCard, BLOGPAGEAUTHTYPE } from '@/app/(ui)/(routes)/blogs/auth/components/Blog-Login-card'

const SignInPage = () => {
    return (
        <section className='min-h-screen'>
            <div className='max-w-7xl mx-auto '>
                <div className='flex items-center justify-center h-screen'>
                    <BlogLoginCard title='Sign In' desc='Login to your blog account' type={BLOGPAGEAUTHTYPE.SIGNIN}/>
                </div>
            </div>
        </section>
    )
}

export default SignInPage
