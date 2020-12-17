export default interface ValidateResult {
  success: boolean;
  data: any;
  extra: string[];
  failed: string[];
  missing: string[];
  messages: { key: string; problem: string }[];
}