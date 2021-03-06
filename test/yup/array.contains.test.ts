import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array contains", () => {
  it("should validate strings", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "string"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["a", 1, {}]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["1"]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [1, null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [[], false]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [{}, 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [{}, 1] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe(
      "At least one item of this array must be of string type"
    );
  });

  it("should validate numbers", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "number"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, null]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [null, false]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [null, false] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe(
      "At least one item of this array must be of number type"
    );
  });

  it("should validate integers", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "integer"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, 2.36, 50.0]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [null, false]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [3.56, "a"]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [3.56, "a"] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe(
      "At least one item of this array must be of integer type"
    );
  });

  it("should validate booleans", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "boolean"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [true]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["A", null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [[], 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [[], 1] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe(
      "At least one item of this array must be of boolean type"
    );
  });

  it("should validate objects", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "object"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [{}]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [{ s: "1" }, null]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: ["a", 1] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe(
      "At least one item of this array must be of object type"
    );
  });

  it("should validate array", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "array"
          }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [[]]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [["a"], null]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: ["a", 1] });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("At least one item of this array must be of array type");
  });
});
