"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, IndianRupee } from "lucide-react";
import type { BillData } from "@/types/bill";

interface BillTemplateProps {
  data: BillData;
  companyDetails: {
    name: string;
    tagline: string;
    ownerName: string;
    address: string;
    phone: string;
    email: string;
    gstin: string;
    panNumber?: string;
  };
}

const BillTemplate: React.FC<BillTemplateProps> = ({
  data,
  companyDetails,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Bill-${data.billNumber}`,
  });

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Convert number to words (for Indian numbering)
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";

    const numStr = Math.floor(num).toString();
    let words = "";

    // Handle crores
    if (numStr.length > 7) {
      const crores = parseInt(numStr.slice(0, -7));
      words += numberToWords(crores) + " Crore ";
    }

    // Handle lakhs
    if (numStr.length > 5) {
      const lakhs = parseInt(numStr.slice(-7, -5) || "0");
      if (lakhs > 0) words += numberToWords(lakhs) + " Lakh ";
    }

    // Handle thousands
    if (numStr.length > 3) {
      const thousands = parseInt(numStr.slice(-5, -3) || "0");
      if (thousands > 0) words += numberToWords(thousands) + " Thousand ";
    }

    // Handle hundreds
    const lastThree = parseInt(numStr.slice(-3));
    const hundreds = Math.floor(lastThree / 100);
    if (hundreds > 0) words += ones[hundreds] + " Hundred ";

    const lastTwo = lastThree % 100;
    if (lastTwo >= 10 && lastTwo < 20) {
      words += teens[lastTwo - 10] + " ";
    } else {
      const tensDigit = Math.floor(lastTwo / 10);
      const onesDigit = lastTwo % 10;
      if (tensDigit > 0) words += tens[tensDigit] + " ";
      if (onesDigit > 0) words += ones[onesDigit] + " ";
    }

    // Add paise if decimal exists
    const decimal = Math.round((num % 1) * 100);
    if (decimal > 0) {
      words += "and " + numberToWords(decimal) + " Paise";
    }

    return words.trim();
  };

  // Ensure optional numeric fields have safe defaults for rendering
  const discountValue = data.discount ?? 0;
  const discountPercent = data.discountPercentage ?? 0;
  const shippingValue = data.shippingCharges ?? 0;
  const otherValue = data.otherCharges ?? 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 print:hidden">
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">
          Tax Invoice Preview
        </h1>
        <Button
          onClick={reactToPrintFn}
          size="sm"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg self-end sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden xs:inline">Print Bill</span>
          <span className="xs:hidden">Print</span>
        </Button>
      </div>

      <div
        ref={contentRef}
        className="bg-white p-3 sm:p-6 print:p-6 shadow-lg min-h-[297mm]"
      >
        {/* Header Section */}
        <div className="mb-4 border-2 border-slate-800 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                <span className="text-green-600">
                  {companyDetails.name.split(" ")[0]}
                </span>
                <span className="text-slate-700">
                  {" "}
                  {companyDetails.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="text-sm text-slate-600 font-medium italic">
                {companyDetails.tagline}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1">
                TAX INVOICE
              </h2>
            </div>
          </div>

          <Separator className="my-3 bg-slate-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">
                {companyDetails.ownerName}
              </p>
              <p className="text-slate-600">{companyDetails.address}</p>
              <p className="font-semibold text-slate-800">
                {companyDetails.phone}
              </p>
              <p className="text-slate-600">{companyDetails.email}</p>
              <p className="font-semibold text-slate-800">
                GSTIN: {companyDetails.gstin}
              </p>
              {companyDetails.panNumber && (
                <p className="font-semibold text-slate-800">
                  PAN: {companyDetails.panNumber}
                </p>
              )}
            </div>

            <div className="space-y-1 md:text-right">
              <p>
                <span className="font-semibold">Invoice No:</span>{" "}
                {data.billNumber}
              </p>
              <p>
                <span className="font-semibold">Invoice Date:</span>{" "}
                {data.billDate}
              </p>
              {data.dueDate && (
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {data.dueDate}
                </p>
              )}
              {data.purchaseOrderNumber && (
                <>
                  <p>
                    <span className="font-semibold">PO Number:</span>{" "}
                    {data.purchaseOrderNumber}
                  </p>
                  {data.purchaseOrderDate && (
                    <p>
                      <span className="font-semibold">PO Date:</span>{" "}
                      {data.purchaseOrderDate}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-4 border border-slate-300 p-3">
          <h3 className="text-sm font-bold text-slate-800 mb-2 bg-slate-100 p-2">
            BILL TO:
          </h3>
          <div className="space-y-1 text-sm pl-2">
            <p className="font-semibold text-slate-800 text-base">
              {data.customerName}
            </p>
            <p className="text-slate-600">{data.customerAddress}</p>
            {data.customerPhone && (
              <p className="text-slate-600">Phone: {data.customerPhone}</p>
            )}
            {data.customerEmail && (
              <p className="text-slate-600">Email: {data.customerEmail}</p>
            )}
            {data.customerGSTIN && (
              <p className="font-semibold text-slate-800">
                GSTIN: {data.customerGSTIN}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-left font-semibold">
                  S.No
                </th>
                <th className="border border-slate-300 p-2 text-left font-semibold">
                  Description
                </th>
                {data.items.some((item) => item.hsn) && (
                  <th className="border border-slate-300 p-2 text-left font-semibold">
                    HSN/SAC
                  </th>
                )}
                <th className="border border-slate-300 p-2 text-right font-semibold">
                  Qty
                </th>
                <th className="border border-slate-300 p-2 text-left font-semibold">
                  Unit
                </th>
                <th className="border border-slate-300 p-2 text-right font-semibold">
                  Rate
                </th>
                <th className="border border-slate-300 p-2 text-right font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-slate-300 p-2">{index + 1}</td>
                  <td className="border border-slate-300 p-2">
                    {item.description}
                  </td>
                  {data.items.some((i) => i.hsn) && (
                    <td className="border border-slate-300 p-2">
                      {item.hsn || "-"}
                    </td>
                  )}
                  <td className="border border-slate-300 p-2 text-right">
                    {item.quantity}
                  </td>
                  <td className="border border-slate-300 p-2">{item.unit}</td>
                  <td className="border border-slate-300 p-2 text-right">
                    {formatINR(item.rate)}
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-semibold">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="mb-4 flex justify-end">
          <div className="w-full md:w-1/2 border border-slate-300">
            <div className="flex justify-between p-2 border-b border-slate-300">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-semibold">{formatINR(data.subtotal)}</span>
            </div>

            {discountValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300 text-red-600">
                <span>
                  Discount {discountPercent > 0 ? `(${discountPercent}%)` : ""}:
                </span>
                <span>- {formatINR(discountValue)}</span>
              </div>
            )}

            {data.tax && data.tax.taxAmount > 0 && (
              <>
                {data.tax.cgst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>CGST ({data.tax.cgst}%):</span>
                    <span>
                      {formatINR(
                        ((data.subtotal - discountValue) * data.tax.cgst) / 100
                      )}
                    </span>
                  </div>
                )}
                {data.tax.sgst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>SGST ({data.tax.sgst}%):</span>
                    <span>
                      {formatINR(
                        ((data.subtotal - discountValue) * data.tax.sgst) / 100
                      )}
                    </span>
                  </div>
                )}
                {data.tax.igst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>IGST ({data.tax.igst}%):</span>
                    <span>
                      {formatINR(
                        ((data.subtotal - discountValue) * data.tax.igst) / 100
                      )}
                    </span>
                  </div>
                )}
              </>
            )}

            {shippingValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300">
                <span>Shipping Charges:</span>
                <span>{formatINR(shippingValue)}</span>
              </div>
            )}

            {otherValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300">
                <span>Other Charges:</span>
                <span>{formatINR(otherValue)}</span>
              </div>
            )}

            <div className="flex justify-between p-2 bg-slate-100 font-bold text-lg">
              <span>Total Amount:</span>
              <span className="flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {formatINR(data.total).replace("₹", "")}
              </span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mb-4 border border-slate-300 p-3 bg-slate-50">
          <p className="text-sm">
            <span className="font-semibold">Amount in Words:</span>{" "}
            <span className="italic">{numberToWords(data.total)} Only</span>
          </p>
        </div>

        {/* Payment Details */}
        {data.bankDetails && (
          <div className="mb-4 border border-slate-300 p-3">
            <h3 className="text-sm font-bold text-slate-800 mb-2 bg-slate-100 p-2">
              PAYMENT DETAILS:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm pl-2">
              <div>
                <p className="font-semibold">Bank Name:</p>
                <p className="text-slate-600">{data.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="font-semibold">Account Holder:</p>
                <p className="text-slate-600">
                  {data.bankDetails.accountHolderName}
                </p>
              </div>
              <div>
                <p className="font-semibold">Account Number:</p>
                <p className="text-slate-600">
                  {data.bankDetails.accountNumber}
                </p>
              </div>
              <div>
                <p className="font-semibold">IFSC Code:</p>
                <p className="text-slate-600">{data.bankDetails.ifscCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {data.notes && data.notes.length > 0 && (
          <div className="mb-4 border border-slate-300 p-3">
            <h3 className="text-sm font-bold text-slate-800 mb-2">NOTES:</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {data.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Terms and Conditions */}
        {data.termsAndConditions && data.termsAndConditions.length > 0 && (
          <div className="mb-6 border border-slate-300 p-3">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              TERMS & CONDITIONS:
            </h3>
            <ul className="list-decimal list-inside text-xs text-slate-600 space-y-1">
              {data.termsAndConditions.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Signature Section */}
        <div className="mt-8 flex justify-between items-end">
          <div className="text-xs text-slate-600">
            <p className="italic">This is a computer generated invoice</p>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-slate-800 pt-2 mt-16 min-w-[200px]">
              <p className="font-semibold text-sm">Authorized Signatory</p>
              <p className="text-xs text-slate-600">{companyDetails.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplate;
