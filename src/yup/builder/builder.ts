import { JSONSchema7 } from "json-schema";
import Yup from "../addMethods/";
import { getProperties, isSchemaObject } from "../../schema/";
import { createValidationSchema } from "../schemas/schema";
import { getDefinition } from "./builder.definitions";
import { mergeConditions } from "./builder.conditions";
import { SchemaItem } from "../types";

/**
 * Recursive function that builds out object type schemas
 */

export const buildObject = (
  schema: {},
  [key, value]: SchemaItem
): {} | { [key: string]: Yup.ObjectSchema<object> } => {
  const objSchema = build(value);
  if (objSchema) {
    return {
      ...schema,
      [key]: objSchema
    };
  }
  return schema;
};

/**
 * Merges yup validation schema into the object
 */

export const buildValidation = (
  schema: {},
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): {} | { [key: string]: Yup.Lazy | Yup.MixedSchema<any> } => {
  const validationSchema = createValidationSchema([key, value], jsonSchema);
  if (validationSchema) {
    return {
      ...schema,
      [key]: validationSchema
    };
  }
  return schema;
};

/**
 * Iterates through a valid JSON Schema and generates yup field level
 * and object level schema
 */

export const build = (
  jsonSchema: JSONSchema7
): Yup.ObjectSchema<object> | undefined => {
  /** Conditions may have keys that do not exist in the properties schema,
   * This function will generate a object with only type attribute for later processing
   */
  jsonSchema = mergeConditions(jsonSchema);
  const properties = getProperties(jsonSchema);

  if (!properties) {
    return properties;
  }

  let schema = {};

  for (let [key, value] of Object.entries(properties)) {
    if (!isSchemaObject(value)) {
      continue;
    }
    /** if $ref found then retrieve the definition */
    const definition = getDefinition(value, jsonSchema);
    if (definition) {
      value = { ...definition };
    }

    const { properties, type } = value;

    // if item is object type call this function again
    if (type === "object" && properties) {
      schema = buildObject(schema, [key, value]);
    } else {
      schema = buildValidation(schema, [key, value], jsonSchema);
    }
  }
  return Yup.object().shape(schema);
};
