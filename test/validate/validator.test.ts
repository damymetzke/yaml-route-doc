import Validator from "../../src/validate/validator";

function generateInput(
  extra: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
  return {
    name: "name",
    ...extra,
  };
}

function generateValidator(): Validator {
  const result = new Validator();
  result.registerRule({ key: "name", required: true });
  return result;
}

test("Validator will return succesful result with valid data.", () => {
  const validator = generateValidator();

  expect(validator.validate(generateInput())).toStrictEqual({
    success: true,
    data: generateInput(),
    extra: [],
  });
});

test("Validator will return failed result with non-object or null as input.", () => {
  const validator = generateValidator();

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
  const validator = generateValidator();

  expect(validator.validate(generateInput({ not: "required" }))).toStrictEqual({
    success: false,
    data: generateInput(),
    extra: ["not"],
  });
});
