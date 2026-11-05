export const DISCLOSURE_CHECKS = [
  {
    id: "paid-partnership",
    label: "The post will show a paid-partnership label, or #ad / #sponsored, where viewers see it first.",
  },
  {
    id: "material-connection",
    label: "The creator will disclose the material connection with the brand (FTC).",
  },
  {
    id: "asci-upfront",
    label: "The disclosure is upfront and prominent, including on the first line of the caption (ASCI).",
  },
  {
    id: "no-misleading-claims",
    label: "Claims about the product will match what the brand can support. No invented results.",
  },
] as const;

export type DisclosureCheckId = (typeof DISCLOSURE_CHECKS)[number]["id"];

export const disclosureCheckIdSchemaValues = DISCLOSURE_CHECKS.map((item) => item.id);
