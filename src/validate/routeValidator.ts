import ValidateResult from "./validateResult";
import Validator from "./validator";
import {
  mergeValidateResult,
  addKeyPrefixToValidateResult,
  defaultValidateResult,
  succesfulDataValidateResult,
  addArrayToObject,
} from "../util/validateResult";

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
): (data: any) => string | ValidateResult {
  return (data): string | ValidateResult => {
    // type has already been limited in function signature.
    // eslint-disable-next-line valid-typeof
    if (typeof data !== type) {
      return `expected type '${type}', recieved type '${typeof data}'.`;
    }

    return succesfulDataValidateResult({
      "": data,
    });
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

      return succesfulDataValidateResult({
        "": "problem here",
      });
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

      return succesfulDataValidateResult({
        "": "problem here",
      });
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

      return data.map(
        (method): ValidateResult => methodValidator.validate(method)
      );
    },
  });

  return result;
}
