import ForgotPasswordForm from '@/components/users-ui/auth/forgot-password-form'

const ForgotPasswordPage = () => {
    return (
        <>
            <ForgotPasswordForm
                role={'user'}
                otpRoute={'/api/user/auth/forgot-password/verify-otp'}
                emailVerifyRoute={'/api/user/auth/forgot-password/verify-email'}
                passwordResetRoute={'/api/user/auth/forgot-password/reset-password'}
                redirectRoute={'/user/sign-in'}
            />
        </>
    )
}

export default ForgotPasswordPage
