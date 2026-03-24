"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuotationStore } from "@/store/quotation";
import { Building, User, FileText } from "lucide-react";

export function CompanyDetailsDialog() {
  const { companyDetails, updateCompanyDetails } = useQuotationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(companyDetails);

  const handleSave = () => {
    updateCompanyDetails(formData);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData(companyDetails);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <Building className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Company Details</span>
          <span className="xs:hidden">Company</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
          <DialogDescription>
            Update your company information that will appear on the quotation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="sm:text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="tagline" className="sm:text-right">
              Tagline
            </Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="ownerName" className="sm:text-right">
              Owner
            </Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) =>
                setFormData({ ...formData, ownerName: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="phone" className="sm:text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="email" className="sm:text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="gstin" className="sm:text-right">
              GSTIN / VAT ID
            </Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) =>
                setFormData({ ...formData, gstin: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="address" className="sm:text-right">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CustomerDetailsDialog() {
  const { customerDetails, updateCustomerDetails } = useQuotationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(customerDetails);

  const handleSave = () => {
    updateCustomerDetails(formData);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData(customerDetails);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Customer Details</span>
          <span className="xs:hidden">Customer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Update customer information for the quotation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="customerName" className="sm:text-right">
              Name
            </Label>
            <Input
              id="customerName"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="customerPhone" className="sm:text-right">
              Phone
            </Label>
            <Input
              id="customerPhone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="customerEmail" className="sm:text-right">
              Email
            </Label>
            <Input
              id="customerEmail"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="customerAddress" className="sm:text-right">
              Address
            </Label>
            <Textarea
              id="customerAddress"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function QuotationDetailsDialog() {
  const { quotationDetails, updateQuotationDetails, generateQuotationNumber } =
    useQuotationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(quotationDetails);

  const handleSave = () => {
    updateQuotationDetails(formData);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData(quotationDetails);
    setIsOpen(false);
  };

  const handleGenerateQuotationNumber = () => {
    generateQuotationNumber();
    // Update form data with the new quotation number
    setFormData({
      ...formData,
      quotationNumber: quotationDetails.quotationNumber,
    });
  };

  const handleTermsChange = (index: number, value: string) => {
    const newTerms = [...formData.terms];
    newTerms[index] = value;
    setFormData({ ...formData, terms: newTerms });
  };

  const addTerm = () => {
    setFormData({ ...formData, terms: [...formData.terms, ""] });
  };

  const removeTerm = (index: number) => {
    const newTerms = formData.terms.filter((_, i) => i !== index);
    setFormData({ ...formData, terms: newTerms });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Quotation Settings</span>
          <span className="sm:hidden">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>Quotation Settings</DialogTitle>
          <DialogDescription>
            Configure quotation details, dates, and terms & conditions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="quotationNumber" className="sm:text-right">
              Number
            </Label>
            <div className="sm:col-span-3 flex gap-2">
              <Input
                id="quotationNumber"
                value={formData.quotationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, quotationNumber: e.target.value })
                }
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateQuotationNumber}
                className="text-xs"
              >
                Generate
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="date" className="sm:text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="validityPeriod" className="sm:text-right">
              Valid Until
            </Label>
            <Input
              id="validityPeriod"
              type="date"
              value={formData.validityPeriod}
              onChange={(e) =>
                setFormData({ ...formData, validityPeriod: e.target.value })
              }
              className="sm:col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label>Terms & Conditions</Label>
            {formData.terms.map((term, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={term}
                  onChange={(e) => handleTermsChange(index, e.target.value)}
                  placeholder={`Term ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTerm(index)}
                  className="w-full sm:w-auto"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTerm}
              className="self-start w-full sm:w-auto"
            >
              Add Term
            </Button>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
