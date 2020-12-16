import ValidateResult from "./validateResult";

export default interface ValidateRule {
  key: string;
  required: boolean;
  test: (data: unknown) => undefined | string | ValidateResult;
}
