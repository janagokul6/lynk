import { z } from "zod";

const queryList = z.preprocess((value) => {
  if (value == null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return value;
}, z.array(z.string().trim().min(1).max(128)).max(30).optional());

const optionalNumber = z.preprocess((value) => {
  if (value == null || value === "") return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}, z.coerce.number().finite().nonnegative().optional());

const optionalBoundedInt = (min: number, max: number) =>
  z.preprocess((value) => {
    if (value == null || value === "") return undefined;
    if (Array.isArray(value)) return value[0];
    return value;
  }, z.coerce.number().int().min(min).max(max).optional());

export const marketplaceQuerySchema = z.object({
  search: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.string().trim().max(200).optional()
  ),
  platforms: queryList,
  categories: queryList,
  compensationTypes: queryList,
  payMin: optionalNumber,
  payMax: optionalNumber,
  locations: queryList,
  workTypes: queryList,
  posted: z.preprocess(
    (value) => (value == null || value === "" || value === "Any" ? undefined : value),
    z.enum(["7", "30"]).optional()
  ),
  sort: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.string().trim().max(64).optional()
  ),
  limit: optionalBoundedInt(1, 100),
  offset: optionalBoundedInt(0, 100_000),
});
