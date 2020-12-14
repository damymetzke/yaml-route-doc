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
  result.registerRule({
    key: "name",
    required: true,
    test: (data) => typeof data === "string",
  });
  return result;
}

test("Validator will return succesful result with valid data.", () => {
  const validator = generateValidator();

  expect(validator.validate(generateInput())).toStrictEqual({
    success: true,
    data: generateInput(),
    extra: [],
    failed: [],
    missing: [],
  });
});

test("Validator will return failed result with non-object or null as input.", () => {
  const validator = generateValidator();

  expect(validator.validate(null)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
    failed: [],
    missing: [],
  });
  expect(validator.validate(42)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
    failed: [],
    missing: [],
  });
  expect(validator.validate(false)).toStrictEqual({
    success: false,
    data: null,
    extra: [],
    failed: [],
    missing: [],
  });
  expect(validator.validate("Hello World!")).toStrictEqual({
    success: false,
    data: null,
    extra: [],
    failed: [],
    missing: [],
  });
  expect(validator.validate(() => {})).toStrictEqual({
    success: false,
    data: null,
    extra: [],
    failed: [],
    missing: [],
  });
});

test("Validator will return failed result when too much input data is provided.", () => {
  const validator = generateValidator();

  expect(validator.validate(generateInput({ not: "required" }))).toStrictEqual({
    success: false,
    data: generateInput(),
    extra: ["not"],
    failed: [],
    missing: [],
  });
});

test("Validator returns failed result when rule test fails.", () => {
  const validator = generateValidator();

  expect(validator.validate(generateInput({ name: 42 }))).toStrictEqual({
    success: false,
    data: {},
    extra: [],
    failed: ["name"],
    missing: [],
  });
});

test("Validator returns failed result when required data is missing.", () => {
  const validator = generateValidator();

  expect(validator.validate({})).toStrictEqual({
    success: false,
    data: {},
    extra: [],
    failed: [],
    missing: ["name"],
  });
});
