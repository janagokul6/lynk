import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

let cachedSpec: Record<string, unknown> | null = null;

export function getOpenApiSpec(): Record<string, unknown> {
  if (cachedSpec) return cachedSpec;

  const yamlPath = join(process.cwd(), "openapi.yaml");
  const yamlContent = readFileSync(yamlPath, "utf-8");
  cachedSpec = parse(yamlContent) as Record<string, unknown>;
  return cachedSpec;
}
