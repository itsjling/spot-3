export type SavedItemStatus =
  | "pending"
  | "resolved"
  | "needs-review"
  | "failed";

export interface ClassifiedPastedSource {
  rawText: string;
  sourceDomain?: string;
  sourceUrl?: string;
}

const urlPattern = /https?:\/\/[^\s]+/iu;

export const classifyPastedSource = (
  source: string
): ClassifiedPastedSource => {
  const rawText = source.trim();
  const urlText = rawText.match(urlPattern)?.[0] ?? rawText;

  try {
    const url = new URL(urlText);

    return {
      rawText,
      sourceDomain: url.hostname.replace(/^www\./iu, ""),
      sourceUrl: url.toString(),
    };
  } catch {
    return { rawText };
  }
};
