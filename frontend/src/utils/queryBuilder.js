// src/utils/queryBuilder.js

export const buildQueryParams = ({
  page = 1,
  limit = 10,
  search = "",
  sort = "",
  filters = {},
}) => {
  const params = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (sort) {
    params.sort = sort;
  }

  // dynamic filters (future proof)
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== "" && filters[key] !== null) {
      params[key] = filters[key];
    }
  });

  return params;
};