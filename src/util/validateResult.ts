import ValidateResult from "../validate/validateResult";

function deepMergeValidateResultArray(
  total: ValidateResult,
  current: ValidateResult,
  objectName: string
): ValidateResult {
  return {
    success: total.success && current.success,
    data: { [objectName]: [...total.data[objectName], current.data[""]] },
    extra: [...total.extra, ...current.extra],
    failed: [...total.failed, ...current.failed],
    missing: [...total.missing, ...current.missing],
    messages: [...total.messages, ...current.messages],
  };
}

/**
 * @deprecated use addToObject or addArrayToObject instead
 */
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

export function addToObject(
  a: ValidateResult,
  objectName: string
): ValidateResult {
  return {
    success: a.success,
    data: { [objectName]: a.data },
    extra: a.extra.map((key) => `${objectName}.${key}`),
    failed: a.failed.map((key) => `${objectName}.${key}`),
    missing: a.missing.map((key) => `${objectName}.${key}`),
    messages: a.messages.map(({ key, problem }) => ({
      key: `${objectName}.${key}`,
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
    data: { ...a.data, ...b.data },
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

export function succesfulDataValidateResult(data: {
  [key: string]: any;
}): ValidateResult {
  return {
    success: true,
    data,
    extra: [],
    failed: [],
    missing: [],
    messages: [],
  };
}

export function addArrayToObject(
  a: ValidateResult[],
  objectName: string
): ValidateResult {
  return a
    .map((value, index) => ({
      success: value.success,
      data: { "": value.data },
      extra: value.extra.map((key) => `[${index}].${key}`),
      failed: value.failed.map((key) => `${index}.${key}`),
      missing: value.missing.map((key) => `${index}.${key}`),
      messages: value.messages.map(({ key, problem }) => ({
        key: `[${index}].${key}`,
        problem,
      })),
    }))
    .reduce(
      (total, current) =>
        deepMergeValidateResultArray(total, current, objectName),
      succesfulDataValidateResult({ [objectName]: [] })
    );
}
