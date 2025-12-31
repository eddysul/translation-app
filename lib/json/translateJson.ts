/**
 * Utility to recursively translate JSON string values while preserving structure and keys.
 */

export function translateJsonObject(
  obj: any,
  translateFn: (text: string) => Promise<string>
): Promise<any> {
  if (obj === null || obj === undefined) {
    return Promise.resolve(obj);
  }

  if (typeof obj === 'string') {
    // Translate the string value
    return translateFn(obj);
  }

  if (Array.isArray(obj)) {
    // Recursively translate array elements
    return Promise.all(obj.map((item) => translateJsonObject(item, translateFn)));
  }

  if (typeof obj === 'object') {
    // Recursively translate object values (keep keys untouched)
    const entries = Object.entries(obj);
    return Promise.all(
      entries.map(async ([key, value]) => ({
        key,
        value: await translateJsonObject(value, translateFn),
      }))
    ).then((results) => {
      const translated: Record<string, any> = {};
      results.forEach(({ key, value }) => {
        translated[key] = value;
      });
      return translated;
    });
  }

  // Return other types (numbers, booleans, etc.) as-is
  return Promise.resolve(obj);
}

/**
 * Parse JSON string and translate all string values.
 * Returns the translated JSON as a string.
 */
export async function translateJson(
  jsonString: string,
  translateFn: (text: string) => Promise<string>
): Promise<string> {
  try {
    const parsed = JSON.parse(jsonString);
    const translated = await translateJsonObject(parsed, translateFn);
    return JSON.stringify(translated, null, 2);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
