import ForgotPasswordForm from '@/components/users-ui/auth/forgot-password-form'

const ForgotPasswordPage = () => {
    return (
        <>
            <ForgotPasswordForm
                role={'vendor'}
                otpRoute={'/api/vendor/auth/forgot-password/verify-otp'}
                emailVerifyRoute={'/api/vendor/auth/forgot-password/verify-email'}
                passwordResetRoute={'/api/vendor/auth/forgot-password/reset-password'}
                redirectRoute={'/vendor/login'}
            />
        </>
    )
}

export default ForgotPasswordPage
