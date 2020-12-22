import TransformResult from "../transform/transformResult";

function deepMergeTransformResultArray(
  total: TransformResult,
  current: TransformResult,
  objectName: string
): TransformResult {
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
export function addKeyPrefixToTransformResult(
  a: TransformResult,
  prefix: string
): TransformResult {
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
  a: TransformResult,
  objectName: string
): TransformResult {
  return {
    success: a.success,
    data:
      "" in a.data ? { [objectName]: a.data[""] } : { [objectName]: a.data },
    extra: a.extra.map((key) => `${objectName}.${key}`),
    failed: a.failed.map((key) => `${objectName}.${key}`),
    missing: a.missing.map((key) => `${objectName}.${key}`),
    messages: a.messages.map(({ key, problem }) => ({
      key: `${objectName}.${key}`,
      problem,
    })),
  };
}

export function mergeTransformResult(
  a: TransformResult,
  b: TransformResult
): TransformResult {
  return {
    success: a.success && b.success,
    data: { ...a.data, ...b.data },
    extra: [...a.extra, ...b.extra],
    failed: [...a.failed, ...b.failed],
    missing: [...a.missing, ...b.missing],
    messages: [...a.messages, ...b.messages],
  };
}

export function defaultTransformResult(): TransformResult {
  return {
    success: true,
    data: {},
    extra: [],
    failed: [],
    missing: [],
    messages: [],
  };
}

export function succesfulDataTransformResult(data: {
  [key: string]: any;
}): TransformResult {
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
  a: TransformResult[],
  objectName: string
): TransformResult {
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
        deepMergeTransformResultArray(total, current, objectName),
      succesfulDataTransformResult({ [objectName]: [] })
    );
}
