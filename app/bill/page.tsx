"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import BillTemplate from "@/templates/billHtmlTemplate";
import { useBillStore } from "@/store/bill";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Lock,
  Edit3,
  Building2,
  User,
  FileText,
  CreditCard,
} from "lucide-react";

const BillPage: React.FC = () => {
  const router = useRouter();
  const {
    companyDetails,
    customerDetails,
    billDetails,
    items,
    subtotal,
    tax,
    discount,
    discountPercentage,
    shippingCharges,
    otherCharges,
    total,
    paymentDetails,
    notes,
    termsAndConditions,
    updateCompanyDetails,
    updateCustomerDetails,
    updateBillDetails,
    addItem,
    removeItem,
    setDiscount,
    setDiscountPercentage,
    setShippingCharges,
    setOtherCharges,
    setTax,
    updatePaymentDetails,
    updateNotes,
    updateTerms,
    calculateTotal,
    getBillData,
  } = useBillStore();

  const [showPreview, setShowPreview] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    hsn: "",
    quantity: 1,
    unit: "Nos",
    rate: 0,
  });

  // Tax configuration
  const [taxConfig, setTaxConfig] = useState({
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  useEffect(() => {
    calculateTotal();
  }, [items, discount, shippingCharges, otherCharges, tax, calculateTotal]);

  // Update tax when tax config changes
  useEffect(() => {
    const taxableAmount = subtotal - discount;
    const cgstAmount = (taxableAmount * taxConfig.cgst) / 100;
    const sgstAmount = (taxableAmount * taxConfig.sgst) / 100;
    const igstAmount = (taxableAmount * taxConfig.igst) / 100;
    const totalTax = cgstAmount + sgstAmount + igstAmount;

    setTax({
      cgst: taxConfig.cgst > 0 ? taxConfig.cgst : undefined,
      sgst: taxConfig.sgst > 0 ? taxConfig.sgst : undefined,
      igst: taxConfig.igst > 0 ? taxConfig.igst : undefined,
      taxAmount: totalTax,
    });
  }, [taxConfig, subtotal, discount, setTax]);

  const handleAddItem = () => {
    if (!newItem.description || newItem.rate <= 0) {
      alert("Please fill in item description and rate");
      return;
    }

    const item = {
      id: Date.now().toString(),
      description: newItem.description,
      hsn: newItem.hsn,
      quantity: newItem.quantity,
      unit: newItem.unit,
      rate: newItem.rate,
      amount: newItem.quantity * newItem.rate,
    };

    addItem(item);
    setNewItem({
      description: "",
      hsn: "",
      quantity: 1,
      unit: "Nos",
      rate: 0,
    });
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Billing System
              </h1>
              <p className="text-gray-600">
                Please sign in to access the bill generation system
              </p>
            </div>
            <SignInButton>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                Sign In to Continue
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {showPreview ? (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto mb-4">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Button>
            </div>
            <BillTemplate
              data={getBillData()}
              companyDetails={companyDetails}
            />
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Generate Bill / Tax Invoice
                  </h1>
                </div>
                <Button
                  onClick={() => setShowPreview(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={items.length === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Preview Bill
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Company Details Card */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-green-600" />
                        Company Details
                      </h2>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Company Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Company Name</Label>
                              <Input
                                value={companyDetails.name}
                                onChange={(e) =>
                                  updateCompanyDetails({ name: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Tagline</Label>
                              <Input
                                value={companyDetails.tagline}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    tagline: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Owner Name</Label>
                              <Input
                                value={companyDetails.ownerName}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    ownerName: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Address</Label>
                              <Textarea
                                value={companyDetails.address}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    address: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={companyDetails.phone}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={companyDetails.email}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>GSTIN</Label>
                              <Input
                                value={companyDetails.gstin}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    gstin: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>PAN Number (Optional)</Label>
                              <Input
                                value={companyDetails.panNumber || ""}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    panNumber: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-sm space-y-1 text-gray-600">
                      <p className="font-semibold text-gray-900">
                        {companyDetails.name}
                      </p>
                      <p>{companyDetails.address}</p>
                      <p>GSTIN: {companyDetails.gstin}</p>
                    </div>
                  </Card>

                  {/* Customer Details Card */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Customer Details
                      </h2>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Customer Name *</Label>
                        <Input
                          value={customerDetails.name}
                          onChange={(e) =>
                            updateCustomerDetails({ name: e.target.value })
                          }
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <Label>Address *</Label>
                        <Textarea
                          value={customerDetails.address}
                          onChange={(e) =>
                            updateCustomerDetails({ address: e.target.value })
                          }
                          placeholder="Enter customer address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={customerDetails.phone || ""}
                            onChange={(e) =>
                              updateCustomerDetails({ phone: e.target.value })
                            }
                            placeholder="Phone number"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={customerDetails.email || ""}
                            onChange={(e) =>
                              updateCustomerDetails({ email: e.target.value })
                            }
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Customer GSTIN</Label>
                        <Input
                          value={customerDetails.gstin || ""}
                          onChange={(e) =>
                            updateCustomerDetails({ gstin: e.target.value })
                          }
                          placeholder="Customer GST number"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Bill Details Card */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Bill Details
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Bill Number</Label>
                        <Input
                          value={billDetails.billNumber}
                          onChange={(e) =>
                            updateBillDetails({ billNumber: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Bill Date</Label>
                        <Input
                          type="date"
                          value={billDetails.billDate}
                          onChange={(e) =>
                            updateBillDetails({ billDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={billDetails.dueDate || ""}
                          onChange={(e) =>
                            updateBillDetails({ dueDate: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>PO Number (Optional)</Label>
                        <Input
                          value={billDetails.purchaseOrderNumber || ""}
                          onChange={(e) =>
                            updateBillDetails({
                              purchaseOrderNumber: e.target.value,
                            })
                          }
                          placeholder="Purchase Order No."
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Items Card */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Items</h2>

                    {/* Add Item Form */}
                    <div className="bg-green-50 p-4 rounded-lg mb-4 space-y-3">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <Label className="text-xs">Description *</Label>
                          <Input
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                            placeholder="Item description"
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">HSN/SAC</Label>
                          <Input
                            value={newItem.hsn}
                            onChange={(e) =>
                              setNewItem({ ...newItem, hsn: e.target.value })
                            }
                            placeholder="HSN code"
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Quantity *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={
                              newItem.quantity === 0 ? "" : newItem.quantity
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewItem({
                                ...newItem,
                                quantity:
                                  value === "" ? 0 : parseFloat(value) || 0,
                              });
                            }}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Unit</Label>
                          <Input
                            value={newItem.unit}
                            onChange={(e) =>
                              setNewItem({ ...newItem, unit: e.target.value })
                            }
                            placeholder="Nos"
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Rate (₹) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItem.rate === 0 ? "" : newItem.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewItem({
                                ...newItem,
                                rate: value === "" ? 0 : parseFloat(value) || 0,
                              });
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddItem}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    {/* Items List */}
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-sm">
                                {index + 1}. {item.description}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.quantity} {item.unit} ×{" "}
                                {formatINR(item.rate)} ={" "}
                                {formatINR(item.amount)}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No items added yet
                      </p>
                    )}
                  </Card>

                  {/* Payment Details Card */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Payment Details
                    </h2>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
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
                          <Label>Account Holder</Label>
                          <Input
                            value={paymentDetails.accountHolderName}
                            onChange={(e) =>
                              updatePaymentDetails({
                                accountHolderName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Account Number</Label>
                          <Input
                            value={paymentDetails.accountNumber}
                            onChange={(e) =>
                              updatePaymentDetails({
                                accountNumber: e.target.value,
                              })
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
                    </div>
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                  {/* Financial Summary Card */}
                  <Card className="p-6 sticky top-4">
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <div className="space-y-4">
                      {/* Tax Configuration */}
                      <div className="space-y-2 pb-4 border-b">
                        <Label className="font-semibold">
                          Tax Configuration
                        </Label>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">CGST %</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={taxConfig.cgst === 0 ? "" : taxConfig.cgst}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTaxConfig({
                                  ...taxConfig,
                                  cgst:
                                    value === "" ? 0 : parseFloat(value) || 0,
                                });
                              }}
                              placeholder="0"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">SGST %</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={taxConfig.sgst === 0 ? "" : taxConfig.sgst}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTaxConfig({
                                  ...taxConfig,
                                  sgst:
                                    value === "" ? 0 : parseFloat(value) || 0,
                                });
                              }}
                              placeholder="0"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">IGST %</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={taxConfig.igst === 0 ? "" : taxConfig.igst}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTaxConfig({
                                  ...taxConfig,
                                  igst:
                                    value === "" ? 0 : parseFloat(value) || 0,
                                });
                              }}
                              placeholder="0"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Other Charges */}
                      <div className="space-y-2 pb-4 border-b">
                        <div>
                          <Label className="text-xs">Discount</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={discount === 0 ? "" : discount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDiscount(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Or Discount %</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              discountPercentage === 0 ? "" : discountPercentage
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setDiscountPercentage(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Shipping Charges</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={shippingCharges === 0 ? "" : shippingCharges}
                            onChange={(e) => {
                              const value = e.target.value;
                              setShippingCharges(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Other Charges</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={otherCharges === 0 ? "" : otherCharges}
                            onChange={(e) => {
                              const value = e.target.value;
                              setOtherCharges(
                                value === "" ? 0 : parseFloat(value) || 0
                              );
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-semibold">
                            {formatINR(subtotal)}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Discount:</span>
                            <span>- {formatINR(discount)}</span>
                          </div>
                        )}
                        {tax && tax.taxAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>{formatINR(tax.taxAmount)}</span>
                          </div>
                        )}
                        {shippingCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>{formatINR(shippingCharges)}</span>
                          </div>
                        )}
                        {otherCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Other:</span>
                            <span>{formatINR(otherCharges)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t-2">
                          <span>Total:</span>
                          <span className="text-green-600">
                            {formatINR(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </>
  );
};

export default BillPage;
