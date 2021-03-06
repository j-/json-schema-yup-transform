import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() string", () => {
  it("should validate string type", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      name: "test"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: null
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: ["string", "null"]
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      name: "test"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: null
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        }
      },
      required: ["name"]
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      name: "test"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({});
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("This is required");
  });

  it("should validate minimum character length", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          minLength: 6
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      name: "abcdef"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ name: "abcd" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ name: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "abcd" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("A minimum of 6 characters required");
  });

  it("should validate maximum character length", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          maxLength: 6
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      name: "abcdef"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ name: "abcdefgh" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ name: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "abcdefgh" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("A maximum of 6 characters required");
  });

  it("should validate pattern", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      name: "555-1212"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      name: "(888)555-1212"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ name: "(888)555-1212 ext. 532" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ name: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Incorrect format");
  });

  it("should validate constant", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          const: "test"
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      name: "test"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: "blah"
    });
    expect(isValid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Value does not match constant");
  });

  it("should validate enum", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          enum: ["test", "other"]
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      name: "test"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: "other"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: "blah"
    });
    expect(isValid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Value does not match enum");
  });

  it("should set default value", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          default: "test"
        }
      },
      required: ["name"]
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({});
    expect(isValid).toBeTruthy();

    let field = Yup.reach(yupschema, "name");
    // @ts-ignore
    expect(field._default).toBe("test");
  });
});
