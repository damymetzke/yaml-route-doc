import Validator from "./validator";
import {
  testType,
  testMarkdown,
  testList,
  testChildWithValidator,
} from "../util/validate";

function generateVariableValidator(): Validator {
  const result = new Validator();

  result.registerRule({
    key: "responseType",
    required: false,
    test: testList(/^[a-zA-Z0-9/\-.+]*$/),
  });

  result.registerRule({
    key: "requestType",
    required: false,
    test: testList(/^[a-zA-Z0-9/\-.+]*$/),
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

  return result;
}

export default function generateGroupValidator(): Validator {
  const result = new Validator();

  const variableValidator = generateVariableValidator();

  result.registerRule({
    key: "name",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "description",
    required: true,
    test: testMarkdown(),
  });

  result.registerRule({
    key: "variables",
    required: false,
    test: testChildWithValidator(variableValidator),
  });

  return result;
}
