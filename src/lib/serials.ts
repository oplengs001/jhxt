export interface DeviceColumn {
  id: string;
  label: string;
}

export interface SerialInventoryPayload {
  subtitle?: string;
  columns: DeviceColumn[];
  rows: Array<Record<string, string>>;
}

/**
 * Normalizes raw serial data from the database into a consistent,
 * fully customizable column and row schema.
 * Handles:
 * 1. New dynamic schema: { columns: [...], rows: [...], subtitle?: "..." }
 * 2. Legacy Wilmar PDF format: [{ cameraSerial, hddSerial, nvrSerial }]
 * 3. Empty or null state
 */
export function normalizeSerials(raw: any): {
  subtitle: string;
  columns: DeviceColumn[];
  rows: Array<Record<string, string>>;
} {
  const defaultSubtitle = "HARDWARE & EQUIPMENT ASSET REGISTER";

  if (!raw) {
    return {
      subtitle: defaultSubtitle,
      columns: [
        { id: "col_1", label: "Device Serial Number" },
      ],
      rows: [],
    };
  }

  // 1. If it's an object containing columns and rows
  if (typeof raw === "object" && !Array.isArray(raw)) {
    let columns: DeviceColumn[] = [];
    if (Array.isArray(raw.columns)) {
      columns = raw.columns.map((col: any, idx: number) => {
        if (typeof col === "string") {
          return { id: `col_${idx + 1}`, label: col };
        }
        return {
          id: col.id || `col_${idx + 1}`,
          label: col.label || col.name || `Device ${idx + 1}`,
        };
      });
    }

    if (columns.length === 0) {
      columns = [{ id: "col_1", label: "Device Serial Number" }];
    }

    const rows: Array<Record<string, string>> = Array.isArray(raw.rows)
      ? raw.rows.map((row: any) => {
          if (Array.isArray(row)) {
            // If row is an array of strings: [val1, val2, ...]
            const obj: Record<string, string> = {};
            columns.forEach((col, idx) => {
              obj[col.id] = String(row[idx] || "");
            });
            return obj;
          }
          if (typeof row === "object" && row !== null) {
            return row;
          }
          return {};
        })
      : [];

    return {
      subtitle: raw.subtitle || defaultSubtitle,
      columns,
      rows,
    };
  }

  // 2. If it's an array of objects (Legacy structure: [{ cameraSerial, hddSerial, nvrSerial }])
  if (Array.isArray(raw)) {
    if (raw.length === 0) {
      return {
        subtitle: defaultSubtitle,
        columns: [{ id: "col_1", label: "Device Serial Number" }],
        rows: [],
      };
    }

    const first = raw[0];
    if (first && typeof first === "object") {
      const keys = Object.keys(first).filter((k) => k !== "notes" && k !== "id");
      
      const columns: DeviceColumn[] = keys.map((key, idx) => {
        let label = key;
        if (key === "cameraSerial") label = "Camera Serial Number";
        else if (key === "hddSerial") label = "4TB HDD Serial Number";
        else if (key === "nvrSerial") label = "NVR Serial Number";
        else {
          label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
        }
        return { id: key, label };
      });

      return {
        subtitle: "SURVEILLANCE & STORAGE HARDWARE ASSET REGISTER",
        columns: columns.length > 0 ? columns : [{ id: "col_1", label: "Device Serial Number" }],
        rows: raw,
      };
    }
  }

  return {
    subtitle: defaultSubtitle,
    columns: [{ id: "col_1", label: "Device Serial Number" }],
    rows: [],
  };
}

/**
 * Counts non-empty serial entries for each column.
 */
export function countColumnSerials(
  columns: DeviceColumn[],
  rows: Array<Record<string, string>>
): Record<string, number> {
  const counts: Record<string, number> = {};
  columns.forEach((col) => {
    counts[col.id] = rows.filter((r) => r[col.id] && String(r[col.id]).trim().length > 0).length;
  });
  return counts;
}
