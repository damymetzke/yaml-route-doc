import marked from "marked";
import TransformResult from "../transform/transformResult";
import Transformer from "../transform/transformer";
import { succesfulDataTransformResult } from "./transformResult";

export function testMarkdown(): (data: any) => string | TransformResult {
  return (data: any): string | TransformResult => {
    if (typeof data !== "string") {
      return `expected type 'string', recieved type '${typeof data}'.`;
    }

    return succesfulDataTransformResult({
      "": marked(data),
    });
  };
}

export function testList(
  test: RegExp = /[^]*/
): (data: any) => string | TransformResult {
  return (data: any): string | TransformResult => {
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

    return succesfulDataTransformResult({
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
): (data: any) => string | TransformResult {
  return (data): string | TransformResult => {
    // type has already been limited in function signature.
    // eslint-disable-next-line valid-typeof
    if (typeof data !== type) {
      return `expected type '${type}', recieved type '${typeof data}'.`;
    }

    return succesfulDataTransformResult({
      "": data,
    });
  };
}

export function testChildrenWithTransformer(
  transformer: Transformer
): (data: any) => string | TransformResult[] {
  return (data: any): string | TransformResult[] => {
    if (!Array.isArray(data) || data.length === 0) {
      return "expected an array, recieved something else";
    }

    return data.map((child): TransformResult => transformer.transform(child));
  };
}

export function testChildWithTransformer(
  transformer: Transformer
): (data: any) => string | TransformResult {
  return (data: any): string | TransformResult => {
    if (typeof data !== "object" || data === null) {
      return "expected a non-null object, recieved something else";
    }

    return transformer.transform(data);
  };
}
