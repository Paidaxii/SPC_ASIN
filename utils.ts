/**
 * Global declaration for SheetJS (loaded via CDN in index.html)
 */
declare var XLSX: any;

/**
 * Parses raw text (CSV or TSV) into a Map.
 * Assumes Column A is Key (SPC) and Column B is Value (ASIN).
 * If keys are duplicated, the last occurrence wins.
 */
export const parseReferenceData = (content: string): Map<string, string> => {
  const map = new Map<string, string>();
  const lines = content.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Detect separator: Tab (Excel paste) or Comma (CSV)
    let parts: string[] = [];
    if (trimmedLine.includes('\t')) {
      parts = trimmedLine.split('\t');
    } else {
      // Basic CSV split, handles simple cases
      parts = trimmedLine.split(',');
    }

    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      
      if (key) {
        // Map.set overwrites existing keys, satisfying "prioritize last ASIN" rule naturally
        map.set(key, value);
      }
    }
  });

  return map;
};

/**
 * Parses Excel file buffer into a Map.
 * Uses SheetJS to read the first sheet.
 * Assumes Column A is Key (SPC) and Column B is Value (ASIN).
 */
export const parseExcelData = (buffer: ArrayBuffer): Map<string, string> => {
  const map = new Map<string, string>();
  
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert sheet to array of arrays
    // header: 1 results in raw array of arrays [[A1, B1], [A2, B2], ...]
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    rows.forEach((row) => {
      if (row && row.length >= 2) {
        // Ensure values are treated as strings
        const key = String(row[0] || '').trim();
        const value = String(row[1] || '').trim();

        if (key) {
          map.set(key, value);
        }
      }
    });
  } catch (error) {
    console.error("Error parsing Excel data:", error);
    throw new Error("Failed to parse Excel file");
  }

  return map;
};

/**
 * Processes a list of query keys against the reference map.
 * Returns the result string joined by newlines, keeping exact line correspondence.
 */
export const processQuery = (input: string, referenceMap: Map<string, string>): { resultStr: string, found: number, missing: number } => {
  const lines = input.split(/\r?\n/);
  let found = 0;
  let missing = 0;

  const results = lines.map((line) => {
    // Preserve empty lines in input as empty lines in output if needed,
    // but the prompt implies input is a list of codes.
    // If the line is empty, we just output empty.
    const key = line.trim();
    
    if (!key) {
      return ''; 
    }

    const match = referenceMap.get(key);
    
    if (match) {
      found++;
      return match;
    } else {
      missing++;
      return ''; // "If not matched, empty line"
    }
  });

  return {
    resultStr: results.join('\n'),
    found,
    missing
  };
};