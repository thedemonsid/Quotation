# Bill Generation - Quick Summary

## What I've Built For You

I've created a complete **Bill/Tax Invoice Generation System** that works alongside your existing quotation system.

## 🎯 Key Features

### 1. Editable Information

- ✅ **Company Details** - Name, address, GSTIN, PAN (all editable)
- ✅ **Customer Details** - Name, address, phone, email, GSTIN (all editable)
- ✅ **Payment Info** - Bank details (fully editable)

### 2. What You Need to Enter

- Product/service items with descriptions
- Quantity and price per item
- HSN/SAC codes (optional)
- Tax rates (CGST/SGST/IGST)
- Optional: discount, shipping, other charges

### 3. What's Auto-Calculated

- Item amounts (qty × rate)
- Subtotal
- Tax amounts (based on percentages you set)
- Discounts
- Final total
- Amount in words (Indian style)

## 📁 Files Created

1. **`types/bill.ts`** - Data structure definitions
2. **`store/bill.ts`** - State management (Zustand store)
3. **`hooks/useBill.ts`** - Helper functions for easy bill operations
4. **`templates/billHtmlTemplate.tsx`** - Professional printable invoice template
5. **`app/bill/page.tsx`** - Main bill creation page
6. **`BILL_FEATURE.md`** - Complete documentation

## 🚀 How to Use

### Step 1: Access

- Go to home page
- Click **"Generate Bill / Invoice"** button (green button)

### Step 2: Fill Details

1. **Customer Info** - Enter name and address (required)
2. **Add Items**:

   - Description (e.g., "Fresh Bananas")
   - Quantity (e.g., 100)
   - Unit (e.g., "Kg" or "Boxes")
   - Rate (e.g., 50.00)
   - Click "Add Item"

3. **Set Tax** (in right panel):

   - For same state: CGST 9% + SGST 9% = 18% GST
   - For different state: IGST 18%

4. **Optional**:
   - Add discount (flat or %)
   - Add shipping charges
   - Add other charges

### Step 3: Preview & Print

- Click **"Preview Bill"** button
- Review the formatted invoice
- Click **"Print Bill"** to print or save as PDF

## 💡 Quick Examples

### Example 1: Simple Bill

```
Item: Fresh Bananas
Qty: 100 boxes × ₹500/box = ₹50,000
CGST (9%): ₹4,500
SGST (9%): ₹4,500
Total: ₹59,000
```

### Example 2: With Discount

```
Items Total: ₹1,00,000
Discount (5%): -₹5,000
Taxable: ₹95,000
IGST (18%): ₹17,100
Shipping: ₹2,000
Total: ₹1,14,100
```

## 🎨 Pre-filled Data

Your company info is already set:

- Company: BANANA VENTURES SHINDE'S
- GSTIN: 27SYEPS7484G1ZC
- Bank: Bank of Maharashtra
- Account: 60521459884
- IFSC: MAHB00011669

**All can be edited by clicking the edit icon!**

## 📋 Bill Format Includes

✅ Company details with branding  
✅ Bill number and date  
✅ Customer details  
✅ Item table with HSN codes  
✅ Tax breakdown (CGST/SGST/IGST)  
✅ Amount in words  
✅ Bank payment details  
✅ Terms & conditions  
✅ Signature space  
✅ Professional layout for printing

## 🔄 Quotation vs Bill

| Quotation         | Bill                   |
| ----------------- | ---------------------- |
| For exports (USD) | For Indian sales (INR) |
| Proforma/Estimate | Tax Invoice            |
| LUT for exports   | GST calculation        |
| Pricing proposal  | Legal invoice          |

## 🎯 Common Use Cases

1. **Domestic Sale**: Enter items → Set CGST+SGST → Generate bill
2. **Interstate Sale**: Enter items → Set IGST → Generate bill
3. **With Discount**: Add items → Set discount % → Add tax → Generate
4. **Custom Company**: Click edit → Change company details → Continue

## 🔧 Customization

### Edit Company Info

Click the edit icon (pencil) on "Company Details" card

### Edit Payment Details

Directly edit fields in "Payment Details" card

### Add More Terms

Can be modified in the store file (`store/bill.ts`)

## ⚡ Pro Tips

1. **Bill Number**: Auto-generated, but you can edit it
2. **HSN Codes**: Optional but good for GST compliance
3. **Units**: Use standard units (Kg, Boxes, Nos, Liters, etc.)
4. **Tax Type**:
   - Same state transactions = CGST + SGST
   - Different state = IGST only
5. **Amount in Words**: Auto-generated in Indian format

## 🎨 Color Coding

- **Quotation Button**: Blue/Cyan (for exports, USD)
- **Bill Button**: Green/Emerald (for domestic, INR)
- Makes it easy to differentiate!

## 📱 Responsive

Works on:

- Desktop ✅
- Tablet ✅
- Mobile ✅ (scrollable, touch-friendly)

## 🖨️ Printing

The "Print Bill" button:

- Optimized for A4 paper
- Removes edit buttons
- Professional margins
- Can save as PDF using browser's print to PDF

## Next Steps

1. **Test it**: Go to `/bill` and create a sample bill
2. **Customize**: Edit company details as needed
3. **Use it**: Generate bills for your customers
4. **Integrate**: Works alongside your quotation system

That's it! You now have a complete billing system. The bill amount comes from what you enter (items × quantity × rate), and company info is fully editable! 🎉
