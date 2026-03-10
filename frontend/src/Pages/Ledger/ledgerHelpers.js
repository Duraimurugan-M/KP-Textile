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

    const failedExactFilter = Object.entries(exactFilters).some(
      ([field, value]) => {
        if (!value) return false;
        return normalizeText(row[field]) !== normalizeText(value);
      }
    );

    if (failedExactFilter) return false;

    if (!searchText) return true;

    return searchFields.some((field) =>
      normalizeText(row[field]).includes(searchText)
    );
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

const escapeCsv = (value) => {
  const text = String(value ?? "");
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const exportLedgerToExcel = ({
  rows = [],
  columns = [],
  fileName = "ledger",
}) => {
  const headers = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((column) => {
          const value =
            typeof column.value === "function"
              ? column.value(row)
              : row[column.key];
          return escapeCsv(value);
        })
        .join(",")
    )
    .join("\n");

  const csv = `\uFEFF${headers}\n${body}`;
  saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${fileName}.csv`);
};

const toPdfText = (value) => {
  if (value === null || value === undefined) return "-";
  return String(value);
};

export const exportLedgerToPdf = ({
  rows = [],
  columns = [],
  title = "Ledger",
  fileName = "ledger",
}) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const marginX = 10;
  const marginY = 10;
  const rowHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - marginX * 2;
  const columnWidth = usableWidth / Math.max(columns.length, 1);

  let y = marginY;

  const drawHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, marginX, y);
    y += 8;

    doc.setFontSize(10);
    columns.forEach((column, index) => {
      doc.text(
        toPdfText(column.label).slice(0, 20),
        marginX + index * columnWidth,
        y
      );
    });

    y += rowHeight;
    doc.setFont("helvetica", "normal");
  };

  drawHeader();

  rows.forEach((row) => {
    if (y > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
      drawHeader();
    }

    columns.forEach((column, index) => {
      const value =
        typeof column.value === "function" ? column.value(row) : row[column.key];
      doc.text(
        toPdfText(value).slice(0, 22),
        marginX + index * columnWidth,
        y
      );
    });

    y += rowHeight;
  });

  doc.save(`${fileName}.pdf`);
};
