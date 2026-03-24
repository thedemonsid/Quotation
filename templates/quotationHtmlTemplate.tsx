"use client";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Phone, Mail, MapPin } from "lucide-react";
import { useQuotationStore } from "@/store/quotation";
import type { QuotationData } from "@/types/quotation";
import { Input } from "@/components/ui/input";

interface QuotationTemplateProps {
  data: QuotationData;
}

const QuotationTemplate: React.FC<QuotationTemplateProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { companyDetails } = useQuotationStore();

  // State to manage editable descriptions
  const [itemDescriptions, setItemDescriptions] = useState<{
    [key: string]: string;
  }>(
    data.items.reduce((acc, item) => {
      acc[item.id] = item.description;
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleDescriptionChange = (itemId: string, value: string) => {
    setItemDescriptions((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Quotation-${data.quotationNumber}`,
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 print:hidden">
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">
          Quotation Preview
        </h1>
        <Button
          onClick={reactToPrintFn}
          size="sm"
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg self-end sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden xs:inline">Print Quotation</span>
          <span className="xs:hidden">Print</span>
        </Button>
      </div>

      <div
        ref={contentRef}
        className="bg-white p-3 sm:p-6 print:p-6 shadow-lg min-h-[297mm]"
      >
        {/* Header Section - Compact Layout */}
        <div className="mb-3">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-slate-700 rounded-full mb-3"></div>
          <div className="flex flex-col lg:flex-row print:flex-row justify-between items-start gap-4 lg:gap-0 print:gap-0">
            <div className="flex-1 w-full lg:w-auto print:w-auto">
              <h1 className="text-xl sm:text-2xl print:text-2xl font-bold text-slate-800 mb-1 break-words print:break-normal">
                <span className="text-cyan-600">
                  {companyDetails.name.split(" ")[0]}{" "}
                  {companyDetails.name.split(" ")[1]}
                </span>
                <span className="text-slate-700">
                  {" "}
                  {companyDetails.name.split(" ").slice(2).join(" ")}
                </span>
              </h1>
              <p className="text-xs text-slate-600 font-medium mb-2 break-words print:break-normal">
                {companyDetails.tagline}
              </p>

              <div className="space-y-0.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 break-words print:break-normal">
                  {companyDetails.ownerName}
                </p>
                <p className="break-words print:break-normal">
                  {companyDetails.address}
                </p>
                <p className="font-semibold text-slate-800 break-all print:break-normal">
                  {companyDetails.phone}
                </p>
                <p className="break-all print:break-normal">
                  {companyDetails.email}
                </p>
                <p className="font-semibold text-slate-800 break-all print:break-normal">
                  GSTIN / VAT ID: {companyDetails.gstin}
                </p>
              </div>
            </div>

            <div className="text-left lg:text-right print:text-right w-full lg:w-auto print:w-auto">
              <h2 className="text-xl sm:text-2xl print:text-2xl font-bold text-slate-800 mb-2">
                Quotation
              </h2>
              <div className="bg-slate-50 p-3 rounded-lg w-full lg:min-w-[200px] print:min-w-[200px]">
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="font-semibold text-slate-700">
                      Quotation#:
                    </span>{" "}
                    <span className="break-all print:break-normal">
                      {data.quotationNumber}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Date:</span>{" "}
                    {data.date}
                  </p>
                  {data.validityPeriod && (
                    <p>
                      <span className="font-semibold text-slate-700">
                        Valid Until:
                      </span>{" "}
                      {data.validityPeriod}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information - Compact */}
        <div className="mb-3">
          <div className="bg-slate-50 p-2 rounded">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">To,</h3>
            <div className="space-y-0.5 text-sm">
              <p className="font-semibold text-slate-800 break-words print:break-normal">
                {data.customerName}
              </p>
              <p className="text-slate-600 break-words print:break-normal">
                {data.customerAddress}
              </p>
              {data.customerPhone && (
                <p className="text-slate-600 font-medium break-all print:break-normal">
                  {data.customerPhone}
                </p>
              )}
              {data.customerEmail && (
                <p className="text-slate-600 break-all print:break-normal">
                  {data.customerEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* LUT Statement for Export */}
        <div className="mb-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="text-xs sm:text-sm font-semibold text-yellow-800">
              Supply Meant For Export Under Letter of Undertaking Without
              Payment Of Integrated Goods and Service Tax(IGST)
            </p>
            <p className="text-xs sm:text-sm font-semibold text-yellow-800 mt-1">
              LUT NO- AD270925026009Y
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-4">
          <p className="text-sm text-slate-700 font-medium">
            Dear Sir/Madam, Thank you for your valuable inquiry. We are pleased
            to quote as below:
          </p>
        </div>

        {/* Items Table - Compact */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 text-sm mb-2">
            Item Details
          </h3>
          <div className="bg-slate-50 p-2 rounded">
            <div className="overflow-x-auto print:overflow-x-visible">
              <table className="w-full text-xs min-w-[500px] print:min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1 font-bold text-slate-800 w-6">
                      #
                    </th>
                    <th className="text-left py-1 font-bold text-slate-800 min-w-[120px] print:min-w-0">
                      DESCRIPTION
                    </th>
                    <th className="text-center py-1 font-bold text-slate-800 min-w-[60px] print:min-w-0">
                      QTY
                    </th>
                    <th className="text-right py-1 font-bold text-slate-800 min-w-[80px] print:min-w-0">
                      PRICE
                    </th>
                    <th className="text-right py-1 font-bold text-slate-800 min-w-[80px] print:min-w-0">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-1 font-medium text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-1">
                        <Input
                          value={itemDescriptions[item.id]}
                          onChange={(e) =>
                            handleDescriptionChange(item.id, e.target.value)
                          }
                          className="font-medium text-slate-800 border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 text-xs min-h-[28px] print:border-none print:p-0 print:shadow-none"
                        />
                      </td>
                      <td className="py-1 text-center font-medium text-slate-800">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-1 text-right font-bold text-slate-800">
                        ${item.rate.toFixed(4)}
                      </td>
                      <td className="py-1 text-right font-bold text-slate-800">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="mb-3 w-full sm:w-72 print:w-72 sm:ml-auto print:ml-auto">
          <div className="bg-slate-50 p-3 rounded">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700">SUB TOTAL:</span>
                <span className="font-bold text-slate-800">
                  ${data.subtotal.toFixed(2)}
                </span>
              </div>
              {data.discount && (
                <div className="flex justify-between items-center text-sm text-red-600">
                  <span className="font-medium">Round-off:</span>
                  <span className="font-bold">
                    -${data.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">GRAND TOTAL:</span>
                <span className="font-bold text-slate-800">
                  ${data.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mb-3 text-center">
          <p className="text-sm text-slate-700 font-medium">
            We hope you find our offer to be in line with your requirement.
          </p>
        </div>

        {/* Terms and Payment Information */}
        {data.terms && data.terms.length > 0 && (
          <div className="mb-3">
            <h3 className="font-bold text-slate-800 text-sm mb-2">
              Terms & Conditions
            </h3>
            <div className="bg-slate-50 p-2 rounded">
              <div className="space-y-1">
                {data.terms.map((term, index) => (
                  <p
                    key={index}
                    className="text-xs text-slate-700 font-medium break-words print:break-normal"
                  >
                    {term}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Signature Section */}
        <div className="mb-4">
          <div className="flex justify-center sm:justify-end print:justify-end">
            <div className="text-center">
              <div className="h-12 mb-2"></div>
              <Separator className="w-32 mb-2" />
              <p className="text-sm font-bold text-slate-800 break-words print:break-normal">
                For, {companyDetails.name}
              </p>
              <p className="text-xs text-slate-600">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start sm:items-center print:items-center gap-2 sm:gap-0 print:gap-0 text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row print:flex-row items-start sm:items-center print:items-center gap-2 sm:gap-4 print:gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="break-all print:break-normal">
                  {companyDetails.phone}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="break-all print:break-normal">
                  {companyDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="break-words print:break-normal">
                  {companyDetails.address}
                </span>
              </div>
            </div>
            <div className="self-end sm:self-auto print:self-auto">
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Bottom decorative strip */}
        <div className="mt-4 h-2 bg-gradient-to-r from-cyan-500 to-slate-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default QuotationTemplate;

// Sample data for testing
export const sampleQuotationData: QuotationData = {
  quotationNumber: "Quote-banana ventures shinde's",
  date: "12-07-2025",
  customerName: "Green World International LLC",
  customerAddress: "Iran",
  customerPhone: "+98 9122339891",
  customerEmail: "manager@greenworldintco.com",
  items: [
    {
      id: "1",
      description: "Banana box 13 kg NW",
      quantity: 1540,
      unit: "box",
      rate: 8.02,
      amount: 12350.8,
    },
  ],
  subtotal: 12350.8,
  tax: 0,
  discount: 0.8,
  total: 12350.0,
  validityPeriod: "2025-07-25",
  terms: [
    "Terms & Conditions: CIF",
    "Payment Instructions: Banana Ventures Shinde's",
    "Account - 60521459884",
    "IFSC code - MAHB00011669",
    "GSTIN: 27SYEPS7484G1ZC",
  ],
};
