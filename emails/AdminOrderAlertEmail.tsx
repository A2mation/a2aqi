import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface AdminOrderAlertEmailProps {
    orderId: string;
    paymentId: string;
    purchaseDate: string;
    customerName: string;
    customerEmail?: string;
    shippingAddress: string;
}

const baseUrl = 'https://a2aqi.com';

export const AdminOrderAlertEmail = ({
    orderId = "ORD-89241",
    paymentId = "pay_RazorpayX921",
    purchaseDate = "June 8, 2026",
    customerName = "Valued Vendor",
    customerEmail = "customer@example.com",
    shippingAddress = "Enter shipping address here",
}: AdminOrderAlertEmailProps) => {
    const product = {
        title: 'A2-AQ21SW - 7 CM X 12 CM',
        price: 6599,
        specs: [
            { label: 'Dimension', value: '7 CM X 12 CM' },
            { label: 'Board Type', value: 'Premium Plastic Frame' },
            { label: 'Material', value: 'Premium & Durable Plastic Cabinet' },
        ]
    };

    return (
        <Html>
            <Head />
            <Preview>🚨 Action Required: New Order {orderId} Received</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header Alert Banner */}
                    <Section style={logoContainer}>
                        <Img
                            src={`${baseUrl}/favicon.png`}
                            width="140"
                            height="auto"
                            alt="A2AQI Logo"
                            style={logo}
                        />
                    </Section>

                    {/* Main Content Area */}
                    <Section style={content}>
                        {/* Status Label */}
                        <Section style={alertBadgeContainer}>
                            <span style={alertBadge}>NEW INBOUND ORDER</span>
                        </Section>

                        <Heading style={h1}>Order Incoming</Heading>
                        <Text style={text}>
                            A new hardware fulfillment request is ready for processing. Please verify payment logs and initiate the supply chain workflow.
                        </Text>

                        {/* Meta Data Grid */}
                        <Section style={metaGrid}>
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    {[
                                        { label: "Order Reference", value: orderId },
                                        { label: "Payment Reference", value: paymentId },
                                        { label: "Transaction Date", value: purchaseDate },
                                        { label: "Revenue (Gross)", value: `₹${product.price.toLocaleString('en-IN')}.00` }
                                    ].map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={metaLabel}>{item.label}:</td>
                                            <td style={metaValue}>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        {/* Customer File subsection */}
                        <Heading style={sectionTitle}>Customer Account Details</Heading>
                        <Section style={infoBox}>
                            <Text style={infoBoxText}><strong>Name:</strong> {customerName}</Text>
                            <Text style={infoBoxText}><strong>Email:</strong> <Link href={`mailto:${customerEmail}`} style={inlineLink}>{customerEmail}</Link></Text>
                        </Section>

                        {/* Fulfillment Items Stack */}
                        <Heading style={sectionTitle}>SKU Breakdown</Heading>
                        <Section style={productCard}>
                            <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: "top" }}>
                                            <Text style={productTitle}>{product.title}</Text>
                                            <Text style={productDesc}>
                                                Qty: 1 Unit • Base Price: ₹{product.price.toLocaleString('en-IN')}
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Shipping Target Location */}
                        <Heading style={sectionTitle}>Target Shipping Hub</Heading>
                        <Section style={addressBox}>
                            <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: "28px", verticalAlign: "top", paddingTop: "2px" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#e11d48" />
                                            </svg>
                                        </td>
                                        <td>
                                            <Text style={addressText}>{shippingAddress}</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Console Link CTA */}
                        <Text style={supportText}>
                            Review production timelines on the internal engine console. <Link href="https://a2aqi.com/admin/dashboard" style={supportLink}>Open Admin Dashboard</Link>
                        </Text>
                    </Section>

                    {/* Infrastructure Footer */}
                    <Section style={footerWrapper}>
                        <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                            <tbody>
                                <tr>
                                    <td>
                                        <Text style={footerLegalText}>
                                            Automated infrastructure transmission from <strong>A2MATION Network Services</strong>.
                                        </Text>
                                        <Text style={footerAddressText}>
                                            Confidential internal data. Unauthorized redistribution is prohibited.<br />
                                            © {new Date().getFullYear()} A2MATION Infrastructure Engine.
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default AdminOrderAlertEmail;

// --- Cohesive Styled System Layout ---

const main = {
    backgroundColor: "#f8fafc",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "40px auto",
    padding: "0",
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
};

const logoContainer = {
    padding: "24px",
    backgroundColor: "#0f172a", // Corporate dark for distinct internal system feel
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
};

const content = {
    padding: "40px 48px 24px 48px",
};

const alertBadgeContainer = {
    textAlign: "center" as const,
    margin: "0 auto 12px",
};

const alertBadge = {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 12px",
    borderRadius: "50px",
    letterSpacing: "1px",
    display: "inline-block",
};

const h1 = {
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center" as const,
    margin: "0 0 12px",
};

const text = {
    color: "#475569",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const metaGrid = {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "16px 24px",
    margin: "24px 0",
    border: "1px solid #e2e8f0",
};

const metaLabel = {
    color: "#475569",
    fontSize: "13px",
    fontWeight: "500",
    padding: "6px 0",
    width: "45%",
};

const metaValue = {
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 0",
    textAlign: "right" as const,
};

const sectionTitle = {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "28px 0 12px",
};

const infoBox = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "14px 16px",
};

const infoBoxText = {
    color: "#334155",
    fontSize: "13px",
    margin: "4px 0",
};

const inlineLink = {
    color: "#0284c7",
    textDecoration: "underline",
};

const productCard = {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#ffffff",
};

const productTitle = {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px 0",
};

const productDesc = {
    color: "#64748b",
    fontSize: "12px",
    margin: "0",
};

const addressBox = {
    background: "#fff1f2",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #ffe4e6",
};

const addressText = {
    color: "#9f1239",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0",
};

const supportText = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    margin: "32px 0 0",
};

const supportLink = {
    color: "#0f172a",
    textDecoration: "underline",
    fontWeight: "600",
};

const footerWrapper = {
    backgroundColor: "#f1f5f9",
    borderTop: "1px solid #e2e8f0",
    padding: "24px 48px",
    textAlign: "center" as const,
};

const footerLegalText = {
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "16px",
    margin: "0 0 4px 0",
    textAlign: "center" as const,
};

const footerAddressText = {
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "15px",
    margin: "0",
    textAlign: "center" as const,
};