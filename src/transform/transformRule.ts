import TransformResult from "./transformResult";

export default interface TransformRule {
  key: string;
  required: boolean;
  test: (data: unknown) => string | TransformResult | TransformResult[];
}
