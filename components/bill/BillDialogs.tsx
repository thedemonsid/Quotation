"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBillStore } from "@/store/bill";

interface CompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BillCompanyDetailsDialog: React.FC<CompanyDetailsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { companyDetails, updateCompanyDetails } = useBillStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={companyDetails.name}
              onChange={(e) => updateCompanyDetails({ name: e.target.value })}
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={companyDetails.tagline}
              onChange={(e) =>
                updateCompanyDetails({ tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Owner Name</Label>
            <Input
              value={companyDetails.ownerName}
              onChange={(e) =>
                updateCompanyDetails({ ownerName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={companyDetails.address}
              onChange={(e) =>
                updateCompanyDetails({ address: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={companyDetails.phone}
              onChange={(e) => updateCompanyDetails({ phone: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={companyDetails.email}
              onChange={(e) => updateCompanyDetails({ email: e.target.value })}
            />
          </div>
          <div>
            <Label>GSTIN / VAT ID</Label>
            <Input
              value={companyDetails.gstin}
              onChange={(e) => updateCompanyDetails({ gstin: e.target.value })}
            />
          </div>
          <div>
            <Label>PAN Number (Optional)</Label>
            <Input
              value={companyDetails.panNumber || ""}
              onChange={(e) =>
                updateCompanyDetails({ panNumber: e.target.value })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BillPaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { paymentDetails, updatePaymentDetails } = useBillStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Bank Name</Label>
            <Input
              value={paymentDetails.bankName}
              onChange={(e) =>
                updatePaymentDetails({ bankName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Account Holder Name</Label>
            <Input
              value={paymentDetails.accountHolderName}
              onChange={(e) =>
                updatePaymentDetails({ accountHolderName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              value={paymentDetails.accountNumber}
              onChange={(e) =>
                updatePaymentDetails({ accountNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label>IFSC Code</Label>
            <Input
              value={paymentDetails.ifscCode}
              onChange={(e) =>
                updatePaymentDetails({ ifscCode: e.target.value })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
