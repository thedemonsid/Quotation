"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Phone, Mail, MapPin } from "lucide-react";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface QuotationData {
  quotationNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  items: QuotationItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  validityPeriod?: string;
  terms?: string[];
}

interface QuotationTemplateProps {
  data: QuotationData;
}

const QuotationTemplate: React.FC<QuotationTemplateProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Quotation-${data.quotationNumber}`,
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Quotation Preview</h1>
        <Button
          onClick={reactToPrintFn}
          size="sm"
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
        >
          <Printer className="w-4 h-4" />
          Print Quotation
        </Button>
      </div>

      <div ref={contentRef} className="bg-white p-6 shadow-lg min-h-[297mm]">
        {/* Header Section - Compact Layout */}
        <div className="mb-3">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-slate-700 rounded-full mb-3"></div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                <span className="text-cyan-600">BANANA VENTURES</span>
                <span className="text-slate-700"> SHINDE'S</span>
              </h1>
              <p className="text-xs text-slate-600 font-medium mb-2">
                Quality is our identity
              </p>

              <div className="space-y-0.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">
                  Pruthviraj Shinde
                </p>
                <p>Jategaon, Karmala, Maharashtra India</p>
                <p className="font-semibold text-slate-800">+91 9169700222</p>
                <p>bananaventures.shindes@gmail.com</p>
                <p className="font-semibold text-slate-800">
                  GSTIN: 27SYEPS7484G1ZC
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Quotation
              </h2>
              <div className="bg-slate-50 p-3 rounded-lg min-w-[200px]">
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="font-semibold text-slate-700">
                      Quotation#:
                    </span>{" "}
                    {data.quotationNumber}
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
              <p className="font-semibold text-slate-800">
                {data.customerName}
              </p>
              <p className="text-slate-600">{data.customerAddress}</p>
              {data.customerPhone && (
                <p className="text-slate-600 font-medium">
                  {data.customerPhone}
                </p>
              )}
              {data.customerEmail && (
                <p className="text-slate-600">{data.customerEmail}</p>
              )}
            </div>
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
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1 font-bold text-slate-800 w-6">
                      #
                    </th>
                    <th className="text-left py-1 font-bold text-slate-800">
                      DESCRIPTION
                    </th>
                    <th className="text-center py-1 font-bold text-slate-800">
                      QTY
                    </th>
                    <th className="text-right py-1 font-bold text-slate-800">
                      PRICE
                    </th>
                    <th className="text-right py-1 font-bold text-slate-800">
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
                        <div className="font-medium text-slate-800">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-1 text-center font-medium text-slate-800">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-1 text-right font-bold text-slate-800">
                        ${item.rate.toFixed(2)}
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
        <div className="mb-3 w-72 ml-auto">
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
              {/* {data.tax && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">Tax:</span>
                  <span className="font-bold text-slate-800">
                    ${data.tax.toFixed(2)}
                  </span>
                </div>
              )} */}
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
                  <p key={index} className="text-xs text-slate-700 font-medium">
                    {term}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Signature Section */}
        <div className="mb-4">
          <div className="flex justify-end">
            <div className="text-center">
              <div className="h-12 mb-2"></div>
              <Separator className="w-32 mb-2" />
              <p className="text-sm font-bold text-slate-800">
                For, Banana Ventures Shinde's
              </p>
              <p className="text-xs text-slate-600">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>+91 9169700222</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>bananaventures.shindes@gmail.com</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Jategaon, Karmala, Maharashtra, India</span>
              </div>
            </div>
            <div>
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
