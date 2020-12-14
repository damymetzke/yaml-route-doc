export default class Validator {
  validate(data: unknown): boolean {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key} => ${value}`);
    });

    return true;
  }
}
