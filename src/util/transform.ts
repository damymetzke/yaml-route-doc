import marked from "marked";
import highlight from "highlight.js";
import TransformResult from "../transform/transformResult";
import Transformer from "../transform/transformer";
import { succesfulDataTransformResult } from "./transformResult";

const REGEX_ROUTE_LINK = /^route:(?<uri>[^]*)$/;
const REGEX_GROUP_LINK = /^group:(?<uri>[^]*)$/;

export function testMarkdown(
  relativeToRoute: string,
  relativeToGroup: string
): (data: any) => string | TransformResult {
  return (data: any): string | TransformResult => {
    if (typeof data !== "string") {
      return `expected type 'string', recieved type '${typeof data}'.`;
    }

    marked.use({
      renderer: <any>{
        link(href: string, title: string, text: string) {
          const convertedHref = (() => {
            const routeResult = REGEX_ROUTE_LINK.exec(href);
            if (routeResult !== null) {
              const uri = routeResult.groups?.uri;
              if (uri === undefined) {
                return "#";
              }

              return `${relativeToRoute}${uri
                .replace(/\//g, "_")
                .replace(/{/g, "_")
                .replace(/}/g, "")}.html`;
            }

            const groupResult = REGEX_GROUP_LINK.exec(href);
            if (groupResult !== null) {
              const uri = groupResult.groups?.uri;
              if (uri === undefined) {
                return "#";
              }
              return `${relativeToGroup}${uri
                .replace(/\//g, "_")
                .replace(/{/g, "_")
                .replace(/}/g, "")}.html`;
            }
            return href;
          })();
          const titleText = title === null ? "" : ` title=${title}`;
          return `<a href=${convertedHref}${titleText}>${text}</a>`;
        },
        code(code: string, infoString: string) {
          return `<pre><code class="language-${infoString}">\n${
            highlight.highlight(infoString, code).value
          }\n</code></pre>`;
        },
      },
    });

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
