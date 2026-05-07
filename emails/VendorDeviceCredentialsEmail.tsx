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

interface DeviceCredentialsEmailProps {
    deviceName?: string;
    serialNo: string;
    apiKey: string;
}

const baseUrl = 'https://a2aqi.com';

export const DeviceCredentialsEmail = ({
    deviceName = "New Device",
    serialNo,
    apiKey
}: DeviceCredentialsEmailProps) => (
    <Html>
        <Head />
        <Preview>Your A2AQI Device Credentials for {deviceName}</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header/Logo Section */}
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
                    <Heading style={h1}>Device Activated</Heading>
                    <Text style={text}>
                        Success! Your device <strong>{deviceName}</strong> has been registered.
                        Below are your unique credentials. Keep these secure as they are required
                        to connect your hardware to our cloud.
                    </Text>

                    {/* Credentials Box */}
                    <Section style={credentialBox}>
                        <Text style={label}>SERIAL NUMBER</Text>
                        <Section style={monoContainer}>
                            <Text style={monoText}>{serialNo}</Text>
                        </Section>

                        <Text style={label}>API KEY</Text>
                        <Section style={monoContainer}>
                            <Text style={monoText}>{apiKey}</Text>
                        </Section>
                    </Section>

                    <Section style={warningBox}>
                        <Text style={warningText}>
                            <strong>Security Warning:</strong> Never share your API Key with anyone.
                            A2AQI staff will never ask for this key.
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footerText}>
                        Need help setting up your device? Visit our <Link href={`${baseUrl}/vendor/documentation`} style={link}>Documentation</Link> or contact support.
                        <br /><br />
                        A2AQI is a brand of A2MATION TECHNOLOGY SOLUTION.
                    </Text>
                </Section>

                <Text style={bottomLink}>
                    <Link href="https://www.a2aqi.com/vendor/devices" style={link}>Go to Devices Section</Link>
                </Text>
            </Container>
        </Body>
    </Html>
);

export default DeviceCredentialsEmail;

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
    backgroundColor: "#1e293b", 
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
    margin: "0 0 16px",
};

const text = {
    color: "#475569",
    fontSize: "15px",
    lineHeight: "24px",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const credentialBox = {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e2e8f0",
};

const label = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: "1px",
    margin: "0 0 8px 4px",
    textTransform: "uppercase" as const,
};

const monoContainer = {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "20px",
};

const monoText = {
    fontFamily: 'monospace',
    fontSize: "16px",
    color: "#0f172a",
    margin: "0",
    textAlign: "center" as const,
    fontWeight: "600",
};

const warningBox = {
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "6px",
    padding: "12px",
    marginTop: "16px",
};

const warningText = {
    color: "#be123c",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    margin: "0",
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