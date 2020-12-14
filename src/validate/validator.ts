import ValidateResult from "./validateResult";
import ValidateRule from "./validateRule";

export default class Validator {
  #rules: { [key: string]: ValidateRule } = {};

  validate(data: unknown): ValidateResult {
    if (typeof data !== "object" || data === null) {
      return {
        success: false,
        data: null,
      };
    }

    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key} => ${value}`);
    });

    return {
      success: true,
      data,
    };
  }

  registerRule(rule: ValidateRule) {
    this.#rules[rule.key] = rule;
  }
}
