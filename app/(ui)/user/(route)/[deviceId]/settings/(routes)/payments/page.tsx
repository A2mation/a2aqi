"use client"

export default function PaymentsPage() {
    // Dummy payment data
    const payments = [
        {
            id: "1",
            amount: 7999,
            status: "SUCCESS",
            date: "12 Jan 2026",
            transactionId: "pay_MKJ12345",
        },
        {
            id: "2",
            amount: 2999,
            status: "FAILED",
            date: "05 Jan 2025",
            transactionId: "pay_XYZ67890",
        },
        {
            id: "3",
            amount: 19999,
            status: "REFUNDED",
            date: "01 Jan 2024",
            transactionId: "pay_REF99999",
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return "bg-green-600"
            case "FAILED":
                return "bg-red-600"
            case "REFUNDED":
                return "bg-yellow-600"
            default:
                return "bg-gray-600"
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Payment History</h1>
                    <p className="text-gray-400">
                        View all your past subscription payments.
                    </p>
                </div>

                {/* Payments Table */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-5 px-6 py-4 border-b border-zinc-800 text-sm text-gray-400">
                        <span>Date</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Transaction ID</span>
                        <span className="text-right">Invoice</span>
                    </div>

                    {/* Payment Rows */}
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="grid grid-cols-5 px-6 py-4 border-b border-zinc-800 items-center text-sm"
                        >
                            <span>{payment.date}</span>

                            <span className="font-medium">
                                ₹{payment.amount}
                            </span>

                            <span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                                        payment.status
                                    )}`}
                                >
                                    {payment.status}
                                </span>
                            </span>

                            <span className="text-gray-400 truncate">
                                {payment.transactionId}
                            </span>

                            <span className="text-right">
                                {payment.status === "SUCCESS" ? (
                                    <button className="text-white hover:underline">
                                        Download
                                    </button>
                                ) : (
                                    <span className="text-gray-500">—</span>
                                )}
                            </span>
                        </div>
                    ))}

                    {/* Empty State (optional) */}
                    {payments.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No payments found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}