import Transformer from "../../src/transform/transformer";
import { succesfulDataTransformResult } from "../../src/util/transformResult";

function generateInput(
  extra: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
  return {
    name: "name",
    ...extra,
  };
}

function generateTransformer(): Transformer {
  const result = new Transformer();
  result.registerRule({
    key: "name",
    required: true,
    test: (data) =>
      typeof data !== "string"
        ? "Type is not string"
        : succesfulDataTransformResult({ "": data }),
  });
  return result;
}

test("Transformer will return succesful result with valid data.", () => {
  const transformer = generateTransformer();

  expect(transformer.transform(generateInput())).toStrictEqual({
    success: true,
    data: generateInput(),
    extra: [],
    failed: [],
    missing: [],
    messages: [],
  });
});

test("Transformer will return failed result with non-object or null as input.", () => {
  const transformer = generateTransformer();

  expect(transformer.transform(null)).toStrictEqual({
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
  });
  expect(transformer.transform(42)).toStrictEqual({
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
  });
  expect(transformer.transform(false)).toStrictEqual({
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
  });
  expect(transformer.transform("Hello World!")).toStrictEqual({
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
  });
  expect(transformer.transform(() => {})).toStrictEqual({
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
  });
});

test("Transformer will return failed result when too much input data is provided.", () => {
  const transformer = generateTransformer();

  expect(
    transformer.transform(generateInput({ not: "required" }))
  ).toStrictEqual({
    success: false,
    data: generateInput(),
    extra: ["not"],
    failed: [],
    missing: [],
    messages: [
      {
        key: "not",
        problem: "key is not recognized by validator",
      },
    ],
  });
});

test("Transformer returns failed result when rule test fails.", () => {
  const transformer = generateTransformer();

  expect(transformer.transform(generateInput({ name: 42 }))).toStrictEqual({
    success: false,
    data: {},
    extra: [],
    failed: ["name"],
    missing: [],
    messages: [
      {
        key: "name",
        problem: "Type is not string",
      },
    ],
  });
});

test("Transformer returns failed result when required data is missing.", () => {
  const transformer = generateTransformer();

  expect(transformer.transform({})).toStrictEqual({
    success: false,
    data: {},
    extra: [],
    failed: [],
    missing: ["name"],
    messages: [
      {
        key: "name",
        problem: "key is required",
      },
    ],
  });
});
