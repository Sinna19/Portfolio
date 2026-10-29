export const labSlugs = ["mcp-gateway", "aster-row", "eval-harness"] as const;
export function labHref(index: number, view = "demo") {
  return `/labs/${labSlugs[index] ?? labSlugs[0]}${view === "implementation" ? "?view=implementation" : ""}`;
}
export function labIndex(slug: string) {
  return labSlugs.findIndex((s) => s === slug);
}
