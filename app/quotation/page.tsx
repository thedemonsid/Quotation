"use client";
import React from "react";
import { FileText, Download, Plus, Trash2 } from "lucide-react";

const QuotationPDFGenerator = () => {
  // Mock data based on the uploaded PDF
  const mockData = {
    companyName: "DSP Agro Exims",
    companyAddress: "Wadshivane\nTembhurni\nMaharashtra\nIndia",
    contactPerson: "Shrikant Panhalkar",
    phone: "7249607077",
    email: "ceo@dspagroexims.com",
    gstin: "27EPNPP0386G1ZF",

    clientName: "Tariq ALShamal Food Stuff Trading LLC",
    clientAddress: "Dubai",
    clientPhone: "+9712589314436",
    clientEmail: "tariqalshamalfoodstufftradingllc@gmail.com",

    quotationNumber: "Quote-Dsp5",
    date: "06-07-2025",

    items: [
      {
        description: "Banana box\nBanana box 13 kg NW",
        quantity: 1540,
        unit: "box",
        price: 8.02,
      },
    ],

    accountName: "DSP Agro Exims",
    accountNumber: "50200100003963",
    ifscCode: "HDFC0004476",
    terms: "CIF",
  };

  const calculateSubtotal = () => {
    return mockData.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const roundOff = Math.round(subtotal) - subtotal;
  const grandTotal = Math.round(subtotal);

  const generatePDF = () => {
    const pdfContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation - Quote-Dsp5</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
        }
    </style>
</head>
<body class="bg-white font-sans text-gray-900 pb-8 max-w-4xl mx-auto">
    
    <!-- Header -->
    <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">DSP Agro Exims</h1>
        <p class="text-sm text-gray-700">Shrikant Panhalkar</p>
        <p class="text-sm text-gray-700">Wadshivane, Tembhurni</p>
        <p class="text-sm text-gray-700">Maharashtra, India</p>
        <p class="text-sm text-gray-700 mt-2">7249607077 | ceo@dspagroexims.com</p>
        <p class="text-sm text-gray-700">GSTIN: 27EPNPP0386G1ZF</p>
    </div>

    <!-- Quotation Title -->
    <div class="text-center mb-8">
        <h2 class="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 inline-block">QUOTATION</h2>
    </div>

    <!-- Client Information -->
    <div class="mb-6">
        <p class="text-sm font-semibold text-gray-900 mb-2">To,</p>
        <p class="text-sm font-semibold text-gray-900">Tariq ALShamal Food Stuff Trading LLC</p>
        <p class="text-sm text-gray-700">Dubai</p>
        <p class="text-sm text-gray-700">+9712589314436</p>
        <p class="text-sm text-gray-700">tariqalshamalfoodstufftradingllc@gmail.com</p>
    </div>

    <!-- Quote Details -->
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
            <p class="text-sm"><span class="font-semibold">Quotation#:</span> Quote-Dsp5</p>
        </div>
        <div class="text-right">
            <p class="text-sm"><span class="font-semibold">Date:</span> 06-07-2025</p>
        </div>
    </div>

    <!-- Greeting -->
    <div class="mb-6">
        <p class="text-sm text-gray-700">Dear Sir/Mam,</p>
        <p class="text-sm text-gray-700 mt-2">Thank you for your valuable inquiry. We are pleased to quote as below:</p>
    </div>

    <!-- Items Table -->
    <div class="mb-6">
        <table class="w-full border-collapse border border-gray-400">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border border-gray-400 px-3 py-2 text-left text-sm font-semibold w-12">#</th>
                    <th class="border border-gray-400 px-3 py-2 text-left text-sm font-semibold">DESCRIPTION</th>
                    <th class="border border-gray-400 px-3 py-2 text-center text-sm font-semibold w-20">QTY</th>
                    <th class="border border-gray-400 px-3 py-2 text-right text-sm font-semibold w-24">PRICE</th>
                    <th class="border border-gray-400 px-3 py-2 text-right text-sm font-semibold w-28">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="border border-gray-400 px-3 py-2 text-sm">1</td>
                    <td class="border border-gray-400 px-3 py-2 text-sm">
                        <div class="font-medium">Banana box</div>
                        <div class="text-gray-600">Banana box 13 kg NW</div>
                    </td>
                    <td class="border border-gray-400 px-3 py-2 text-center text-sm">1540 box</td>
                    <td class="border border-gray-400 px-3 py-2 text-right text-sm">$8.02</td>
                    <td class="border border-gray-400 px-3 py-2 text-right text-sm font-semibold">$12,350.80</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Totals -->
    <div class="flex justify-end mb-8">
        <div class="w-64">
            <table class="w-full border-collapse border border-gray-400">
                <tr>
                    <td class="border border-gray-400 px-3 py-2 text-sm font-semibold">SUB TOTAL</td>
                    <td class="border border-gray-400 px-3 py-2 text-right text-sm font-semibold">$12,350.80</td>
                </tr>
                <tr>
                    <td class="border border-gray-400 px-3 py-2 text-sm">Round-off</td>
                    <td class="border border-gray-400 px-3 py-2 text-right text-sm">-$0.80</td>
                </tr>
                <tr class="bg-gray-100">
                    <td class="border border-gray-400 px-3 py-2 text-sm font-bold">GRAND TOTAL</td>
                    <td class="border border-gray-400 px-3 py-2 text-right text-sm font-bold">$12,350.00</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- Message -->
    <div class="mb-8">
        <p class="text-sm text-gray-700">We hope you find our offer to be in line with your requirement.</p>
    </div>

    <!-- Terms & Payment -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Terms -->
        <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Terms & Conditions:</h4>
            <ul class="text-sm text-gray-700">
                <li>• CIF</li>
            </ul>
        </div>
        
        <!-- Payment -->
        <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Payment Instructions</h4>
            <div class="text-sm text-gray-700">
                <p class="font-medium">DSP Agro Exims</p>
                <p>Account - 50200100003963</p>
                <p>IFSC code - HDFC0004476</p>
            </div>
        </div>
    </div>

    <!-- Signature -->
    <div class="flex justify-between items-end mb-8">
        <div></div>
        <div class="text-right">
            <p class="text-sm font-semibold text-gray-900 mb-8">For, DSP AGRO EXIMS</p>
            <div class="border-t border-gray-400 pt-2" style="min-width: 200px;">
                <p class="text-sm font-semibold text-gray-900">AUTHORIZED SIGNATURE</p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-xs text-gray-500 border-t border-gray-300 pt-2">
        <p>Page 1 of 1</p>
    </div>

    <!-- Print Button -->
    <div class="no-print mt-6 text-center">
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors">
            Print Quotation
        </button>
    </div>

</body>
</html>`;

    const blob = new Blob([pdfContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotation-${mockData.quotationNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Quotation Generator
              </h1>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Generate PDF
            </button>
          </div>

          {/* Company Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={mockData.companyName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={mockData.contactPerson}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Address
                </label>
                <textarea
                  value={mockData.companyAddress}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={mockData.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={mockData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={mockData.gstin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Client Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={mockData.clientName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={mockData.clientAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={mockData.clientPhone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={mockData.clientEmail}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Quote Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Quote Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={mockData.quotationNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={mockData.date}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Items</h2>
              <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      #
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Unit
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Total
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <textarea
                          value={item.description}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={item.unit}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={item.price}
                          step="0.01"
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          readOnly
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="mb-8">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Sub Total:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Round-off:</span>
                    <span>
                      {roundOff >= 0 ? "" : "-"}${Math.abs(roundOff).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-300">
                    <span>Grand Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Payment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={mockData.accountName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={mockData.accountNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={mockData.ifscCode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Terms
                </label>
                <input
                  type="text"
                  value={mockData.terms}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPDFGenerator;
