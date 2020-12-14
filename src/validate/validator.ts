import ValidateResult from "./validateResult";

export default class Validator {
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
}
