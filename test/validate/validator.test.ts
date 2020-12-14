import Validator from "../../src/validate/validator";

test("Validator will return succesful result with valid data.", () => {
  const validator = new Validator();

  expect(validator.validate({})).toStrictEqual({
    success: true,
    data: {},
    extra: [],
  });
});

test("Validator will return failed result with non-object or null as input.", () => {
  const validator = new Validator();

  expect(validator.validate(null)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
  });
  expect(validator.validate(42)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
  });
  expect(validator.validate(false)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
  });
  expect(validator.validate("Hello World!")).toStrictEqual({
    success: false,
    data: null,
    extra: [],
  });
  expect(validator.validate(() => {})).toStrictEqual({
    success: false,
    data: null,
    extra: [],
  });
});

test("Validator will return failed result when too much input data is provided.", () => {
  const validator = new Validator();

  expect(validator.validate({ not: "required" })).toStrictEqual({
    success: false,
    data: {},
    extra: ["not"],
  });
});
