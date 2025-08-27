export interface ListingMetadata<Order, SortBy> {
  take?: number;
  skip?: number;
  order?: Order;
  sortBy?: SortBy;
}
