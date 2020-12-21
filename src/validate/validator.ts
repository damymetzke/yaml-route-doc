import {
  addKeyPrefixToValidateResult,
  addToObject,
  addArrayToObject,
  mergeValidateResult,
} from "../util/validateResult";
import ValidateResult from "./validateResult";
import ValidateRule from "./validateRule";

export default class Validator {
  #rules: { [key: string]: ValidateRule } = {};

  #required: Set<string> = new Set();

  validate(data: unknown): ValidateResult {
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

    let result: ValidateResult = {
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
        result = mergeValidateResult(result, addArrayToObject(testResult, key));
        return;
      }
      if (typeof testResult === "object") {
        result = mergeValidateResult(result, addToObject(testResult, key));
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

  registerRule(rule: ValidateRule) {
    this.#rules[rule.key] = rule;
    if (rule.required) {
      this.#required.add(rule.key);
    }
  }
}
