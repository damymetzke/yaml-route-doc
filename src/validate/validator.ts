import ValidateResult from "./validateResult";
import ValidateRule from "./validateRule";

export default class Validator {
  #rules: { [key: string]: ValidateRule } = {};

  validate(data: unknown): ValidateResult {
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        data: null,
        extra: [],
        failed: [],
      };
    }

    const result: ValidateResult = {
      success: true,
      data: {},
      extra: [],
      failed: [],
    };

    Object.entries(data).forEach(([key, value]) => {
      if (!(key in this.#rules)) {
        result.success = false;
        result.extra.push(key);
        return;
      }

      if (!this.#rules[key].test(value)) {
        result.success = false;
        result.failed.push(key);
        return;
      }

      result.data[key] = value;
    });

    return result;
  }

  registerRule(rule: ValidateRule) {
    this.#rules[rule.key] = rule;
  }
}
