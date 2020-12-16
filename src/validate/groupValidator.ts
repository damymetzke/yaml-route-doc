import Validator from "./validator";
import ValidateResult from "./validateResult";
import {
  mergeValidateResult,
  addKeyPrefixToValidateResult,
  defaultValidateResult,
  succesfulDataValidateResult,
} from "../util/validateResult";

// todo: combine duplicate code at routeValidator.
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

function generateVariableValidator(): Validator {
  const result = new Validator();

  result.registerRule({
    key: "responseType",
    required: false,
    test: testType("string"),
  });

  result.registerRule({
    key: "requestType",
    required: false,
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

  return result;
}

export default function generateGroupValidator(): Validator {
  const result = new Validator();

  const variableValidator = generateVariableValidator();

  result.registerRule({
    key: "name",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "variables",
    required: false,
    test: (data) => {
      if (typeof data !== "object" || data === null) {
        return "expected a non-null object, recieved something else";
      }

      const validateResult: ValidateResult = variableValidator.validate(data);

      return validateResult;
    },
  });

  return result;
}
