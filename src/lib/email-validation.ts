/**
 * Strict email validation. Rejects empty values, whitespace, missing domain,
 * no dot in the domain, and invalid TLDs (needs a real 2+ alpha-char TLD).
 */
export function isValidEmail(email: string): boolean {
    const value = (email || "").trim();
    if (!value) return false;

    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!re.test(value)) return false;

    const domain = value.split("@")[1];
    if (!domain || !domain.includes(".")) return false;
    if (/\.\./.test(domain)) return false;

    const tld = domain.split(".").pop() || "";
    return /^[a-zA-Z]{2,}$/.test(tld);
}
