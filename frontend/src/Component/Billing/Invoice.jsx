import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const SHOP = {
  code: "YS",
  name: "YUVIRAA SILKS",
  gstin: "33HBCPB7699A1ZR",
  phones: ["88380 57339", "95433 82043"],
  email: "yviraa339@gmail.com",
  address1: "6/541, Gandhi Nagar, Near Jay Matriculation School,",
  address2: "Allikuttai (PO), Salem - 636 003. (TN)",
  tagline: "Handloom Cloth Merchants",
  bank: {
    accountNo: "1186010000001344",
    branch: "SALEM - MAIN",
    ifsc: "KVBL0001186",
  },
};

const fmtMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const pad = (n, width = 2) => String(n).padStart(width, "0");

const isSameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth();

const buildInvoiceNo = (date, serial, withPrefix = true) => {
  const yy = pad(date.getFullYear() % 100, 2);
  const mm = pad(date.getMonth() + 1, 2);
  const seq = pad(serial, 3);
  return withPrefix ? `${SHOP.code}${yy}${mm}${seq}` : `${yy}${mm}${seq}`;
};

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const twoDigitsToWords = (n) => {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return `${TENS[ten]}${one ? ` ${ONES[one]}` : ""}`.trim();
};

const threeDigitsToWords = (n) => {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (!hundred) return twoDigitsToWords(rest);
  if (!rest) return `${ONES[hundred]} Hundred`;
  return `${ONES[hundred]} Hundred ${twoDigitsToWords(rest)}`;
};

const numberToWordsIndian = (num) => {
  const n = Math.floor(Number(num || 0));
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;
  const parts = [];
  if (crore) parts.push(`${twoDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(threeDigitsToWords(hundred));
  return parts.join(" ").trim();
};

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sale = state?.sale;
  const [allSales, setAllSales] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [salesRes, customersRes, productsRes] = await Promise.all([
          customFetch.get("sales"),
          customFetch.get("customers"),
          customFetch.get("products"),
        ]);

        if (ignore) return;

        setAllSales(salesRes.data?.sales || []);
        setAllCustomers(customersRes.data?.customers || []);
        setAllProducts(productsRes.data?.products || []);
      } catch {
        if (!ignore) toast.error("Failed to load invoice data");
        if (!ignore) {
          setAllSales([]);
          setAllCustomers([]);
          setAllProducts([]);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const view = useMemo(() => {
    if (!sale) return null;

    const saleDate = sale.createdAt ? new Date(sale.createdAt) : new Date();
    const nonGst = sale.gstMode === "without";

    const customerId =
      typeof sale.customer === "string" ? sale.customer : sale.customer?._id;
    const dbCustomer = allCustomers.find((c) => c._id === customerId);
    const customer = {
      name: sale.customer?.name || dbCustomer?.name || "Walk-in Customer",
      mobile: sale.customer?.mobile || dbCustomer?.mobile || "-",
      state: sale.customer?.state || dbCustomer?.state || "-",
      gst: sale.customer?.gst || dbCustomer?.gst || "-",
      address: sale.customer?.address || dbCustomer?.address || "-",
    };

    const items = sale.items || [];
    const lineItems = items.map((item, idx) => {
      const productId =
        typeof item.product === "string" ? item.product : item.product?._id;
      const dbProduct = allProducts.find((p) => p._id === productId);

      const qty = Number(item.qty || 0);
      const rate = Number(item.price || 0);
      const discountRate = Number(item.discount || 0);
      const cgstRate = Number(item.cgst || 0);
      const sgstRate = Number(item.sgst || 0);
      const igstRate = Number(item.igst || 0);

      const base = qty * rate;
      const discountAmount = (base * discountRate) / 100;
      const taxable = base - discountAmount;
      const cgstAmount = (taxable * cgstRate) / 100;
      const sgstAmount = (taxable * sgstRate) / 100;
      const igstAmount = (taxable * igstRate) / 100;
      const total = Number(item.total || taxable + cgstAmount + sgstAmount + igstAmount);

      return {
        sno: idx + 1,
        name: item.product?.name || dbProduct?.name || "Product",
        code: item.product?.productCode || dbProduct?.productCode || "-",
        hsn: item.product?.hsnCode || dbProduct?.hsnCode || "-",
        qty,
        rate,
        discountAmount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        total,
      };
    });

    const grossTotal = Number(sale.grossTotal || 0);
    const grandTotal = Number(sale.grandTotal || 0);
    const qtyTotal = lineItems.reduce((s, i) => s + i.qty, 0);
    const discountTotal = lineItems.reduce((s, i) => s + i.discountAmount, 0);
    const cgstTotal = lineItems.reduce((s, i) => s + i.cgstAmount, 0);
    const sgstTotal = lineItems.reduce((s, i) => s + i.sgstAmount, 0);
    const igstTotal = lineItems.reduce((s, i) => s + i.igstAmount, 0);
    const taxTotal = cgstTotal + sgstTotal + igstTotal;

    // Keep separate monthly serial sequences for GST and non-GST bills.
    const monthSales = allSales
      .filter(
        (s) =>
          s?.createdAt &&
          isSameMonth(new Date(s.createdAt), saleDate) &&
          (s.gstMode === "without") === nonGst,
      )
      .sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        if (ta !== tb) return ta - tb;
        return String(a._id || "").localeCompare(String(b._id || ""));
      });

    const sameSaleIdx = monthSales.findIndex((s) => String(s._id) === String(sale._id));
    const serial = sameSaleIdx >= 0 ? sameSaleIdx + 1 : 1;
    const invoiceNo = buildInvoiceNo(saleDate, serial, !nonGst);
    const amountInWords = `${numberToWordsIndian(Math.round(grandTotal))} Rupees Only`;

    return {
      saleDate,
      nonGst,
      customer,
      lineItems,
      qtyTotal,
      grossTotal,
      discountTotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      taxTotal,
      grandTotal,
      invoiceNo,
      amountInWords,
    };
  }, [sale, allSales, allCustomers, allProducts]);

  if (!view) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold mb-2">Invoice</h2>
        <p>No sale selected. Open invoice from Sales History Bill button.</p>
      </div>
    );
  }

  const minBodyRows = 18;
  const showFillerRow = view.lineItems.length < minBodyRows;

  return (
    <div className="invoice-wrapper bg-gray-100 min-h-screen p-2 md:p-6 overflow-x-auto">
      <style>
        {`
          @page {
            size: A4;
            margin: 5mm;
          }
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            .invoice-wrapper, .invoice-wrapper * {
              visibility: visible !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              overflow: hidden !important;
            }
            #root {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              overflow: hidden !important;
            }
            .invoice-wrapper {
              position: fixed !important;
              inset: 0 !important;
              z-index: 9999 !important;
              background: #fff !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 200mm !important;
              height: 287mm !important;
              overflow: hidden !important;
            }
            .no-print {
              display: none !important;
            }
            .invoice-sheet {
              box-shadow: none !important;
              margin: 0 !important;
              width: 200mm !important;
              min-height: 287mm !important;
              height: 287mm !important;
              overflow: hidden !important;
            }
            .invoice-inner {
              margin: 0 !important;
              width: 100% !important;
              min-height: 287mm !important;
              height: 287mm !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
            }
            .hide-scrollbar,
            [class*="overflow-"],
            .overflow-auto,
            .overflow-hidden {
              overflow: hidden !important;
            }
          }
        `}
      </style>

      <div
        className="invoice-sheet relative mx-auto bg-white shadow-xl"
        style={{ width: "210mm", minHeight: "297mm", fontFamily: "Calibri, sans-serif" }}
      >
        <div className="no-print flex items-center justify-between px-1 pb-2">
          <button
            type="button"
            onClick={() => navigate("/app/sales")}
            className="bg-white text-[#800020] border border-[#800020] px-3 py-2 text-sm font-bold rounded shadow"
            title="Back to Sales"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-[#800020] text-white px-4 py-2 text-sm font-bold rounded shadow"
          >
            Print
          </button>
        </div>

        <div className="invoice-inner m-1 border-[1.5px] border-black min-h-[288mm] flex flex-col text-[12px] font-semibold">
          <div className="border-b border-black px-3 py-3">
            <div className="grid grid-cols-[1fr_2fr_1fr]">
              <div className="font-bold">{!view.nonGst ? `GSTIN: ${SHOP.gstin}` : ""}</div>
              <div className="text-center leading-tight">
                <div className="font-bold tracking-wide">{view.nonGst ? "INVOICE" : "TAX INVOICE"}</div>
                <div className="text-[36px] font-black leading-[1.05] tracking-wide">{SHOP.name}</div>
                <div className="font-bold">{SHOP.tagline}</div>
                <div>{SHOP.address1}</div>
                <div>{SHOP.address2}</div>
              </div>
              <div className="text-right leading-tight">
                <div>CELL: {SHOP.phones[0]}</div>
                <div>{SHOP.phones[1]}</div>
                <div>Email: {SHOP.email}</div>
              </div>
            </div>
          </div>

          <div className="border-b border-black grid grid-cols-[1.25fr_1fr]">
            <div className="border-r border-black grid grid-cols-[1fr_1fr]">
              <div className="border-r border-black p-2">
                <div className="font-bold">TO:</div>
                <div className="font-bold">{view.customer.name}</div>
                <div>Mobile No: {view.customer.mobile}</div>
                {!view.nonGst && <div>GSTIN / UIN: {view.customer.gst}</div>}
                <div>State Name * Code: {view.customer.state}</div>
                <div>{view.customer.address}</div>
              </div>
              <div className="p-2">
                <div className="italic">Buyer</div>
                <div>{view.customer.name}</div>
                <div>Ph: {view.customer.mobile}</div>
                {!view.nonGst && <div>GST: {view.customer.gst}</div>}
              </div>
            </div>

            <div>
              {[
                ["Reverse Charge", "No"],
                ["Invoice No", view.invoiceNo],
                ["Invoice Date", view.saleDate.toLocaleDateString("en-GB")],
                ["Carriers", ""],
                ["No of Articles", String(view.qtyTotal)],
                ["Way Bill No", ""],
                ["State code", "TAMILNADU 33"],
              ].map(([k, v], idx, arr) => (
                <div
                  key={k}
                  className={`grid grid-cols-[1fr_110px] ${idx < arr.length - 1 ? "border-b border-black" : ""}`}
                >
                  <div className="border-r border-black p-1 uppercase font-bold">{k}</div>
                  <div className="p-1 text-center font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-black" style={{ height: "138mm" }}>
            <table className="w-full h-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-black uppercase text-[12px] font-black">
                  <th className="w-[45px] border-r border-black px-1 py-1 text-center">S.No</th>
                  <th className="border-r border-black px-1 py-1 text-center">Product Description</th>
                  <th className="w-[65px] border-r border-black px-1 py-1 text-center">HSN</th>
                  <th className="w-[60px] border-r border-black px-1 py-1 text-center">Per Mtr</th>
                  <th className="w-[75px] border-r border-black px-1 py-1 text-center">Rate (₹)</th>
                  <th className="w-[55px] border-r border-black px-1 py-1 text-center">Qty</th>
                  <th className="w-[90px] px-1 py-1 text-center">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="h-full">
                {view.lineItems.map((item) => (
                  <tr key={`${item.code}-${item.sno}`} className="border-b border-black/60">
                    <td className="border-r border-black px-1 py-[2px] text-center">{item.sno}</td>
                    <td className="border-r border-black px-1 py-[2px]">{item.name}</td>
                    <td className="border-r border-black px-1 py-[2px] text-center">{item.hsn}</td>
                    <td className="border-r border-black px-1 py-[2px] text-center">-</td>
                    <td className="border-r border-black px-1 py-[2px] text-right">{fmtMoney(item.rate)}</td>
                    <td className="border-r border-black px-1 py-[2px] text-center">{item.qty}</td>
                    <td className="px-1 py-[2px] text-right">{fmtMoney(item.total)}</td>
                  </tr>
                ))}

                {showFillerRow && (
                  <tr style={{ height: "100%" }}>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td className="border-r border-black">&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto border-t border-black grid grid-cols-[1fr_1fr]">
            <div className="border-r border-black p-2 flex flex-col justify-between">
              <div>
                <div>Total : <span className="font-bold">{view.qtyTotal} QTY</span></div>
                <div>Total : <span className="font-bold">0 MTRS</span></div>
                <div className="mt-2">
                  <div className="text-[10px]">Invoice Total Amount (in words)</div>
                  <div className="font-semibold uppercase">{view.amountInWords}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="font-bold underline">Terms & Conditions:</div>
                <div className="font-normal">1. Goods once sold will not be taken back or exchanged</div>
                <div className="font-normal">2. All disputes are subject to Salem jurisdiction</div>
              </div>

              {!view.nonGst && (
                <div className="mt-3">
                  <div className="font-bold">Bank Details:</div>
                  <div>Account No - {SHOP.bank.accountNo}</div>
                  <div>Branch Name - {SHOP.bank.branch}</div>
                  <div>IFSC - {SHOP.bank.ifsc}</div>
                </div>
              )}
            </div>

            <div className="p-2 font-bold text-[12px] flex flex-col">
              <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                <div className="py-1">Basic Amount</div>
                <div className="py-1 text-center">: ₹</div>
                <div className="py-1 text-right">{fmtMoney(view.grossTotal)}</div>
              </div>
              <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                <div className="py-1">Discount</div>
                <div className="py-1 text-center">: ₹</div>
                <div className="py-1 text-right">{fmtMoney(view.discountTotal)}</div>
              </div>
              {!view.nonGst && (
                <>
                  <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                    <div className="py-1">ADD SGST</div>
                    <div className="py-1 text-center">: ₹</div>
                    <div className="py-1 text-right">{fmtMoney(view.sgstTotal)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                    <div className="py-1">ADD CGST</div>
                    <div className="py-1 text-center">: ₹</div>
                    <div className="py-1 text-right">{fmtMoney(view.cgstTotal)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                    <div className="py-1">ADD IGST</div>
                    <div className="py-1 text-center">: ₹</div>
                    <div className="py-1 text-right">{fmtMoney(view.igstTotal)}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_64px_120px] border-b border-black font-black">
                    <div className="py-1">Tax Amount</div>
                    <div className="py-1 text-center">: ₹</div>
                    <div className="py-1 text-right">{fmtMoney(view.taxTotal)}</div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                <div className="py-1">Handling / Freight</div>
                <div className="py-1 text-center">: ₹</div>
                <div className="py-1 text-right">0.00</div>
              </div>
              <div className="grid grid-cols-[1fr_64px_120px] border-b border-black">
                <div className="py-1">Round Off</div>
                <div className="py-1 text-center">: ₹</div>
                <div className="py-1 text-right">0.00</div>
              </div>
              <div className="grid grid-cols-[1fr_64px_120px] mt-1 border-b border-black">
                <div className="text-[18px] leading-6 font-black whitespace-nowrap">Grand Total</div>
                <div className="text-center text-[18px] leading-6 font-black whitespace-nowrap">: ₹</div>
                <div className="text-right text-[18px] leading-6 font-black whitespace-nowrap">
                  {fmtMoney(view.grandTotal)}
                </div>
              </div>

              <div className="mt-2 border-t border-black pt-1 text-center">
                <div className="text-[11px] font-medium">
                  Certified that the particulars given above are true and correct
                </div>
                <div className="text-[22px] leading-7 font-black mt-1">
                  For YUVIRAA SILKS
                </div>
                <div className="h-14 mt-1 mb-1 border border-black/70 bg-white">
                  &nbsp;
                </div>
                <div className="text-[12px] font-semibold uppercase">
                  AUTHORIZED SIGNATORY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
