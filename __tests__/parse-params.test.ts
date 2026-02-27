import { describe, it, expect } from "vitest";
import { parseInputsFromParams } from "@/lib/parse-params";
import { DEFAULT_INPUTS } from "@/lib/constants";

describe("parseInputsFromParams()", () => {
  it("returns defaults for empty query string", () => {
    expect(parseInputsFromParams("")).toEqual(DEFAULT_INPUTS);
  });

  it("returns defaults for query with no recognized params", () => {
    expect(parseInputsFromParams("?foo=bar&baz=123")).toEqual(DEFAULT_INPUTS);
  });

  it("parses all 8 valid params", () => {
    const qs = "?rooms=200&age=7&lpw=20&weeks=35&students=15000&tuition=22000&salary=100000&fte=8";
    const result = parseInputsFromParams(qs);
    expect(result.rooms).toBe(200);
    expect(result.equipmentAge).toBe("7");
    expect(result.lecturesPerWeek).toBe(20);
    expect(result.teachWeeks).toBe(35);
    expect(result.students).toBe(15000);
    expect(result.tuition).toBe(22000);
    expect(result.itSalary).toBe(100000);
    expect(result.currentFTE).toBe(8);
  });

  it("rejects rooms below minimum (1)", () => {
    expect(parseInputsFromParams("?rooms=0").rooms).toBe(DEFAULT_INPUTS.rooms);
    expect(parseInputsFromParams("?rooms=-5").rooms).toBe(DEFAULT_INPUTS.rooms);
  });

  it("rejects rooms above maximum (5000)", () => {
    expect(parseInputsFromParams("?rooms=9999").rooms).toBe(DEFAULT_INPUTS.rooms);
  });

  it("accepts boundary room values", () => {
    expect(parseInputsFromParams("?rooms=1").rooms).toBe(1);
    expect(parseInputsFromParams("?rooms=5000").rooms).toBe(5000);
  });

  it("rejects invalid equipment age values", () => {
    expect(parseInputsFromParams("?age=4").equipmentAge).toBe(DEFAULT_INPUTS.equipmentAge);
    expect(parseInputsFromParams("?age=abc").equipmentAge).toBe(DEFAULT_INPUTS.equipmentAge);
    expect(parseInputsFromParams("?age=0").equipmentAge).toBe(DEFAULT_INPUTS.equipmentAge);
  });

  it("accepts all valid equipment ages", () => {
    expect(parseInputsFromParams("?age=3").equipmentAge).toBe("3");
    expect(parseInputsFromParams("?age=5").equipmentAge).toBe("5");
    expect(parseInputsFromParams("?age=7").equipmentAge).toBe("7");
    expect(parseInputsFromParams("?age=10").equipmentAge).toBe("10");
  });

  it("rejects teach weeks below minimum (20)", () => {
    expect(parseInputsFromParams("?weeks=19").teachWeeks).toBe(DEFAULT_INPUTS.teachWeeks);
  });

  it("rejects teach weeks above maximum (52)", () => {
    expect(parseInputsFromParams("?weeks=53").teachWeeks).toBe(DEFAULT_INPUTS.teachWeeks);
  });

  it("rejects non-numeric values gracefully", () => {
    const result = parseInputsFromParams("?rooms=abc&students=xyz&fte=NaN");
    expect(result.rooms).toBe(DEFAULT_INPUTS.rooms);
    expect(result.students).toBe(DEFAULT_INPUTS.students);
    expect(result.currentFTE).toBe(DEFAULT_INPUTS.currentFTE);
  });

  it("handles partial params — only overrides what is provided", () => {
    const result = parseInputsFromParams("?rooms=150&fte=4");
    expect(result.rooms).toBe(150);
    expect(result.currentFTE).toBe(4);
    // Everything else stays default
    expect(result.equipmentAge).toBe(DEFAULT_INPUTS.equipmentAge);
    expect(result.lecturesPerWeek).toBe(DEFAULT_INPUTS.lecturesPerWeek);
    expect(result.students).toBe(DEFAULT_INPUTS.students);
    expect(result.tuition).toBe(DEFAULT_INPUTS.tuition);
    expect(result.itSalary).toBe(DEFAULT_INPUTS.itSalary);
    expect(result.teachWeeks).toBe(DEFAULT_INPUTS.teachWeeks);
  });
});
