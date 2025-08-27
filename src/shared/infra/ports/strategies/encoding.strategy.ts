export interface EncodingStrategy {
  encode(value: string): Promise<string>;
  dencode(value: string): Promise<string>;
}
