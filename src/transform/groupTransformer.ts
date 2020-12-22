import Transformer from "./transformer";
import {
  testType,
  testMarkdown,
  testList,
  testChildWithTransformer,
} from "../util/transform";

function generateVariableTransformer(): Transformer {
  const result = new Transformer();

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

export default function generateGroupTransformer(): Transformer {
  const result = new Transformer();

  const variableTransformer = generateVariableTransformer();

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
    test: testChildWithTransformer(variableTransformer),
  });

  return result;
}
