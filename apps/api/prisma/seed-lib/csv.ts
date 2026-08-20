/**
 * Parser CSV mínimo (RFC 4180: comillas dobles, comas y saltos de línea
 * dentro de campos citados, comillas escapadas como ""). Sin dependencias
 * externas para mantener el proyecto liviano.
 */
export function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const BOM = String.fromCharCode(0xfeff);
  const text = raw.startsWith(BOM) ? raw.slice(BOM.length) : raw; // BOM de Excel/Google Sheets

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      // ignora: el \n que sigue cierra la fila
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

/** Convierte filas crudas (con encabezado) en objetos { columna: valor }. */
export function csvRowsToRecords(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  const columns = header.map((h) => h.trim());

  return body.map((cells) => {
    const record: Record<string, string> = {};
    columns.forEach((col, idx) => {
      record[col] = (cells[idx] ?? '').trim();
    });
    return record;
  });
}

/** Serializa filas a texto CSV, citando campos que lo requieran. */
export function toCsv(header: string[], rows: string[][]): string {
  const escape = (value: string): string => {
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const lines = [header, ...rows].map((r) => r.map(escape).join(','));
  return lines.join('\r\n') + '\r\n';
}
