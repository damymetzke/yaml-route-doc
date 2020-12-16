import ValidateResult from "../validate/validateResult";

export function addKeyPrefixToValidateResult(
  a: ValidateResult,
  prefix: string
): ValidateResult {
  return {
    success: a.success,
    data: a.data,
    extra: a.extra.map((key) => `${prefix}${key}`),
    failed: a.failed.map((key) => `${prefix}${key}`),
    missing: a.missing.map((key) => `${prefix}${key}`),
    messages: a.messages.map(({ key, problem }) => ({
      key: `${prefix}${key}`,
      problem,
    })),
  };
}

export function mergeValidateResult(
  a: ValidateResult,
  b: ValidateResult
): ValidateResult {
  return {
    success: a.success && b.success,
    data: {},
    extra: [...a.extra, ...b.extra],
    failed: [...a.failed, ...b.failed],
    missing: [...a.missing, ...b.missing],
    messages: [...a.messages, ...b.messages],
  };
}

export function defaultValidateResult(): ValidateResult {
  return {
    success: true,
    data: {},
    extra: [],
    failed: [],
    missing: [],
    messages: [],
  };
}
