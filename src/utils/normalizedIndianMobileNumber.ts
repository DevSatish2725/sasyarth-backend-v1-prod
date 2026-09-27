  export function normalizeIndianMobile(identifier: string) {
    const digits = identifier.replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
      return digits.slice(2);
    }

    return digits;
  }