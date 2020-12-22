import {
  addToObject,
  addArrayToObject,
  mergeTransformResult,
} from "../util/transformResult";
import TransformResult from "./transformResult";
import TransformRule from "./transformRule";

export default class Transformer {
  #rules: { [key: string]: TransformRule } = {};

  #required: Set<string> = new Set();

  transform(data: unknown): TransformResult {
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        data: null,
        extra: [],
        failed: [],
        missing: [],
        messages: [
          {
            key: ".",
            problem:
              "Expected data to be validated to be of type object and not 'null'.",
          },
        ],
      };
    }

    const required = new Set(this.#required);

    let result: TransformResult = {
      success: true,
      data: {},
      extra: [],
      failed: [],
      missing: [],
      messages: [],
    };

    Object.entries(data).forEach(([key, value]) => {
      // undefined is considered the same as not existing
      if (value === undefined) {
        return;
      }
      if (!(key in this.#rules)) {
        result.success = false;
        result.extra.push(key);
        result.messages.push({
          key,
          problem: "key is not recognized by validator",
        });
        return;
      }

      if (required.has(key)) {
        required.delete(key);
      }

      const testResult = this.#rules[key].test(value);
      if (Array.isArray(testResult)) {
        result = mergeTransformResult(
          result,
          addArrayToObject(testResult, key)
        );
        return;
      }
      if (typeof testResult === "object") {
        result = mergeTransformResult(result, addToObject(testResult, key));
        return;
      }
      if (typeof testResult === "string") {
        result.success = false;
        result.failed.push(key);
        result.messages.push({
          key,
          problem: testResult,
        });
        return;
      }

      result.success = false;
      result.messages.push({
        key: "*",
        problem: "internal error, please get your programmer",
      });
    });

    if (required.size > 0) {
      result.success = false;
      result.missing = [...required];
      result.messages = [...required].map((key) => ({
        key,
        problem: "key is required",
      }));
    }

    return result;
  }

  registerRule(rule: TransformRule) {
    this.#rules[rule.key] = rule;
    if (rule.required) {
      this.#required.add(rule.key);
    }
  }
}
