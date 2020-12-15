import Validator from "./validator";

function generateParameterValidator(): Validator {
  const result = new Validator();

  result.registerRule({
    key: "key",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "description",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "type",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "restrictions",
    required: false,
    test: (data) => typeof data === "string",
  });

  return result;
}

function generateMethodValidator(): Validator {
  const result = new Validator();

  const parameterValidator = generateParameterValidator();

  result.registerRule({
    key: "verb",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "description",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "auth",
    required: false,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "role",
    required: false,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "responseType",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "requestType",
    required: false,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "responseData",
    required: false,
    test: (data) => {
      if (!Array.isArray(data)) {
        return false;
      }

      return data.every(
        (parameter) => parameterValidator.validate(parameter).success
      );
    },
  });

  result.registerRule({
    key: "requestData",
    required: false,
    test: (data) => {
      if (!Array.isArray(data)) {
        return false;
      }

      return data.every(
        (parameter) => parameterValidator.validate(parameter).success
      );
    },
  });

  return result;
}

export default function generateRouteValidator(): Validator {
  const result = new Validator();

  const methodValidator = generateMethodValidator();

  result.registerRule({
    key: "name",
    required: true,
    test: (data) => typeof data === "string",
  });

  result.registerRule({
    key: "method",
    required: true,
    test: (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        return false;
      }

      return data.every((method) => methodValidator.validate(method).success);
    },
  });

  return result;
}
