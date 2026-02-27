"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BillTemplate from "@/templates/billHtmlTemplate";
import { useBillStore } from "@/store/bill";
import { useCurrency } from "@/hooks/useCurrency";
import type { BoxWeightEntry } from "@/types/bill";
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
  Settings2,
  FileText,
  Printer,
  Package,
  Building2,
  User,
  Hash,
  Calendar,
  Container,
  Phone,
  CreditCard,
  X,
  ChevronDown,
  ChevronUp,
  Receipt,
} from "lucide-react";

const BillPage: React.FC = () => {
  const router = useRouter();
  const {
    companyDetails,
    customerDetails,
    billDetails,
    items,
    subtotal,
    total,

    updateCompanyDetails,
    updateCustomerDetails,
    updateBillDetails,
    addItem,
    removeItem,

    calculateTotal,
    getBillData,
  } = useBillStore();

  const { formatCurrency } = useCurrency();
  const rateCurrency = billDetails.rateCurrency ?? "INR";

  /** Format amount (already in selected currency) */
  const formatAmount = (amount: number) =>
    formatCurrency(amount, rateCurrency);

  const [showPreview, setShowPreview] = useState(false);
  const [showBoxEntry, setShowBoxEntry] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    hsn: "",
    quantity: 0,
    unit: "KG",
    rate: 0,
    boxWeightEntries: [] as BoxWeightEntry[],
  });

  const [newBoxEntry, setNewBoxEntry] = useState({
    numberOfBoxes: 0,
    weight: 0,
    rate: 0,
  });

  // Calculate total boxes from box entries
  const totalBoxes = newItem.boxWeightEntries.reduce(
    (sum, e) => sum + e.numberOfBoxes,
    0,
  );

  // Calculate total amount from all box entries
  const calculateAmount = () => {
    if (newItem.boxWeightEntries.length > 0) {
      // Sum up amounts from all entries
      return newItem.boxWeightEntries.reduce(
        (sum, e) => sum + (e.amount || 0),
        0,
      );
    }
    // Fallback for non-box entries
    return newItem.quantity * newItem.rate;
  };

  useEffect(() => {
    calculateTotal();
  }, [items, calculateTotal]);

  const handleAddBoxEntry = () => {
    if (
      newBoxEntry.numberOfBoxes <= 0 ||
      newBoxEntry.weight <= 0 ||
      newBoxEntry.rate <= 0
    )
      return;

    const totalWeight = newBoxEntry.numberOfBoxes * newBoxEntry.weight;
    const amount = newBoxEntry.numberOfBoxes * newBoxEntry.rate;

    const entry: BoxWeightEntry = {
      numberOfBoxes: newBoxEntry.numberOfBoxes,
      weight: newBoxEntry.weight,
      totalWeight: totalWeight,
      rate: newBoxEntry.rate,
      amount: amount,
    };

    const updatedEntries = [...newItem.boxWeightEntries, entry];
    const totalQuantity = updatedEntries.reduce(
      (sum, e) => sum + e.totalWeight,
      0,
    );
    const totalAmount = updatedEntries.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );

    setNewItem({
      ...newItem,
      boxWeightEntries: updatedEntries,
      quantity: totalQuantity,
      rate: totalAmount / totalQuantity, // Average rate per kg
    });

    setNewBoxEntry({ numberOfBoxes: 0, weight: 0, rate: 0 });
  };

  const handleRemoveBoxEntry = (index: number) => {
    const updatedEntries = newItem.boxWeightEntries.filter(
      (_, i) => i !== index,
    );
    const totalQuantity = updatedEntries.reduce(
      (sum, e) => sum + e.totalWeight,
      0,
    );
    const totalAmount = updatedEntries.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );

    setNewItem({
      ...newItem,
      boxWeightEntries: updatedEntries,
      quantity: totalQuantity,
      rate: totalQuantity > 0 ? totalAmount / totalQuantity : 0,
    });
  };

  const handleAddItem = () => {
    const hasBoxEntries = newItem.boxWeightEntries.length > 0;
    const hasDirectEntry =
      !hasBoxEntries && newItem.quantity > 0 && newItem.rate > 0;

    if (!newItem.description || (!hasBoxEntries && !hasDirectEntry)) return;

    const amount = hasBoxEntries
      ? newItem.boxWeightEntries.reduce((sum, e) => sum + (e.amount || 0), 0)
      : newItem.quantity * newItem.rate;

    const item = {
      id: Date.now().toString(),
      description: newItem.description,
      hsn: newItem.hsn,
      quantity: newItem.quantity,
      unit: newItem.unit,
      rate: newItem.rate,
      amount: amount,
      boxWeightEntries:
        newItem.boxWeightEntries.length > 0
          ? newItem.boxWeightEntries
          : undefined,
    };

    addItem(item);
    setNewItem({
      description: "",
      hsn: "",
      quantity: 0,
      unit: "KG",
      rate: 0,
      boxWeightEntries: [],
    });
    setShowBoxEntry(false);
  };

  const canAddItem =
    newItem.description &&
    (newItem.boxWeightEntries.length > 0 ||
      (newItem.quantity > 0 && newItem.rate > 0));

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl border border-emerald-100">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Billing System
            </h1>
            <p className="text-gray-500 mb-8 text-center">
              Sign in to create and manage invoices
            </p>
            <SignInButton>
              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-200">
                Sign In to Continue
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {showPreview ? (
          <div className="min-h-screen bg-slate-100 p-4">
            <div className="max-w-4xl mx-auto mb-4">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="gap-2 hover:bg-white"
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
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
              <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => router.push("/")}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-slate-100 rounded-xl"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-lg text-slate-900">
                        Invoice Builder
                      </h1>
                      <p className="text-xs text-slate-500">
                        {items.length} item{items.length !== 1 ? "s" : ""} added
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                    <span className="text-sm text-slate-500">Total:</span>
                    <span className="font-bold text-lg text-emerald-600">
                      {formatAmount(total)}
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowPreview(true)}
                    disabled={items.length === 0}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:shadow-xl disabled:opacity-50 disabled:shadow-none rounded-xl h-11 px-5"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview & Print</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto p-4 pb-8">
              {/* Customer & Invoice Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Customer Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900">Bill To</h2>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Customer Name
                      </label>
                      <Input
                        value={customerDetails.name}
                        onChange={(e) =>
                          updateCustomerDetails({ name: e.target.value })
                        }
                        placeholder="Enter customer name"
                        className="h-11 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Address
                      </label>
                      <Input
                        value={customerDetails.address}
                        onChange={(e) =>
                          updateCustomerDetails({ address: e.target.value })
                        }
                        placeholder="Enter address"
                        className="h-11 rounded-xl border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <Input
                          value={customerDetails.phone || ""}
                          onChange={(e) =>
                            updateCustomerDetails({ phone: e.target.value })
                          }
                          placeholder="Phone"
                          className="h-10 rounded-xl border-slate-200 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3" /> GSTIN
                        </label>
                        <Input
                          value={customerDetails.gstin || ""}
                          onChange={(e) =>
                            updateCustomerDetails({ gstin: e.target.value })
                          }
                          placeholder="GSTIN"
                          className="h-10 rounded-xl border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900">
                        Invoice Details
                      </h2>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-8 px-3"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          <span className="text-xs">Company</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-purple-600" />
                            Company Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 pt-2">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Company Name
                            </label>
                            <Input
                              value={companyDetails.name}
                              onChange={(e) =>
                                updateCompanyDetails({ name: e.target.value })
                              }
                              placeholder="Company Name"
                              className="h-11 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Address
                            </label>
                            <Input
                              value={companyDetails.address}
                              onChange={(e) =>
                                updateCompanyDetails({
                                  address: e.target.value,
                                })
                              }
                              placeholder="Address"
                              className="h-11 rounded-xl"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Phone
                              </label>
                              <Input
                                value={companyDetails.phone}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="Phone"
                                className="h-10 rounded-xl text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                GSTIN
                              </label>
                              <Input
                                value={companyDetails.gstin}
                                onChange={(e) =>
                                  updateCompanyDetails({
                                    gstin: e.target.value,
                                  })
                                }
                                placeholder="GSTIN"
                                className="h-10 rounded-xl text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Hash className="w-3 h-3" /> Invoice No
                        </label>
                        <Input
                          value={billDetails.billNumber}
                          onChange={(e) =>
                            updateBillDetails({ billNumber: e.target.value })
                          }
                          placeholder="INV-001"
                          className="h-11 rounded-xl border-slate-200 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> Date
                        </label>
                        <Input
                          type="date"
                          value={billDetails.billDate}
                          onChange={(e) =>
                            updateBillDetails({ billDate: e.target.value })
                          }
                          className="h-11 rounded-xl border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Container className="w-3 h-3" /> Container No{" "}
                        <span className="text-slate-400 normal-case font-normal">
                          (optional)
                        </span>
                      </label>
                      <Input
                        value={billDetails.containerNumber || ""}
                        onChange={(e) =>
                          updateBillDetails({ containerNumber: e.target.value })
                        }
                        placeholder="e.g., MSKU1234567"
                        className="h-11 rounded-xl border-slate-200 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Rate currency
                      </label>
                      <select
                        value={rateCurrency}
                        onChange={(e) =>
                          updateBillDetails({
                            rateCurrency: e.target
                              .value as "INR" | "USD" | "EUR",
                          })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      >
                        <option value="INR">₹ INR (Rupees)</option>
                        <option value="USD">$ USD (Dollars)</option>
                        <option value="EUR">€ EUR (Euros)</option>
                      </select>
                      <p className="text-xs text-slate-400">
                        Per-box and per-kg rates are entered in this currency
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Package className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Line Items
                      </h2>
                      <p className="text-xs text-slate-500">
                        Add products or services to the invoice
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[600px]">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-right">Qty (KG)</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>

                  {/* Existing Items */}
                  {items.length === 0 && (
                    <div className="px-5 py-12 text-center">
                      <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        No items added yet
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Add your first item below
                      </p>
                    </div>
                  )}

                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="group grid grid-cols-12 gap-2 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors min-w-[600px]"
                    >
                      <div className="col-span-1 text-center">
                        <span className="inline-flex w-7 h-7 items-center justify-center bg-slate-100 rounded-lg text-sm font-medium text-slate-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="col-span-5">
                        <p className="font-medium text-slate-900">
                          {item.description}
                        </p>
                        {item.boxWeightEntries &&
                          item.boxWeightEntries.length > 0 && (
                            <div className="mt-2 bg-slate-50 rounded-lg p-2 text-xs">
                              <div className="grid grid-cols-4 gap-2 text-slate-500 font-medium mb-1 pb-1 border-b border-slate-200">
                                <span>Boxes</span>
                                <span>Weight</span>
                                <span className="text-right">Rate</span>
                                <span className="text-right">Amount</span>
                              </div>
                              {item.boxWeightEntries.map((e, i) => (
                                <div
                                  key={i}
                                  className="grid grid-cols-4 gap-2 py-0.5"
                                >
                                  <span className="text-slate-600">
                                    {e.numberOfBoxes}
                                  </span>
                                  <span className="text-slate-600">
                                    × {e.weight} kg
                                  </span>
                                  <span className="text-right text-slate-600">
                                    {formatCurrency(e.rate || 0, rateCurrency)}
                                    /box
                                  </span>
                                  <span className="text-right font-medium text-slate-700">
                                    {formatAmount(e.amount || 0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <div className="col-span-2 text-right text-slate-700 font-medium self-center">
                        {item.quantity.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-right text-slate-700 self-center">
                        <span className="text-xs text-slate-400">avg </span>
                        {formatCurrency(item.rate, rateCurrency)}
                      </div>
                      <div className="col-span-2 text-right self-center flex items-center justify-end gap-2">
                        <span className="font-semibold text-slate-900">
                          {formatAmount(item.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Item Row */}
                  <div className="px-5 py-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-t-2 border-dashed border-emerald-200">
                    <div className="grid grid-cols-12 gap-3 min-w-[600px]">
                      <div className="col-span-1 text-center pt-6">
                        <span className="inline-flex w-7 h-7 items-center justify-center bg-emerald-100 rounded-lg text-sm font-medium text-emerald-600">
                          {items.length + 1}
                        </span>
                      </div>
                      <div className="col-span-5 space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                            Description
                          </label>
                          <Input
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter item description"
                            className="h-11 rounded-xl border-emerald-200 bg-white focus:border-emerald-400 focus:ring-emerald-200"
                          />
                        </div>

                        {/* Box Weight Toggle */}
                        <button
                          type="button"
                          onClick={() => setShowBoxEntry(!showBoxEntry)}
                          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                        >
                          {showBoxEntry ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          <Package className="w-4 h-4" />
                          Calculate from boxes
                        </button>

                        {/* Box Weight Entry */}
                        {showBoxEntry && (
                          <div className="bg-white rounded-xl border border-emerald-200 p-4 space-y-3">
                            <div className="flex gap-2 items-end">
                              <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">
                                  No. of Boxes
                                </label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={newBoxEntry.numberOfBoxes || ""}
                                  onChange={(e) =>
                                    setNewBoxEntry({
                                      ...newBoxEntry,
                                      numberOfBoxes:
                                        parseInt(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="0"
                                  className="h-10 rounded-lg text-sm"
                                />
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">
                                  Weight/Carton
                                </label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={newBoxEntry.weight || ""}
                                  onChange={(e) =>
                                    setNewBoxEntry({
                                      ...newBoxEntry,
                                      weight: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="4.0 kg"
                                  className="h-10 rounded-lg text-sm"
                                />
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">
                                  Rate/Box
                                </label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={newBoxEntry.rate || ""}
                                  onChange={(e) =>
                                    setNewBoxEntry({
                                      ...newBoxEntry,
                                      rate: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  placeholder={
                                    rateCurrency === "INR"
                                      ? "₹/box"
                                      : rateCurrency === "USD"
                                        ? "$/box"
                                        : "€/box"
                                  }
                                  className="h-10 rounded-lg text-sm"
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={handleAddBoxEntry}
                                size="sm"
                                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                                disabled={
                                  newBoxEntry.numberOfBoxes <= 0 ||
                                  newBoxEntry.weight <= 0 ||
                                  newBoxEntry.rate <= 0
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {newItem.boxWeightEntries.length > 0 && (
                              <div className="bg-slate-50 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200">
                                  <span>Boxes</span>
                                  <span>Weight</span>
                                  <span className="text-right">Rate</span>
                                  <span className="text-right">Amount</span>
                                  <span></span>
                                </div>
                                {newItem.boxWeightEntries.map((e, i) => (
                                  <div
                                    key={i}
                                    className="grid grid-cols-5 gap-2 px-3 py-2 text-sm items-center border-b border-slate-100 last:border-0"
                                  >
                                    <span className="text-slate-700">
                                      {e.numberOfBoxes}
                                    </span>
                                    <span className="text-slate-600">
                                      × {e.weight} kg
                                    </span>
                                    <span className="text-right text-slate-600">
                                      {formatCurrency(e.rate || 0, rateCurrency)}
                                      /box
                                    </span>
                                    <span className="text-right font-medium text-slate-800">
                                      {formatAmount(e.amount || 0)}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveBoxEntry(i)}
                                      className="ml-auto w-6 h-6 flex items-center justify-center rounded-md text-red-500 hover:bg-red-100 transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                                {/* Summary Row */}
                                <div className="px-3 py-3 bg-emerald-50 border-t border-emerald-100">
                                  <div className="flex items-center justify-between text-sm">
                                    <div>
                                      <span className="text-emerald-600 font-medium">
                                        Total:{" "}
                                      </span>
                                      <span className="font-bold text-emerald-700">
                                        {totalBoxes} boxes ={" "}
                                        {newItem.quantity.toFixed(2)} kg
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-emerald-600 font-medium">
                                        Amount:{" "}
                                      </span>
                                      <span className="font-bold text-lg text-emerald-700">
                                        {formatAmount(calculateAmount())}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                          Quantity
                        </label>
                        <div className="h-11 rounded-xl bg-white border border-slate-200 px-3 flex items-center justify-end text-sm text-slate-600">
                          {newItem.quantity > 0
                            ? `${newItem.quantity.toFixed(2)} kg`
                            : "—"}
                        </div>
                        {showBoxEntry && totalBoxes > 0 && (
                          <p className="text-xs text-slate-500 mt-1 text-right">
                            {totalBoxes} boxes
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                          {showBoxEntry && newItem.boxWeightEntries.length > 0
                            ? "Avg Rate/KG"
                            : "Rate/KG"}
                        </label>
                        {!showBoxEntry ? (
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItem.rate || ""}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                rate: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder={
                              rateCurrency === "INR"
                                ? "₹/kg"
                                : rateCurrency === "USD"
                                  ? "$/kg"
                                  : "€/kg"
                            }
                            className="h-11 rounded-xl border-emerald-200 bg-white focus:border-emerald-400 focus:ring-emerald-200 text-right"
                          />
                        ) : (
                          <div className="h-11 rounded-xl bg-white border border-slate-200 px-3 flex items-center justify-end text-sm text-slate-600">
                            {newItem.rate > 0
                              ? formatCurrency(newItem.rate, rateCurrency)
                              : "—"}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                          Amount
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-11 rounded-xl bg-white border border-slate-200 px-3 flex items-center justify-end text-sm font-medium text-slate-700">
                            {newItem.boxWeightEntries.length > 0
                              ? formatAmount(calculateAmount())
                              : newItem.quantity > 0 && newItem.rate > 0
                                ? formatCurrency(
                                    newItem.quantity * newItem.rate,
                                    rateCurrency,
                                  )
                                : "—"}
                          </div>
                          <Button
                            onClick={handleAddItem}
                            disabled={!canAddItem}
                            className="h-11 w-11 p-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-lg shadow-emerald-200 disabled:shadow-none transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                {items.length > 0 && (
                  <div className="border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                          Total Amount
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {items
                            .reduce((sum, item) => sum + item.quantity, 0)
                            .toFixed(2)}{" "}
                          kg total
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-emerald-600">
                          {formatAmount(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Total Bar */}
              <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatAmount(total)}
                  </p>
                </div>
                <Button
                  onClick={() => setShowPreview(true)}
                  disabled={items.length === 0}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 px-6"
                >
                  <Printer className="w-4 h-4" />
                  Preview
                </Button>
              </div>

              {/* Bottom Padding for Mobile */}
              <div className="h-24 sm:h-0" />
            </main>
          </div>
        )}
      </SignedIn>
    </>
  );
};

export default BillPage;
