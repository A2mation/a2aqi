import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font
} from '@react-pdf/renderer';
import { getBase64Image } from '@/helpers/convert-base64-image';
import { numberToIndianRupees } from '@/helpers/number-to-indian-rupees';

// Register a clean font similar to Segoe UI
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#f4f4f4',
        fontFamily: 'Helvetica',
        color: '#000',
    },
    topLabel: {
        textAlign: 'center',
        fontSize: 10,
        color: '#666',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
    },
    logo: {
        height: 60,
        width: 'auto',
    },
    tagline: {
        fontSize: 10,
        marginTop: 5,
        color: '#555',
        fontWeight: 'bold',
    },
    phone: {
        fontSize: 10,
        color: '#555',
    },
    companyInfo: {
        flex: 1,
        textAlign: 'right',
        maxWidth: 300,
    },
    companyName: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#000',
    },
    companyText: {
        textAlign: 'right',
        fontSize: 9,
        color: '#555',
        lineHeight: 1.3,
    },
    companyBillText: {
        textAlign: 'left',
        fontSize: 9,
        color: '#555',
        lineHeight: 1.3,
    },
    mainContent: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 30,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metaItem: {
        flex: 1,
        justifyContent: 'center'
    },
    label: {
        color: '#999',
        fontSize: 9,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    val: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    bigTotal: {
        color: '#1434A4',
        fontSize: 22,
        fontWeight: 'bold',
    },
    metaItemRight: {
        flex: 1,
        alignItems: 'flex-end',
        textAlign: 'right',
    },
    metaItemCenter: {
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
    },
    metaItemleft: {
        flex: 1,
        alignItems: 'flex-start',
        textAlign: 'left',
    },
    customerAddress: {
        fontSize: 9,
        color: '#555',
        lineHeight: 1.2,
        maxWidth: 180,
        overflow: 'hidden',
    },
    // Table Styling
    table: {
        width: '100%',
        marginVertical: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        borderTop: 1,
        borderBottom: 1,
        borderColor: '#eee',
        paddingVertical: 8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottom: 1,
        borderColor: '#f9f9f9',
    },
    th: {
        color: '#999',
        fontSize: 9,
    },
    td: {
        fontSize: 11,
    },
    col1: { width: '50%' },
    col2: { width: '10%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },

    subDetail: {
        color: '#777',
        fontSize: 10,
        marginTop: 2,
    },
    // Summary Section
    summaryContainer: {
        width: 200,
        marginLeft: 'auto',
        borderTop: 1,
        borderColor: '#eee',
        marginTop: 10,
    },
    summaryLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        fontSize: 10,
    },
    totalLine: {
        borderTop: 1,
        borderColor: '#eee',
        marginTop: 8,
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footerNotes: {
        marginTop: 60,
        fontSize: 11,
    },
    jurisdiction: {
        textAlign: 'center',
        fontSize: 9,
        color: '#999',
        marginTop: 30,
    }
});

export interface InvoiceItem {
    id: string | undefined;
    description: string;
    quantity: number;
    rate: number;
}

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    gstNumner: string | null;
    customerName: string | null;
    customerAddress: string;
    customerPhone: string | null;
    customerEmail: string | null,
    items: InvoiceItem[];
}

export const InvoicePDF = (data: InvoiceData) => {
    const LOGO_URL = 'domains/payments/templates/images/favicon.png';
    const logoBase64 = getBase64Image(LOGO_URL);

    const totalAmount = data.items.reduce((acc: number, item: any) => acc + (item.rate * item.quantity), 0);
    const subtotal = totalAmount / 1.18;
    const gstTotal = totalAmount - subtotal;
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;
    const amountInWords = numberToIndianRupees(totalAmount);

    const f = (num: number) => `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const addressArray = data.customerAddress.split(',').map((p) => p.trim());

    const len = addressArray.length;

    const line1 = addressArray.slice(0, len - 4).join(", ");
    // Using len-4 (City), len-3 (State), and len-1 (Zip)
    const line2 = `${addressArray[len - 4]}, ${addressArray[len - 3]} - ${addressArray[len - 1]}`;

    // Line 3: Country
    const line3 = addressArray[len - 2];

    return (
        <Document>
            <Page size="A4" style={styles.page} >
                <Text style={styles.topLabel}> Tax Invoice(Original For Recipient) </Text>

                <View style={styles.header} >
                    <View style={styles.logoSection}>
                        <Image src={logoBase64} style={styles.logo} />
                        <Text style={styles.tagline}> Because Air Quality Matter </Text>
                        < Text style={styles.phone} > +91 8777353002 </Text>
                    </View>
                    <View style={styles.companyInfo} >
                        <Text style={styles.companyName}> A2MATION TECHNOLOGY SOLUTION(OPC) PVT LTD </Text>
                        <Text style={styles.companyText}> 129 / 1 NORTH, Sodla Tank Rd, </Text>
                        <Text style={styles.companyText}> North 24 Parganas, West Bengal 743133 </Text>
                        <Text style={styles.companyText}> GSTIN: 19AAUCA36061Z8K </Text>
                        <Text style={styles.companyText}> CIN No.U32109WB2020OPC241147 </Text>
                    </View>
                </View>

                <View style={styles.mainContent} >
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.label}>Billed to</Text>
                            <Text style={styles.val}>{data.customerName}</Text>

                            <Text style={[styles.customerAddress, { marginTop: 2 }]}>{line1}</Text>
                            <Text style={styles.customerAddress}>{line2}</Text>
                            <Text style={styles.customerAddress}>{line3}</Text>
                            {
                                data.gstNumner && (
                                    <Text style={styles.customerAddress}>GSTIN.-{data.gstNumner}</Text>
                                )
                            }

                            <View style={{ marginTop: 4 }}>
                                <Text style={styles.customerAddress}>{data.customerPhone}</Text>
                                <Text style={styles.customerAddress}>{data.customerEmail}</Text>
                            </View>
                        </View>

                        <View style={styles.metaItemCenter}>
                            <Text style={styles.label}> Invoice number </Text>
                            < Text style={styles.val}> {data.invoiceNumber} </Text>
                        </View>
                        <View style={styles.metaItemRight}>
                            <Text style={styles.label}> Invoice of(INR) </Text>
                            <Text style={styles.bigTotal}> {f(totalAmount)} </Text>
                        </View>
                    </View>

                    <View style={styles.metaRow} >
                        <View style={styles.metaItemleft}>
                            <Text style={styles.label}> Invoice date </Text>
                            <Text style={styles.val} > {data.date} </Text>
                        </View>
                        <View style={styles.metaItemRight}>
                            <Text style={styles.label}> Subject </Text>
                            <Text style={styles.val} > Device Subscription </Text>
                        </View>
                    </View>

                    {/* Table */}
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.th, styles.col1]}> ITEM DETAIL </Text>
                            <Text style={[styles.th, styles.col2]} > SAC </Text>
                            <Text style={[styles.th, styles.col2]} > QTY </Text>
                            <Text style={[styles.th, styles.col3]} > RATE </Text>
                            <Text style={[styles.th, styles.col4]} > AMOUNT </Text>
                        </View>

                        {
                            data.items.map((item: any, index: number) => (
                                <View key={index} style={styles.tableRow} >
                                    <View style={styles.col1} >
                                        <Text style={styles.val} > {item.id} </Text>
                                        < Text style={styles.subDetail} > {item.description} </Text>
                                    </View>
                                    <Text style={[styles.td, styles.col2]} > {"998431"} </Text>
                                    <Text style={[styles.td, styles.col2]} > {item.quantity} </Text>
                                    <Text style={[styles.td, styles.col3]} > {f(item.rate / 1.18)
                                    } </Text>
                                    <Text style={[styles.td, styles.col4]} > {f((item.rate / 1.18) * item.quantity)} </Text>
                                </View>
                            ))}
                    </View>

                    <View style={styles.summaryContainer} >
                        <View style={styles.summaryLine}>
                            <Text>Subtotal </Text>
                            <Text > {f(subtotal)} </Text>
                        </View>
                        < View style={styles.summaryLine} >
                            <Text>CGST(9 %) </Text>
                            <Text > {f(cgst)} </Text>
                        </View>
                        < View style={styles.summaryLine} >
                            <Text>SGST(9 %) </Text>
                            <Text > {f(sgst)} </Text>
                        </View>
                        <View style={[styles.summaryLine, styles.totalLine]} >
                            <Text>Total </Text>
                            <Text > {f(totalAmount)} </Text>
                        </View>
                    </View>

                    <View style={styles.footerNotes} >
                        <Text style={{ fontWeight: 'bold' }}> Amount In Words: </Text>
                        <Text style={{ marginTop: 2 }}> {amountInWords} </Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 20 }}> Thanks for the business.</Text>
                    </View>
                </View>

                <Text style={styles.jurisdiction} >** Subject to Barrackpore Jurisdiction Only ** </Text>
            </Page>
        </Document>
    );
};