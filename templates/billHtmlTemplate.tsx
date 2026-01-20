"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, IndianRupee, DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
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
  const { convertToUSD, formatCurrency, getExchangeRateInfo } = useCurrency();

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Invoice-${data.billNumber}`,
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

  // Format USD
  const formatUSD = (amount: number) => {
    return formatCurrency(convertToUSD(amount), "USD");
  };

  // Get exchange rate info for display
  const exchangeRateInfo = getExchangeRateInfo();

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

  // Calculate total weight from all items
  const calculateTotalWeight = (): number => {
    return data.items.reduce((sum, item) => sum + item.quantity, 0);
  };

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
                INVOICE
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
                <span className="font-semibold">Date:</span> {data.billDate}
              </p>
              {data.containerNumber && (
                <p>
                  <span className="font-semibold">Container No:</span>{" "}
                  {data.containerNumber}
                </p>
              )}
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

        {/* Items Table - New Format */}
        <div className="mb-4">
          <table className="w-full border-collapse border-2 border-slate-800 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-800 p-2 text-center font-semibold w-12">
                  NO.
                </th>
                <th className="border border-slate-800 p-2 text-left font-semibold">
                  DESCRIPTION
                </th>
                <th className="border border-slate-800 p-2 text-center font-semibold w-24">
                  QUANTITY
                  <br />
                  IN KG
                </th>
                <th className="border border-slate-800 p-2 text-center font-semibold w-20">
                  RATE
                  <br />
                  PER KG
                </th>
                <th className="border border-slate-800 p-2 text-center font-semibold w-24">
                  AMOUNT
                  <br />
                  IN RS.
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-slate-800 p-2 text-center align-top">
                    {index + 1}
                  </td>
                  <td className="border border-slate-800 p-2 align-top">
                    <div>
                      <p className="font-medium mb-2">{item.description}</p>

                      {/* Nested Box Weight Table */}
                      {item.boxWeightEntries &&
                        item.boxWeightEntries.length > 0 && (
                          <table className="w-full border border-slate-400 text-xs mt-2">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="border border-slate-400 p-1 text-left">
                                  No. of Boxes
                                </th>
                                <th className="border border-slate-400 p-1 text-left">
                                  Wt. per Carton
                                </th>
                                <th className="border border-slate-400 p-1 text-left">
                                  Total Wt
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.boxWeightEntries.map(
                                (entry, entryIndex) => (
                                  <tr key={entryIndex}>
                                    <td className="border border-slate-400 p-1">
                                      {entry.numberOfBoxes}
                                    </td>
                                    <td className="border border-slate-400 p-1">
                                      {entry.weight} kg
                                    </td>
                                    <td className="border border-slate-400 p-1">
                                      {entry.totalWeight.toFixed(2)}
                                    </td>
                                  </tr>
                                ),
                              )}
                              <tr className="font-semibold bg-slate-50">
                                <td
                                  className="border border-slate-400 p-1"
                                  colSpan={2}
                                >
                                  Total wt
                                </td>
                                <td className="border border-slate-400 p-1">
                                  {item.boxWeightEntries
                                    .reduce((sum, e) => sum + e.totalWeight, 0)
                                    .toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                    </div>
                  </td>
                  <td className="border border-slate-800 p-2 text-right align-top">
                    {item.quantity.toFixed(2)}
                  </td>
                  <td className="border border-slate-800 p-2 text-right align-top">
                    {formatINR(item.rate)}
                  </td>
                  <td className="border border-slate-800 p-2 text-right align-top font-semibold">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}

              {/* Total Weight and Amount Row */}
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-800 p-2" colSpan={2}>
                  <div>
                    <span>In words - Rupees: </span>
                    <span className="italic font-normal">
                      {numberToWords(data.total)} Only
                    </span>
                  </div>
                </td>
                <td className="border border-slate-800 p-2 text-right">
                  {calculateTotalWeight().toFixed(2)}
                </td>
                <td className="border border-slate-800 p-2 text-center">
                  Total Rs.
                </td>
                <td className="border border-slate-800 p-2 text-right">
                  {formatINR(data.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="mb-4 flex justify-end">
          <div className="w-full md:w-2/3 border border-slate-300">
            <div className="flex justify-between p-2 border-b border-slate-300 bg-slate-50">
              <span className="font-semibold">Subtotal:</span>
              <div className="text-right">
                <span className="font-semibold">
                  {formatINR(data.subtotal)}
                </span>
                <span className="text-sm text-slate-500 ml-2">
                  ({formatUSD(data.subtotal)})
                </span>
              </div>
            </div>

            {discountValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300 text-red-600">
                <span>
                  Discount {discountPercent > 0 ? `(${discountPercent}%)` : ""}:
                </span>
                <div className="text-right">
                  <span>- {formatINR(discountValue)}</span>
                  <span className="text-sm ml-2">
                    (- {formatUSD(discountValue)})
                  </span>
                </div>
              </div>
            )}

            {data.tax && data.tax.taxAmount > 0 && (
              <>
                {data.tax.cgst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>CGST ({data.tax.cgst}%):</span>
                    <div className="text-right">
                      <span>
                        {formatINR(
                          ((data.subtotal - discountValue) * data.tax.cgst) /
                            100,
                        )}
                      </span>
                      <span className="text-sm text-slate-500 ml-2">
                        (
                        {formatUSD(
                          ((data.subtotal - discountValue) * data.tax.cgst) /
                            100,
                        )}
                        )
                      </span>
                    </div>
                  </div>
                )}
                {data.tax.sgst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>SGST ({data.tax.sgst}%):</span>
                    <div className="text-right">
                      <span>
                        {formatINR(
                          ((data.subtotal - discountValue) * data.tax.sgst) /
                            100,
                        )}
                      </span>
                      <span className="text-sm text-slate-500 ml-2">
                        (
                        {formatUSD(
                          ((data.subtotal - discountValue) * data.tax.sgst) /
                            100,
                        )}
                        )
                      </span>
                    </div>
                  </div>
                )}
                {data.tax.igst && (
                  <div className="flex justify-between p-2 border-b border-slate-300">
                    <span>IGST ({data.tax.igst}%):</span>
                    <div className="text-right">
                      <span>
                        {formatINR(
                          ((data.subtotal - discountValue) * data.tax.igst) /
                            100,
                        )}
                      </span>
                      <span className="text-sm text-slate-500 ml-2">
                        (
                        {formatUSD(
                          ((data.subtotal - discountValue) * data.tax.igst) /
                            100,
                        )}
                        )
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {shippingValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300">
                <span>Shipping Charges:</span>
                <div className="text-right">
                  <span>{formatINR(shippingValue)}</span>
                  <span className="text-sm text-slate-500 ml-2">
                    ({formatUSD(shippingValue)})
                  </span>
                </div>
              </div>
            )}

            {otherValue > 0 && (
              <div className="flex justify-between p-2 border-b border-slate-300">
                <span>Other Charges:</span>
                <div className="text-right">
                  <span>{formatINR(otherValue)}</span>
                  <span className="text-sm text-slate-500 ml-2">
                    ({formatUSD(otherValue)})
                  </span>
                </div>
              </div>
            )}

            {/* Total in INR */}
            <div className="flex justify-between p-3 bg-green-50 font-bold text-lg border-b border-slate-300">
              <span className="flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                Total (INR):
              </span>
              <span className="text-green-700">{formatINR(data.total)}</span>
            </div>

            {/* Total in USD */}
            <div className="flex justify-between p-3 bg-blue-50 font-bold text-lg">
              <span className="flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                Total (USD):
              </span>
              <span className="text-blue-700">{formatUSD(data.total)}</span>
            </div>
          </div>
        </div>

        {/* Exchange Rate Note */}
        <div className="mb-4 text-xs text-slate-500 text-right">
          Exchange Rate: {exchangeRateInfo.formattedRate}
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
        <div className="mt-8 border-t-2 border-slate-800 pt-4">
          <div className="flex justify-end mb-12">
            <div className="text-center">
              <p className="font-semibold">Authorized Signatory for APACS</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center">
              <span>Name of</span>
              <span className="mx-2 border-b border-black flex-grow"></span>
              <span>packhouse incharge</span>
            </div>
            <div className="flex items-center">
              <span>Sign of</span>
              <span className="mx-2 border-b border-black flex-grow"></span>
              <span>packhouse incharge</span>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-end">
            <div className="text-xs text-slate-600">
              <p className="italic">This is a computer generated invoice</p>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-slate-800 pt-2 mt-8 min-w-[200px]">
                <p className="font-semibold text-sm">Authorized Signatory</p>
                <p className="text-xs text-slate-600">{companyDetails.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplate;
