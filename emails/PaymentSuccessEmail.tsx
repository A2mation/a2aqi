import { PRODUCTS } from "@/data/products";
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

interface PaymentSuccessEmailProps {
    orderId: string;
    paymentId: string;
    purchaseDate: string;
    customerName: string;
    shippingAddress: string;
    productId: string
}

const baseUrl = 'https://a2aqi.com';

// TODO: PAYMENT INFO, PRODUCT Details, ADDRESS Details

export const PaymentSuccessEmail = ({
    orderId = "ORD-89241",
    paymentId = "pay_RazorpayX921",
    purchaseDate = "June 8, 2026",
    customerName = "Valued Vendor",
    shippingAddress = "Enter shipping address here",
    productId
}: PaymentSuccessEmailProps) => {
    const p = PRODUCTS.find((p) => p.id === productId);

    const product = {
        title: p?.title,
        description: p?.description,
        image: p?.images[0],
        price: p?.price || 6599,
        delivery: p?.logistics.delivery,
        specs: p?.specs || []
    };

    return (
        <Html>
            <Head />
            <Preview>Payment Successful! Your A2AQI order is confirmed</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header Banner */}
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
                        {/* Premium Main Success Green SVG Icon */}
                        <Section style={iconContainer}>
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={successSvg}>
                                <circle cx="32" cy="32" r="32" fill="#d1fae5" />
                                <path d="M42 24L28.25 37.75L22 31.5" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Section>

                        {/* Success Heading */}
                        <Heading style={h1}>Order Confirmed</Heading>
                        <Text style={text}>
                            Hi {customerName}, thank you for your purchase! Your payment was processed successfully, and your environmental monitoring station is being prepared.
                        </Text>

                        {/* Meta Data Grid */}
                        <Section style={metaGrid}>
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    {[
                                        { label: "Order ID", value: orderId },
                                        { label: "Payment ID", value: paymentId },
                                        { label: "Date", value: purchaseDate },
                                        { label: "Est. Delivery", value: product.delivery }
                                    ].map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={metaLabel}>{item.label}:</td>
                                            <td style={metaValue}>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        <Heading style={sectionTitle}>Items Ordered</Heading>

                        {/* Item Card Layout */}
                        <Section style={productCard}>
                            <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: "100px", verticalAlign: "top" }}>
                                            <Img
                                                src={product.image}
                                                width="100"
                                                height="100"
                                                alt={product.title}
                                                style={productImg}
                                            />
                                        </td>
                                        <td style={{ paddingLeft: "16px", verticalAlign: "top" }}>
                                            <Text style={productTitle}>{product.title}</Text>
                                            <Text style={productDesc}>{product.description}</Text>
                                            <Text style={productPrice}>₹{product.price.toLocaleString('en-IN')}.00</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Device Specifications Subsection */}
                        <Heading style={subSectionTitle}>Device Hardware Specs</Heading>
                        <Section style={specsContainer}>
                            <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    {product.specs.map((spec, idx) => (
                                        <tr key={idx} style={idx !== product.specs.length - 1 ? specRow : {}}>
                                            <td style={{ width: "24px", verticalAlign: "middle", padding: "10px 0" }}>
                                                {/* Specifications Inline Green SVG Checkmark */}
                                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10" r="10" fill="#d1fae5" />
                                                    <path d="M14 7L8.5 12.5L6 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </td>
                                            <td style={specLabel}>{spec.label}</td>
                                            <td style={specValue}>{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Section>

                        {/* Shipping Address Target Section */}
                        <Heading style={sectionTitle}>Shipping Address</Heading>
                        <Section style={addressBox}>
                            <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: "28px", verticalAlign: "top", paddingTop: "2px" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#86efac" />
                                            </svg>
                                        </td>
                                        <td>
                                            <Text style={addressText}>{shippingAddress}</Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        <Text style={supportText}>
                            Need assistance with hardware onboarding or shipping details? Our infrastructure support team is here to help. <Link href="mailto:a2mationsolution@gmail.com" style={supportLink}>Contact Support</Link>
                        </Text>
                    </Section>

                    {/* Dedicated Corporate Footer Section */}
                    <Section style={footerWrapper}>
                        <table style={{ width: "100%" }} border={0} cellPadding={0} cellSpacing={0}>
                            <tbody>
                                <tr>
                                    <td style={footerNav}>
                                        <Link href="https://a2aqi.com" style={footerNavLink}>Console Dashboard</Link>
                                        <span style={footerSeparator}>•</span>
                                        <Link href="https://a2aqi.com/privacy" style={footerNavLink}>Privacy Policy</Link>
                                        <span style={footerSeparator}>•</span>
                                        <Link href="https://a2aqi.com/terms" style={footerNavLink}>Terms of Service</Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Text style={footerLegalText}>
                                            A2AQI is a registered environmental monitoring brand of <strong>A2MATION TECHNOLOGY SOLUTION (OPC) PVT LTD</strong>.
                                        </Text>
                                        <Text style={footerAddressText}>
                                            Corporate Office & Hardware Lab, India <br />
                                            © {new Date().getFullYear()} A2MATION. All rights reserved.
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

export default PaymentSuccessEmail;


const main = {
    backgroundColor: "#f4f7f5",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: "40px auto",
    padding: "0",
    width: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 4px 24px rgba(15, 32, 24, 0.06)",
};

const logoContainer = {
    padding: "32px",
    backgroundColor: "#8BAA96",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
};

const content = {
    padding: "40px 48px 24px 48px",
};

const iconContainer = {
    textAlign: "center" as const,
    margin: "0 auto 16px",
    width: "100%",
};

const successSvg = {
    margin: "0 auto",
    display: "block",
};

const h1 = {
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center" as const,
    margin: "0 0 16px",
};

const sectionTitle = {
    color: "#1e293b",
    fontSize: "16px",
    fontWeight: "600",
    margin: "32px 0 12px",
};

const subSectionTitle = {
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.75px",
    margin: "28px 0 12px",
};

const text = {
    color: "#475569",
    fontSize: "15px",
    lineHeight: "24px",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const metaGrid = {
    background: "#f0fdf4",
    borderRadius: "8px",
    padding: "16px 24px",
    margin: "24px 0",
    border: "1px solid #dcfce7",
};

const metaLabel = {
    color: "#3f6212",
    fontSize: "13px",
    fontWeight: "500",
    padding: "4px 0",
    width: "40%",
};

const metaValue = {
    color: "#14532d",
    fontSize: "13px",
    fontWeight: "600",
    padding: "4px 0",
    textAlign: "right" as const,
};

const productCard = {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#ffffff",
};

const productImg = {
    borderRadius: "8px",
    objectFit: "cover" as const,
    border: "1px solid #f1f5f9",
};

const productTitle = {
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 4px 0",
};

const productDesc = {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0 0 8px 0",
};

const productPrice = {
    color: "#10b981",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0",
};

const specsContainer = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "4px 16px",
};

const specRow = {
    borderBottom: "1px solid #f1f5f9",
};

const specLabel = {
    color: "#475569",
    fontSize: "13px",
    padding: "10px 8px",
};

const specValue = {
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: "600",
    padding: "10px 0",
    textAlign: "right" as const,
};

const addressBox = {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #e2e8f0",
};

const addressText = {
    color: "#334155",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
};

const supportText = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    margin: "24px 0 0",
};

const supportLink = {
    color: "#10b981",
    textDecoration: "underline",
    fontWeight: "500",
};

// --- Footer UI Block Styles ---

const footerWrapper = {
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
    padding: "32px 48px",
    textAlign: "center" as const,
};

const footerNav = {
    textAlign: "center" as const,
    paddingBottom: "16px",
};

const footerNavLink = {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "500",
    textDecoration: "none",
};

const footerSeparator = {
    color: "#cbd5e1",
    fontSize: "12px",
    padding: "0 8px",
};

const footerLegalText = {
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: "16px",
    margin: "0 0 6px 0",
    textAlign: "center" as const,
};

const footerAddressText = {
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: "16px",
    margin: "0",
    textAlign: "center" as const,
};