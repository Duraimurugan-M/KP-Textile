class QueryBuilder {
  constructor(model, queryString, options = {}) {
    this.model = model;
    this.queryString = queryString;
    this.searchFields = options.searchFields || [];
  }

  build() {
    let query = this.model.find();

    // 🔍 SEARCH
    if (this.queryString.search && this.searchFields.length > 0) {
      const regex = new RegExp(this.queryString.search, "i");

      const searchConditions = this.searchFields.map((field) => ({
        [field]: regex,
      }));

      query = query.find({ $or: searchConditions });
    }

    // 🎯 FILTERING (exclude special fields)
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filter (gt, gte, lt, lte)
    let filterString = JSON.stringify(queryObj);
    filterString = filterString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    query = query.find(JSON.parse(filterString));

    // 🔃 SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 📄 PAGINATION
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    return query;
  }
}

export default QueryBuilder;