import Validator from "./validator";
import {
  testType,
  testMarkdown,
  testList,
  testChildrenWithValidator,
} from "../util/validate";

function generateParameterValidator(): Validator {
  const result = new Validator();

  result.registerRule({
    key: "key",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testMarkdown(),
  });

  result.registerRule({
    key: "type",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "restrictions",
    required: false,
    test: testType("string"),
  });

  return result;
}

function generateMethodValidator(): Validator {
  const result = new Validator();

  const parameterValidator = generateParameterValidator();

  result.registerRule({
    key: "verb",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testMarkdown(),
  });

  result.registerRule({
    key: "auth",
    required: false,
    test: testList(/^[a-zA-Z0-9]*$/),
  });

  result.registerRule({
    key: "role",
    required: false,
    test: testList(/^[a-zA-Z0-9]*$/),
  });

  result.registerRule({
    key: "responseType",
    required: true,
    test: testList(/^[a-zA-Z0-9/\-.+]*$/),
  });

  result.registerRule({
    key: "requestType",
    required: false,
    test: testList(/^[a-zA-Z0-9/\-.+]*$/),
  });

  result.registerRule({
    key: "responseData",
    required: false,
    test: testChildrenWithValidator(parameterValidator),
  });

  result.registerRule({
    key: "requestData",
    required: false,
    test: testChildrenWithValidator(parameterValidator),
  });

  return result;
}

export default function generateRouteValidator(): Validator {
  const result = new Validator();

  const methodValidator = generateMethodValidator();

  result.registerRule({
    key: "name",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "method",
    required: true,
    test: testChildrenWithValidator(methodValidator),
  });

  return result;
}
