import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface VendorOTPEmailProps {
    otp: string;
}

const baseUrl = 'https://a2aqi.com';

export const VendorOTPEmail = ({ otp }: VendorOTPEmailProps) => (
    <Html>
        <Head />
        <Preview>Your A2AQI verification code</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Logo Section */}
                <Section style={logoContainer}>
                    <Img
                        src={`${baseUrl}/favicon.png`}
                        width="140"
                        height="auto"
                        alt="A2AQI Logo"
                        style={logo}
                    />
                </Section>

                <Section style={content}>
                    <Heading style={h1}>Vendor Verification</Heading>
                    <Text style={text}>
                        To complete your registration on the <strong>A2AQI Platform</strong>,
                        please use the following One-Time Password (OTP).
                    </Text>

                    <Section style={codeContainer}>
                        <Text style={code}>{otp}</Text>
                    </Section>

                    <Text style={validityText}>
                        This code is valid for <span style={highlight}>5 minute</span> only.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footerText}>
                        A2AQI is a brand of A2MATION TECHNOLOGY SOLUTION. <br />
                        If you did not request this code, please ignore this email.
                    </Text>
                </Section>

                <Text style={bottomLink}>
                    <Link href="https://a2aqi.com" style={link}>a2aqi.com</Link>
                </Text>
            </Container>
        </Body>
    </Html>
);

export default VendorOTPEmail;

// --- Styles ---

const main = {
    backgroundColor: "#f4f7f9",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "40px auto",
    padding: "0",
    width: "560px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden" as const,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const logoContainer = {
    padding: "32px",
    backgroundColor: "#8B9BAC",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
};

const content = {
    padding: "40px 48px",
};

const h1 = {
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const text = {
    color: "#475569",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center" as const,
};

const codeContainer = {
    background: "#f1f5f9",
    borderRadius: "12px",
    margin: "24px auto",
    padding: '5px',
    width: "280px",
    border: "1px solid #e2e8f0",
};

const code = {
    color: "#0ea5e9",
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "8px",
    textAlign: "center" as const,
    margin: "12px 0",
};

const validityText = {
    fontSize: "13px",
    color: "#64748b",
    textAlign: "center" as const,
};

const highlight = {
    color: "#ef4444",
    fontWeight: "600",
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "32px 0 24px",
};

const footerText = {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "18px",
    textAlign: "center" as const,
};

const bottomLink = {
    textAlign: "center" as const,
    marginTop: "24px",
};

const link = {
    color: "#0ea5e9",
    fontSize: "14px",
    textDecoration: "none",
};