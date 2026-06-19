import ForgotPasswordForm from '@/components/users-ui/auth/forgot-password-form'

const ForgotPasswordPage = () => {
    return (
        <>
            <ForgotPasswordForm
                role={'monitor'}
                otpRoute={'/api/monitor/auth/forgot-password/verify-otp'}
                emailVerifyRoute={'/api/monitor/auth/forgot-password/verify-email'}
                passwordResetRoute={'/api/monitor/auth/forgot-password/reset-password'}
                redirectRoute={'/monitor/sign-in'}
            />
        </>
    )
}

export default ForgotPasswordPage
