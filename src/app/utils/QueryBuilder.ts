export class QueryBuilder {
  public prismaArgs: Record<string, unknown> = {};
  private query: Record<string, unknown>;

  constructor(query: Record<string, unknown>) {
    this.query = query;
    this.prismaArgs.where = {};
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm && typeof searchTerm === 'string') {
      const where = (this.prismaArgs.where || {}) as Record<string, unknown>;
      where.OR = searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }));
      this.prismaArgs.where = where;
    }
    return this;
  }

  filter() {
    const queryObj: Record<string, unknown> = { ...this.query };
    const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder'];
    excludeFields.forEach((el) => delete queryObj[el]);

    for (const key of Object.keys(queryObj)) {
      if (queryObj[key] === 'true') queryObj[key] = true;
      if (queryObj[key] === 'false') queryObj[key] = false;
    }

    if (Object.keys(queryObj).length > 0) {
      const currentWhere = (this.prismaArgs.where || {}) as Record<string, unknown>;
      this.prismaArgs.where = {
        ...currentWhere,
        ...queryObj
      };
    }

    // Clean up empty where object if nothing was added
    const where = this.prismaArgs.where as Record<string, unknown> | undefined;
    if (where && Object.keys(where).length === 0) {
      delete this.prismaArgs.where;
    }

    return this;
  }

  sort() {
    const sortBy = typeof this.query?.sortBy === 'string' ? this.query.sortBy : 'createdAt';
    const sortOrder = typeof this.query?.sortOrder === 'string' ? this.query.sortOrder : 'desc';

    this.prismaArgs.orderBy = {
      [sortBy]: sortOrder
    };
    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.prismaArgs.skip = skip;
    this.prismaArgs.take = limit;

    return this;
  }

  build() {
    // If where is completely empty after all operations, remove it
    const where = this.prismaArgs.where as Record<string, unknown> | undefined;
    if (where && Object.keys(where).length === 0) {
      delete this.prismaArgs.where;
    }
    return this.prismaArgs;
  }
}
