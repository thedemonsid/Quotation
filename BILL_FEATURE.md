# Bill Generation Feature

This document explains the bill generation feature added to the Quotation application.

## Overview

The bill generation feature allows you to create professional tax invoices/bills with GST calculation, suitable for Indian businesses. It complements the existing quotation system.

## Features

### 1. **Editable Company Information**

- Company name, tagline, and owner name
- Complete address and contact details
- GSTIN (GST Identification Number)
- Optional PAN number
- All fields are editable via dialog

### 2. **Customer Information**

- Customer name and address (required)
- Phone and email (optional)
- Customer GSTIN (optional)
- All fields editable inline

### 3. **Bill Details**

- Auto-generated bill number (editable)
- Bill date and due date
- Optional Purchase Order number and date

### 4. **Product/Service Items**

- Add multiple items with:
  - Description
  - HSN/SAC code (optional)
  - Quantity and unit
  - Rate per unit
  - Auto-calculated amount
- Remove items individually
- Visual list of all added items

### 5. **Tax Calculation (GST)**

- CGST (Central GST) - for intra-state transactions
- SGST (State GST) - for intra-state transactions
- IGST (Integrated GST) - for inter-state transactions
- Auto-calculation based on percentages
- Taxable amount calculated after discount

### 6. **Additional Charges**

- Discount (flat amount or percentage)
- Shipping charges
- Other miscellaneous charges
- All charges reflected in final total

### 7. **Payment Details** (Editable)

- Bank name
- Account holder name
- Account number
- IFSC code

### 8. **Professional Output**

- Clean, printable tax invoice format
- Amount in words (Indian numbering system)
- Company branding with colors
- All statutory requirements included
- Computer-generated invoice footer
- Signature space for authorized signatory

## File Structure

```
types/
  bill.ts                    # TypeScript types for bill data
store/
  bill.ts                    # Zustand store for bill state management
hooks/
  useBill.ts                 # Custom hook for bill operations
templates/
  billHtmlTemplate.tsx       # Bill template component for printing
app/
  bill/
    page.tsx                 # Main bill generation page
```

## Usage

### Access the Bill Generator

1. Sign in to the application
2. Click "Generate Bill / Invoice" button on the home page
3. You'll be redirected to `/bill` route

### Creating a Bill

1. **Enter Customer Details**

   - Fill in customer name and address (required)
   - Add phone, email, GSTIN as needed

2. **Add Items**

   - Enter item description
   - Optionally add HSN/SAC code
   - Set quantity, unit, and rate
   - Click "Add Item"
   - Repeat for all items

3. **Configure Tax**

   - For intra-state: Enter CGST % and SGST % (usually equal, e.g., 9% + 9% = 18%)
   - For inter-state: Enter IGST % (e.g., 18%)
   - Leave others at 0

4. **Add Discounts/Charges** (Optional)

   - Enter discount amount or percentage
   - Add shipping charges if applicable
   - Add any other charges

5. **Review Summary**

   - Check the summary panel on the right
   - Verify all calculations

6. **Edit Company/Payment Details** (Optional)

   - Click edit icon on Company Details card
   - Modify payment details as needed

7. **Preview and Print**
   - Click "Preview Bill" button
   - Review the formatted invoice
   - Click "Print Bill" to print or save as PDF

### Default Values

The bill generator comes with pre-configured company details:

- **Company**: BANANA VENTURES SHINDE'S
- **Owner**: Pruthviraj Shinde
- **GSTIN**: 27SYEPS7484G1ZC
- **Bank**: Bank of Maharashtra, Account: 60521459884

All these values can be edited as needed.

## Integration with Quotation

You can use the bill generator independently or after creating a quotation:

1. Generate calculations on home page
2. Create quotation first (optional)
3. Navigate to bill generator
4. Enter bill-specific details
5. Generate tax invoice

## Key Differences: Quotation vs Bill

| Feature  | Quotation            | Bill                   |
| -------- | -------------------- | ---------------------- |
| Purpose  | Proposal/Estimate    | Tax Invoice            |
| Currency | INR → USD conversion | INR only               |
| Tax      | Export (LUT)         | GST (CGST/SGST/IGST)   |
| Format   | Proforma             | Statutory Invoice      |
| Items    | Product details      | Product + HSN/SAC      |
| Payment  | Terms & Conditions   | Bank details prominent |

## Technical Details

### State Management

- Uses Zustand for global state
- Persistent across page navigation within session
- Auto-calculation on changes

### Tax Calculation Logic

```typescript
Taxable Amount = Subtotal - Discount
CGST Amount = Taxable Amount × (CGST % / 100)
SGST Amount = Taxable Amount × (SGST % / 100)
IGST Amount = Taxable Amount × (IGST % / 100)
Total Tax = CGST + SGST + IGST
Final Total = Taxable Amount + Total Tax + Shipping + Other Charges
```

### Number to Words Conversion

- Supports Indian numbering system (Crores, Lakhs, Thousands)
- Includes paise for decimal values
- Example: ₹12,34,567.89 → "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven and Eighty Nine Paise Only"

## Customization

### Modify Company Details

Edit `defaultCompanyDetails` in `/store/bill.ts`

### Change Default Terms

Edit `defaultTermsAndConditions` in `/store/bill.ts`

### Modify Invoice Layout

Edit `/templates/billHtmlTemplate.tsx`

### Add Custom Fields

1. Add field to `BillData` type in `/types/bill.ts`
2. Add state in `/store/bill.ts`
3. Add input in `/app/bill/page.tsx`
4. Display in `/templates/billHtmlTemplate.tsx`

## Best Practices

1. **Always verify GSTIN**: Both company and customer GSTIN should be valid
2. **Use correct HSN codes**: Helps in GST filing
3. **Choose correct tax type**:
   - Same state → CGST + SGST
   - Different state → IGST
4. **Keep consistent units**: Use standard units (Nos, Kg, Meter, etc.)
5. **Regular backups**: Print or save bills immediately
6. **Number sequence**: Maintain bill number sequence properly

## Future Enhancements

Potential features for future versions:

- [ ] Save bills to database
- [ ] Bill history and search
- [ ] Email bill to customer
- [ ] Recurring bills
- [ ] Payment tracking
- [ ] Multiple tax slabs per item
- [ ] QR code for UPI payment
- [ ] E-way bill integration
- [ ] PDF download (without print dialog)

## Support

For issues or questions:

1. Check this documentation
2. Review the code comments
3. Test with sample data first
4. Verify all required fields are filled

## Legal Compliance

This bill generator includes:

- ✅ Company GSTIN
- ✅ Customer details
- ✅ HSN/SAC codes (optional but recommended)
- ✅ Tax breakdown (CGST/SGST/IGST)
- ✅ Amount in words
- ✅ Bank details
- ✅ Terms and conditions
- ✅ Sequential bill numbering

Ensure you comply with local GST regulations and maintain proper records.
