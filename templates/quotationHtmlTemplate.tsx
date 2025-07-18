"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-end">
        <Button onClick={reactToPrintFn} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Quotation
        </Button>
      </div>

      <div ref={contentRef} className="bg-white">
        {/* Header Section with Banana Venture Shinde's branding */}
        <div className="relative mb-8">
          {/* Top decorative strip */}
          <div className="h-12 bg-gradient-to-r from-cyan-400 via-teal-500 to-slate-700 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-700 via-cyan-400 to-teal-500 transform -skew-x-12 origin-top-left"></div>
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-700 via-cyan-400 to-teal-500 transform skew-x-12 origin-top-right"></div>
          </div>

          {/* Company Logo and Name */}
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              {/* Palm tree icon - using a simple representation */}
              <div className="mb-2 flex justify-center">
                <div className="w-12 h-12 text-slate-700 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full fill-current"
                  >
                    <path d="M12 2L8 6h3v14h2V6h3l-4-4z" />
                    <path d="M6 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm12 0c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  <span className="text-cyan-500">BANANA VENTURE</span>
                  <span className="text-slate-700 ml-2">Shinde's</span>
                </div>
                <div className="text-sm text-slate-600 italic">
                  Quality is our identity
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-700 mb-2">
                  QUOTATION
                </h1>
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Quotation No:</span>{" "}
                    {data.quotationNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {data.date}
                  </p>
                  {data.validityPeriod && (
                    <p>
                      <span className="font-semibold">Valid Until:</span>{" "}
                      {data.validityPeriod}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-slate-700 mb-2">Bill To:</h3>
                <div className="space-y-1">
                  <p className="font-semibold">{data.customerName}</p>
                  <p className="text-sm text-slate-600 whitespace-pre-line">
                    {data.customerAddress}
                  </p>
                  {data.customerPhone && (
                    <p className="text-sm text-slate-600">
                      {data.customerPhone}
                    </p>
                  )}
                  {data.customerEmail && (
                    <p className="text-sm text-slate-600">
                      {data.customerEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Items Table */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="text-left p-4 font-semibold text-slate-700">
                      Description
                    </th>
                    <th className="text-center p-4 font-semibold text-slate-700">
                      Qty
                    </th>
                    <th className="text-center p-4 font-semibold text-slate-700">
                      Unit
                    </th>
                    <th className="text-right p-4 font-semibold text-slate-700">
                      Rate
                    </th>
                    <th className="text-right p-4 font-semibold text-slate-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-25"}
                    >
                      <td className="p-4 border-b border-slate-100">
                        {item.description}
                      </td>
                      <td className="p-4 text-center border-b border-slate-100">
                        {item.quantity}
                      </td>
                      <td className="p-4 text-center border-b border-slate-100">
                        {item.unit}
                      </td>
                      <td className="p-4 text-right border-b border-slate-100">
                        ₹{item.rate.toFixed(2)}
                      </td>
                      <td className="p-4 text-right border-b border-slate-100">
                        ₹{item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Totals Section */}
        <div className="flex justify-end mb-6">
          <Card className="w-80">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{data.subtotal.toFixed(2)}</span>
                </div>
                {data.discount && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{data.discount.toFixed(2)}</span>
                  </div>
                )}
                {data.tax && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{data.tax.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{data.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms and Conditions */}
        {data.terms && data.terms.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="font-semibold text-slate-700">
                Terms & Conditions
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.terms.map((term, index) => (
                  <li key={index} className="text-sm text-slate-600">
                    {index + 1}. {term}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Footer with Contact Information */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 74001 00181</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>bananaventures.shinde@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jategaon, Solapur, Maharashtra, India (413003)</span>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Bottom decorative strip */}
        <div className="mt-8 h-12 bg-gradient-to-r from-cyan-400 via-teal-500 to-slate-700 relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-32 h-full bg-gradient-to-r from-slate-700 via-cyan-400 to-teal-500 transform skew-x-12 origin-bottom-left"></div>
          <div className="absolute right-0 bottom-0 w-32 h-full bg-gradient-to-l from-slate-700 via-cyan-400 to-teal-500 transform -skew-x-12 origin-bottom-right"></div>
        </div>
      </div>
    </div>
  );
};

export default QuotationTemplate;

// Sample data for testing
export const sampleQuotationData: QuotationData = {
  quotationNumber: "QT-2025-001",
  date: "2025-07-18",
  customerName: "ABC Industries Ltd.",
  customerAddress: "123 Business Park\nMumbai, Maharashtra 400001",
  customerPhone: "+91 98765 43210",
  customerEmail: "contact@abcindustries.com",
  items: [
    {
      id: "1",
      description: "Premium Export Quality Bananas",
      quantity: 100,
      unit: "kg",
      rate: 50.0,
      amount: 5000.0,
    },
    {
      id: "2",
      description: "Packaging and Handling",
      quantity: 1,
      unit: "lot",
      rate: 500.0,
      amount: 500.0,
    },
    {
      id: "3",
      description: "Transportation",
      quantity: 1,
      unit: "service",
      rate: 1000.0,
      amount: 1000.0,
    },
  ],
  subtotal: 6500.0,
  tax: 1170.0,
  total: 7670.0,
  validityPeriod: "2025-07-25",
  terms: [
    "Payment terms: 30 days from invoice date",
    "Prices are subject to change without notice",
    "Delivery within 7-10 working days",
    "All disputes subject to Solapur jurisdiction",
  ],
};
