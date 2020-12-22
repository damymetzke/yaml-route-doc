import Transformer from "./transformer";
import {
  testType,
  testMarkdown,
  testList,
  testChildrenWithTransformer,
} from "../util/transform";

function generateParameterTransformer(): Transformer {
  const result = new Transformer();

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

function generateMethodTransformer(): Transformer {
  const result = new Transformer();

  const parameterTransformer = generateParameterTransformer();

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
    test: testChildrenWithTransformer(parameterTransformer),
  });

  result.registerRule({
    key: "requestData",
    required: false,
    test: testChildrenWithTransformer(parameterTransformer),
  });

  return result;
}

export default function generateRouteTransformer(): Transformer {
  const result = new Transformer();

  const methodTransformer = generateMethodTransformer();

  result.registerRule({
    key: "name",
    required: true,
    test: testType("string"),
  });

  result.registerRule({
    key: "method",
    required: true,
    test: testChildrenWithTransformer(methodTransformer),
  });

  return result;
}
