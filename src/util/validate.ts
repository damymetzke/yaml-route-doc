import marked from "marked";
import ValidateResult from "../validate/validateResult";
import Validator from "../validate/validator";
import { succesfulDataValidateResult } from "./validateResult";

export function testMarkdown(): (data: any) => string | ValidateResult {
  return (data: any): string | ValidateResult => {
    if (typeof data !== "string") {
      return `expected type 'string', recieved type '${typeof data}'.`;
    }

    return succesfulDataValidateResult({
      "": marked(data),
    });
  };
}

export function testList(
  test: RegExp = /[^]*/
): (data: any) => string | ValidateResult {
  return (data: any): string | ValidateResult => {
    let result: string[] = [];
    if (Array.isArray(data)) {
      if (!data.every((value) => typeof value === "string")) {
        return `recieved array, but expected all elements to be of type 'string'.`;
      }
      result = data;
    } else if (typeof data === "string") {
      result = data.split("|");
    } else {
      return `expected type 'string' or 'array'.`;
    }

    if (!result.every((value) => test.test(value))) {
      return `regular expression failed`;
    }

    return succesfulDataValidateResult({
      "": result,
    });
  };
}
export function testType(
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

export function testChildrenWithValidator(
  validator: Validator
): (data: any) => string | ValidateResult[] {
  return (data: any): string | ValidateResult[] => {
    if (!Array.isArray(data) || data.length === 0) {
      return "expected an array, recieved something else";
    }

    return data.map((child): ValidateResult => validator.validate(child));
  };
}

export function testChildWithValidator(
  validator: Validator
): (data: any) => string | ValidateResult {
  return (data: any): string | ValidateResult => {
    if (typeof data !== "object" || data === null) {
      return "expected a non-null object, recieved something else";
    }

    return validator.validate(data);
  };
}
