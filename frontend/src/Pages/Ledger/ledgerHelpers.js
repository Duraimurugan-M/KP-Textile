import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

export const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toPdfText = (value) => {
  if (value === null || value === undefined) return "-";
  return String(value);
};

export const filterLedgerRows = ({
  rows = [],
  search = "",
  fromDate = "",
  toDate = "",
  searchFields = [],
  exactFilters = {},
}) => {
  const searchText = normalizeText(search);
  const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
  const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

  return rows.filter((row) => {
    const date = parseDate(row.dateRaw || row.date);

    if (from && (!date || date < from)) return false;
    if (to && (!date || date > to)) return false;

    const failedExactFilter = Object.entries(exactFilters).some(([field, value]) => {
      if (!value) return false;
      return normalizeText(row[field]) !== normalizeText(value);
    });

    if (failedExactFilter) return false;

    if (!searchText) return true;

    return searchFields.some((field) => normalizeText(row[field]).includes(searchText));
  });
};

export const sortLedgerRows = (rows = [], sort = "-dateRaw") => {
  if (!sort) return [...rows];

  const isDesc = sort.startsWith("-");
  const field = isDesc ? sort.slice(1) : sort;

  return [...rows].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    if (field.toLowerCase().includes("date")) {
      aValue = parseDate(aValue)?.getTime() ?? 0;
      bValue = parseDate(bValue)?.getTime() ?? 0;
    }

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return isDesc ? 1 : -1;
    if (aValue > bValue) return isDesc ? -1 : 1;
    return 0;
  });
};

export const paginateRows = (rows = [], page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return rows.slice(start, start + limit);
};

export const exportLedgerToExcel = ({
  rows = [],
  columns = [],
  title = "Ledger",
  fileName = "ledger",
}) => {
  const companyName = "YUVIRAA SILKS";
  const totalCols = Math.max(columns.length, 1);

  const headers = columns
    .map(
      (column) =>
        `<th style="background:#D4AF37;color:#2B1E10;border:1px solid #7A5A1F;padding:10px 8px;text-align:center;font-weight:700;">${escapeHtml(
          column.label
        )}</th>`
    )
    .join("");

  const body = rows
    .map((row, index) => {
      const bg = index % 2 === 0 ? "#FFFDF5" : "#F9F2DF";
      const cells = columns
        .map((column) => {
          const value = typeof column.value === "function" ? column.value(row) : row[column.key];
          return `<td style="border:1px solid #BFA46A;padding:8px;background:${bg};">${escapeHtml(
            value
          )}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const html = `
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="font-family:Calibri,Segoe UI,Arial,sans-serif;background:#FFFDF8;">
      <table style="border-collapse:collapse;margin:0 auto;min-width:900px;">
        <tr>
          <td colspan="${totalCols}" style="text-align:center;background:#7A0E17;color:#F7E4A0;font-size:24px;font-weight:800;padding:14px;border:2px solid #4E0A10;">
            ${escapeHtml(companyName)}
          </td>
        </tr>
        <tr>
          <td colspan="${totalCols}" style="text-align:center;background:#F6E5B3;color:#5A3B0A;font-size:16px;font-weight:700;padding:10px;border:2px solid #B68A2C;border-top:none;">
            ${escapeHtml(title)}
          </td>
        </tr>
        <thead>
          <tr>${headers}</tr>
        </thead>
        <tbody>
          ${
            body ||
            `<tr><td colspan="${columns.length}" style="border:1px solid #BFA46A;padding:10px;text-align:center;background:#FFFDF5;">No records found</td></tr>`
          }
        </tbody>
      </table>
    </body>
  </html>`;

  saveAs(
    new Blob([`\uFEFF${html}`], { type: "application/vnd.ms-excel;charset=utf-8;" }),
    `${fileName}.xls`
  );
};

export const exportLedgerToPdf = ({
  rows = [],
  columns = [],
  title = "Ledger",
  fileName = "ledger",
}) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const companyName = "YUVIRAA SILKS";
  const marginX = 10;
  const marginY = 10;
  const rowHeight = 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - marginX * 2;
  const columnWidth = usableWidth / Math.max(columns.length, 1);

  const fitCellText = (text, maxWidth) => {
    const safeText = toPdfText(text).replace(/\s+/g, " ").trim();
    if (doc.getTextWidth(safeText) <= maxWidth) return safeText;

    let compact = safeText;
    while (compact.length > 0 && doc.getTextWidth(`${compact}...`) > maxWidth) {
      compact = compact.slice(0, -1);
    }

    return compact ? `${compact}...` : "";
  };

  const drawHeader = () => {
    let y = marginY;

    doc.setFillColor(122, 14, 23);
    doc.rect(marginX, y, usableWidth, 13, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(247, 228, 160);
    doc.text(companyName, pageWidth / 2, y + 8, { align: "center" });

    doc.setFillColor(246, 229, 179);
    doc.rect(marginX, y + 13, usableWidth, 8, "F");

    doc.setFontSize(13);
    doc.setTextColor(90, 59, 10);
    doc.text(title, pageWidth / 2, y + 18.5, { align: "center" });

    y += 23;

    doc.setFillColor(212, 175, 55);
    doc.rect(marginX, y, usableWidth, rowHeight, "F");

    doc.setFontSize(10);
    doc.setTextColor(43, 30, 16);
    doc.setDrawColor(122, 90, 31);

    columns.forEach((column, index) => {
      const x = marginX + index * columnWidth;
      doc.rect(x, y, columnWidth, rowHeight);
      doc.text(fitCellText(column.label, columnWidth - 3), x + 1.5, y + 5.4);
    });

    return y + rowHeight;
  };

  let y = drawHeader();

  if (!rows.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setDrawColor(191, 164, 106);
    doc.rect(marginX, y, usableWidth, rowHeight);
    doc.text("No records found", marginX + 1.5, y + 5.4);
    doc.save(`${fileName}.pdf`);
    return;
  }

  rows.forEach((row, rowIndex) => {
    if (y + rowHeight > pageHeight - marginY) {
      doc.addPage();
      y = drawHeader();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.setDrawColor(191, 164, 106);

    columns.forEach((column, index) => {
      const x = marginX + index * columnWidth;
      const value = typeof column.value === "function" ? column.value(row) : row[column.key];

      if (rowIndex % 2 === 0) {
        doc.setFillColor(255, 253, 245);
      } else {
        doc.setFillColor(249, 242, 223);
      }

      doc.rect(x, y, columnWidth, rowHeight, "FD");
      doc.text(fitCellText(value, columnWidth - 3), x + 1.5, y + 5.4);
    });

    y += rowHeight;
  });

  doc.save(`${fileName}.pdf`);
};
