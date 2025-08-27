export class BasePresenter {
  static execute<Data, Fields extends Array<keyof Data>>(
    data: Data,
    fields?: Fields,
  ): Pick<Data, Fields[number]> {
    if (!fields || fields.length === 0) return data;

    return Object.fromEntries(
      fields.map((field) => [field, data[field]]),
    ) as Pick<Data, Fields[number]>;
  }
}
