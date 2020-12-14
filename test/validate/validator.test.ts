import Validator from "../../src/validate/validator";

test("Validator will return true with valid data", () => {
  const validator = new Validator();

  expect(validator.validate({ a: "Hello World!" })).toStrictEqual(true);
});

test("Validator will return false with non-object and null input", () => {
  const validator = new Validator();

  expect(validator.validate(null)).toStrictEqual(false);
  expect(validator.validate(42)).toStrictEqual(false);
  expect(validator.validate(false)).toStrictEqual(false);
  expect(validator.validate("Hello World!")).toStrictEqual(false);
  expect(validator.validate(() => {})).toStrictEqual(false);
});
