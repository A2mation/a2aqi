import { generateAndSaveInvoice } from "@/domains/payments/services/invoice.service";


async function test() {
    console.log("🚀 Starting Invoice Test...");
    
    // Mock Data (matches your Prisma types)
    const mockPayment = { id: "pay_123", userId: "user_123", paidAt: new Date() };
    const mockSub = { id: "sub_123", deviceId: "dev_serial_001", planType: "Premium", paidAmount: 1180 };
    const mockAddress = { 
        id: "addr_123", 
        name: "Ayan", 
        street: "Sector 5", 
        city: "Kolkata", 
        state: "WB", 
        country: "India", 
        zipCode: "700001" 
    };

    try {
        const result = await generateAndSaveInvoice(mockPayment as any, mockSub as any, mockAddress as any);
        console.log("✅ Invoice Generated & Saved!");
        console.log("📄 S3 Key:", result.s3Key);
        console.log("🔢 Invoice #:", result.invoiceNumber);
    } catch (err) {
        console.error("❌ Test Failed:", err);
    }
}

test();