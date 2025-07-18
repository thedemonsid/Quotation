import React from "react";
import QuotationTemplate, {
  sampleQuotationData,
} from "@/templates/quotationHtmlTemplate";

const QuotationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Quotation Generator
        </h1>

        <QuotationTemplate data={sampleQuotationData} />
      </div>
    </div>
  );
};

export default QuotationPage;
