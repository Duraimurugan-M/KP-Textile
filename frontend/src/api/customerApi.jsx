
import customFetch from "../utils/customFetch";
import { buildQueryParams } from "../utils/queryBuilder";

export const getCustomers = (queryOptions) => {
  const params = buildQueryParams(queryOptions);
  return customFetch.get("/customers", { params });
};

export const createCustomer = (data) => {
  return customFetch.post("/customers", data);
};

export const updateCustomer = (id, data) => {
  return customFetch.put(`/customers/${id}`, data);
};

export const deleteCustomer = (id) => {
  return customFetch.delete(`/customers/${id}`);
};