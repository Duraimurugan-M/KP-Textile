

import customFetch from "../utils/customFetch";
import { buildQueryParams } from "../utils/queryBuilder";

export const getVendors = (queryOptions) => {
  const params = buildQueryParams(queryOptions);
  return customFetch.get("/vendors", { params });
};

export const createVendor = (data) => {
  return customFetch.post("/vendors", data);
};

export const updateVendor = (id, data) => {
  return customFetch.put(`/vendors/${id}`, data);
};

export const deleteVendor = (id) => {
  return customFetch.delete(`/vendors/${id}`);
};