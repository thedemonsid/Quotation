"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BillTemplate from "@/templates/billHtmlTemplate";
import { useBillStore } from "@/store/bill";
import { useCurrency } from "@/hooks/useCurrency";
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
  DollarSign,
  IndianRupee,
  RefreshCw,
  TrendingUp,
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

    calculateTotal,
    getBillData,
  } = useBillStore();

  // Currency conversion hook
  const {
    convertToUSD,
    formatCurrency,
    getExchangeRateInfo,
    refreshExchangeRate,
    isLoading: currencyLoading,
  } = useCurrency();

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

  // Get exchange rate info for display
  const exchangeRateInfo = getExchangeRateInfo();

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

  const formatUSD = (amount: number) => {
    return formatCurrency(convertToUSD(amount), "USD");
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
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header Bar */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => router.push("/")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Back</span>
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Generate Bill / Tax Invoice
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Exchange Rate Display */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="truncate">
                        {exchangeRateInfo.formattedRate}
                      </span>
                      <Badge
                        variant={
                          exchangeRateInfo.error ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {exchangeRateInfo.error ? "Fallback" : "Live"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshExchangeRate}
                        disabled={currencyLoading}
                        className="p-1 h-7 w-7"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${
                            currencyLoading ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <Button
                      onClick={() => setShowPreview(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={items.length === 0}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Preview Bill</span>
                      <span className="sm:hidden">Preview</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Bar */}
            <div className="bg-white border-b">
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Subtotal</p>
                      <p className="font-semibold text-sm">
                        {formatINR(subtotal)}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Tax</p>
                      <p className="font-semibold text-sm">
                        {formatINR(tax?.taxAmount || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Total (INR)
                      </p>
                      <p className="font-bold text-lg text-green-600">
                        {formatINR(total)}
                      </p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Total (USD)
                      </p>
                      <p className="font-bold text-lg text-blue-600">
                        {formatUSD(total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Company Details Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building2 className="w-5 h-5 text-green-600" />
                          Company Details
                        </CardTitle>
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
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">
                                  Company Name
                                </Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.name}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Tagline</Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.tagline}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      tagline: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Owner Name</Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.ownerName}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      ownerName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Address</Label>
                                <Textarea
                                  className="col-span-3"
                                  value={companyDetails.address}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      address: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Phone</Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.phone}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      phone: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Email</Label>
                                <Input
                                  className="col-span-3"
                                  type="email"
                                  value={companyDetails.email}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">GSTIN</Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.gstin}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      gstin: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">PAN Number</Label>
                                <Input
                                  className="col-span-3"
                                  value={companyDetails.panNumber || ""}
                                  onChange={(e) =>
                                    updateCompanyDetails({
                                      panNumber: e.target.value,
                                    })
                                  }
                                  placeholder="Optional"
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p className="font-semibold text-foreground">
                          {companyDetails.name}
                        </p>
                        <p>{companyDetails.address}</p>
                        <p>GSTIN: {companyDetails.gstin}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Details Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5 text-green-600" />
                        Customer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input
                          id="customerName"
                          value={customerDetails.name}
                          onChange={(e) =>
                            updateCustomerDetails({ name: e.target.value })
                          }
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerAddress">Address *</Label>
                        <Textarea
                          id="customerAddress"
                          value={customerDetails.address}
                          onChange={(e) =>
                            updateCustomerDetails({ address: e.target.value })
                          }
                          placeholder="Enter customer address"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone">Phone</Label>
                          <Input
                            id="customerPhone"
                            value={customerDetails.phone || ""}
                            onChange={(e) =>
                              updateCustomerDetails({ phone: e.target.value })
                            }
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail">Email</Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={customerDetails.email || ""}
                            onChange={(e) =>
                              updateCustomerDetails({ email: e.target.value })
                            }
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerGstin">Customer GSTIN</Label>
                        <Input
                          id="customerGstin"
                          value={customerDetails.gstin || ""}
                          onChange={(e) =>
                            updateCustomerDetails({ gstin: e.target.value })
                          }
                          placeholder="Customer GST number"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bill Details Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                        Bill Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billNumber">Bill Number</Label>
                          <Input
                            id="billNumber"
                            value={billDetails.billNumber}
                            onChange={(e) =>
                              updateBillDetails({ billNumber: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billDate">Bill Date</Label>
                          <Input
                            id="billDate"
                            type="date"
                            value={billDetails.billDate}
                            onChange={(e) =>
                              updateBillDetails({ billDate: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={billDetails.dueDate || ""}
                            onChange={(e) =>
                              updateBillDetails({ dueDate: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="poNumber">PO Number (Optional)</Label>
                          <Input
                            id="poNumber"
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
                    </CardContent>
                  </Card>

                  {/* Items Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add Item Form */}
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-3">
                          <div className="col-span-2 sm:col-span-2 lg:col-span-4 space-y-2">
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
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-2">
                            <Label className="text-xs">HSN/SAC</Label>
                            <Input
                              value={newItem.hsn}
                              onChange={(e) =>
                                setNewItem({ ...newItem, hsn: e.target.value })
                              }
                              placeholder="HSN code"
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-2">
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
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-2">
                            <Label className="text-xs">Unit</Label>
                            <Input
                              value={newItem.unit}
                              onChange={(e) =>
                                setNewItem({ ...newItem, unit: e.target.value })
                              }
                              placeholder="Nos"
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-2">
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
                                  rate:
                                    value === "" ? 0 : parseFloat(value) || 0,
                                });
                              }}
                              placeholder="0.00"
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
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex-1 space-y-1">
                                <p className="font-semibold text-sm">
                                  {index + 1}. {item.description}
                                </p>
                                <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                                  <span>
                                    {item.quantity} {item.unit} ×{" "}
                                    {formatINR(item.rate)}
                                  </span>
                                  <span className="text-foreground font-medium">
                                    = {formatINR(item.amount)}
                                  </span>
                                  <span className="text-blue-600">
                                    ({formatUSD(item.amount)})
                                  </span>
                                </div>
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
                        <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p>No items added yet</p>
                          <p className="text-xs mt-1">
                            Add items using the form above
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Details Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={paymentDetails.bankName}
                            onChange={(e) =>
                              updatePaymentDetails({ bankName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountHolder">Account Holder</Label>
                          <Input
                            id="accountHolder"
                            value={paymentDetails.accountHolderName}
                            onChange={(e) =>
                              updatePaymentDetails({
                                accountHolderName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={paymentDetails.accountNumber}
                            onChange={(e) =>
                              updatePaymentDetails({
                                accountNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={paymentDetails.ifscCode}
                            onChange={(e) =>
                              updatePaymentDetails({ ifscCode: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                  {/* Financial Summary Card */}
                  <Card className="sticky top-24">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Tax Configuration */}
                      <div className="space-y-3">
                        <Label className="font-semibold text-sm">
                          Tax Configuration
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              CGST %
                            </Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              SGST %
                            </Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              IGST %
                            </Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Other Charges */}
                      <div className="space-y-3">
                        <Label className="font-semibold text-sm">
                          Adjustments
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Discount (₹)
                            </Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Discount %
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                discountPercentage === 0
                                  ? ""
                                  : discountPercentage
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setDiscountPercentage(
                                  value === "" ? 0 : parseFloat(value) || 0
                                );
                              }}
                              placeholder="0"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Shipping
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                shippingCharges === 0 ? "" : shippingCharges
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setShippingCharges(
                                  value === "" ? 0 : parseFloat(value) || 0
                                );
                              }}
                              placeholder="0.00"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Other
                            </Label>
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
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Totals */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <div className="text-right">
                            <span className="font-medium">
                              {formatINR(subtotal)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({formatUSD(subtotal)})
                            </span>
                          </div>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between items-center text-red-600">
                            <span>Discount</span>
                            <div className="text-right">
                              <span>- {formatINR(discount)}</span>
                              <span className="text-xs ml-2">
                                (- {formatUSD(discount)})
                              </span>
                            </div>
                          </div>
                        )}
                        {tax && tax.taxAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Tax
                              {tax.cgst &&
                                tax.sgst &&
                                ` (${tax.cgst}% + ${tax.sgst}%)`}
                              {tax.igst && ` (${tax.igst}%)`}
                            </span>
                            <div className="text-right">
                              <span className="font-medium">
                                {formatINR(tax.taxAmount)}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({formatUSD(tax.taxAmount)})
                              </span>
                            </div>
                          </div>
                        )}
                        {shippingCharges > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Shipping
                            </span>
                            <div className="text-right">
                              <span>{formatINR(shippingCharges)}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({formatUSD(shippingCharges)})
                              </span>
                            </div>
                          </div>
                        )}
                        {otherCharges > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Other</span>
                            <div className="text-right">
                              <span>{formatINR(otherCharges)}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({formatUSD(otherCharges)})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator className="my-2" />

                      {/* Final Total */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" /> Total (INR)
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            {formatINR(total)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold flex items-center gap-1">
                            <DollarSign className="w-4 h-4" /> Total (USD)
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatUSD(total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
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
