/**
 * Client-side CSV generation and download utilities.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function csvFromArray<T extends Record<string, any>>(
  rows: T[],
  columns: { key: keyof T; label: string }[],
): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        if (val == null) return "";
        return escapeCsvField(String(val));
      })
      .join(","),
  );
  return [header, ...lines].join("\n");
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
