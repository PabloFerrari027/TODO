export type ListingOutput<T> = Promise<{
  data: Array<T>;
  pages: number;
}>;
