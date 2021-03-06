import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() object", () => {
  it("should validate object type", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "object"
        }
      }
    };

    const yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      items: {}
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: { a: "a" }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: "test123"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate nested object type", () => {
    let schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object",
          properties: {
            state: { type: "string" },
            postcode: { type: "string" }
          }
        }
      }
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      address: {
        state: "VIC",
        postcode: "3030"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: {
        state: "VIC",
        postcode: null
      }
    });
    expect(isValid).toBeFalsy();

    schm = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object",
          properties: {
            mailingAddress: {
              type: "object",
              properties: {
                state: { type: "string" },
                postcode: { type: "string" }
              }
            }
          }
        }
      }
    };

    yupschema = convertToYup(schm) as Yup.ObjectSchema;

    isValid = yupschema.isValidSync({
      address: {
        mailingAddress: {
          state: "VIC",
          postcode: "3030"
        }
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: {
        mailingAddress: {
          state: "VIC",
          postcode: null
        }
      }
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
        address: {
          type: ["object", "null"],
          properties: {
            state: { type: "string" }
          }
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      address: {
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: null
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate fields from definitions", () => {
    let schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        address: {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
        }
      },
      properties: {
        mailingAddress: {
          $ref: "#/definitions/address"
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: null
      }
    });
    expect(isValid).toBeFalsy();

    schm = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        mailingAddress: {
          $ref: "#/definitions/address"
        }
      }
    };
    expect(() => {
      convertToYup(schm);
    }).toThrowError("Type key is missing");
  });
});
