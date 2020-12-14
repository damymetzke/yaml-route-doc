import Validator from "../../src/validate/validator";
import ValidateResult from "../../src/validate/validateResult";

test("Validator will return true with valid data", () => {
  const validator = new Validator();

  expect(validator.validate({ a: "Hello World!" })).toStrictEqual({
    success: true,
    data: { a: "Hello World!" },
  });
});

test("Validator will return false with non-object and null input", () => {
  const validator = new Validator();

  expect(validator.validate(null)).toStrictEqual({
    success: false,
    data: null,
  });
  expect(validator.validate(42)).toStrictEqual({
    success: false,
    data: null,
  });
  expect(validator.validate(false)).toStrictEqual({
    success: false,
    data: null,
  });
  expect(validator.validate("Hello World!")).toStrictEqual({
    success: false,
    data: null,
  });
  expect(validator.validate(() => {})).toStrictEqual({
    success: false,
    data: null,
  });
});
