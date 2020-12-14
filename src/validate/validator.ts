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
      };
    }

    const required = new Set(this.#required);

    const result: ValidateResult = {
      success: true,
      data: {},
      extra: [],
      failed: [],
      missing: [],
    };

    Object.entries(data).forEach(([key, value]) => {
      if (!(key in this.#rules)) {
        result.success = false;
        result.extra.push(key);
        return;
      }

      if (required.has(key)) {
        required.delete(key);
      }

      if (!this.#rules[key].test(value)) {
        result.success = false;
        result.failed.push(key);
        return;
      }

      result.data[key] = value;
    });

    if (required.size > 0) {
      result.success = false;
      result.missing = [...required];
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
