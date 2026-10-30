import type { Request, Response } from "express";
import * as service from "./marketplace.service.js";

export async function list(req: Request, res: Response): Promise<void> {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const platforms = Array.isArray(req.query.platforms)
    ? (req.query.platforms as string[])
    : typeof req.query.platforms === "string"
      ? [req.query.platforms]
      : undefined;
  const categories = Array.isArray(req.query.categories)
    ? (req.query.categories as string[])
    : typeof req.query.categories === "string"
      ? [req.query.categories]
      : undefined;
  const compensationTypes = Array.isArray(req.query.compensationTypes)
    ? (req.query.compensationTypes as string[])
    : typeof req.query.compensationTypes === "string"
      ? [req.query.compensationTypes]
      : undefined;
  const payMin = req.query.payMin != null ? Number(req.query.payMin) : undefined;
  const payMax = req.query.payMax != null ? Number(req.query.payMax) : undefined;
  const locations = Array.isArray(req.query.locations)
    ? (req.query.locations as string[])
    : typeof req.query.locations === "string"
      ? [req.query.locations]
      : undefined;
  const workTypes = Array.isArray(req.query.workTypes)
    ? (req.query.workTypes as string[])
    : typeof req.query.workTypes === "string"
      ? [req.query.workTypes]
      : undefined;
  const posted =
    req.query.posted === "7" || req.query.posted === "30" ? req.query.posted : undefined;
  const sort =
    typeof req.query.sort === "string" && req.query.sort.length ? req.query.sort : undefined;
  const limit = req.query.limit != null ? Number(req.query.limit) : undefined;
  const offset = req.query.offset != null ? Number(req.query.offset) : undefined;

  const filters: service.MarketplaceFilters = {
    search,
    platforms,
    categories,
    compensationTypes,
    payMin: Number.isFinite(payMin) ? payMin : undefined,
    payMax: Number.isFinite(payMax) ? payMax : undefined,
    locations,
    workTypes,
    posted,
    sort,
    limit,
    offset,
  };

  const rows = await service.listMarketplaceCampaigns(filters);
  const body = rows.map(service.toMarketplaceCampaignResponse);
  res.json(body);
}
