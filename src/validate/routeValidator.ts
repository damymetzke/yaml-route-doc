import ValidateResult from "./validateResult";
import Validator from "./validator";

function testType(
  type:
    | "bigint"
    | "boolean"
    | "function"
    | "number"
    | "object"
    | "string"
    | "symbol"
    | "undefined"
): (data: any) => undefined | string {
  return (data): undefined | string => {
    // type has already been limited in function signature.
    // eslint-disable-next-line valid-typeof
    if (typeof data !== type) {
      return `expected type '${type}', recieved type '${typeof data}'.`;
    }

    return undefined;
  };
}

function generateParameterValidator(): Validator {
  const result = new Validator();

  result.registerRule({
    key: "key",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "type",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "restrictions",
    required: false,
    test: testType("string"),
  });

  return result;
}

function generateMethodValidator(): Validator {
  const result = new Validator();

  const parameterValidator = generateParameterValidator();

  result.registerRule({
    key: "verb",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "auth",
    required: false,
    test: testType("string"),
  });

  result.registerRule({
    key: "role",
    required: false,
    test: testType("string"),
  });

  result.registerRule({
    key: "responseType",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "requestType",
    required: false,
    test: testType("string"),
  });

  result.registerRule({
    key: "responseData",
    required: false,
    test: (data) => {
      if (!Array.isArray(data)) {
        return "not an array";
      }

      if (
        !data.every(
          (parameter) => parameterValidator.validate(parameter).success
        )
      ) {
        return "validation failed for one or more response parameters";
      }

      return undefined;
    },
  });

  result.registerRule({
    key: "requestData",
    required: false,
    test: (data) => {
      if (!Array.isArray(data)) {
        return "expected an array, recieved something else";
      }

      if (
        !data.every(
          (parameter) => parameterValidator.validate(parameter).success
        )
      ) {
        return "validation failed for one or more request parameters";
      }

      return undefined;
    },
  });

  return result;
}

export default function generateRouteValidator(): Validator {
  const result = new Validator();

  const methodValidator = generateMethodValidator();

  result.registerRule({
    key: "name",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "method",
    required: true,
    test: (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        return "expected an array, recieved something else";
      }

      const validateResult: ValidateResult = data
        .map((method, index): [ValidateResult, number] => [
          methodValidator.validate(method),
          index,
        ])
        .reduce(
          (total: ValidateResult, [current, index]) => ({
            success: total.success && current.success,
            data: {},
            extra: [...total.extra, ...current.extra],
            failed: [...total.failed, ...current.failed],
            missing: [...total.missing, ...current.missing],
            messages: [
              ...total.messages,
              ...current.messages.map(({ key, problem }) => ({
                key: `[${index}].${key}`,
                problem,
              })),
            ],
          }),
          {
            success: true,
            data: {},
            extra: [],
            failed: [],
            missing: [],
            messages: [],
          }
        );

      if (!validateResult.success) {
        return validateResult;
      }

      return undefined;
    },
  });

  return result;
}
