import { eventSchema } from "../event.schema";
import { mockEventsSimple, mockEventsDumb } from "./event.mocks";

const errString = "should not succeed because ";

describe("Create event validation simple cases", () => {
  it("should return success true", () => {
    expect(eventSchema.safeParse(mockEventsSimple.full).success).toBeTruthy();
  });

  it(errString + "no title", () => {
    expect(eventSchema.safeParse(mockEventsSimple.noTitle).success).toBeFalsy();
  });

  it(errString + "no description", () => {
    expect(eventSchema.safeParse(mockEventsSimple.noDescription).success).toBeFalsy();
  });

  it(errString + "no date", () => {
    expect(eventSchema.safeParse(mockEventsSimple.noDate).success).toBeFalsy();
  });

  it(errString + "no address", () => {
    expect(eventSchema.safeParse(mockEventsSimple.noAddress).success).toBeFalsy();
  });
});

describe("Create event validation dumb cases", () => {
  it(errString + "title too short", () => {
    expect(eventSchema.safeParse(mockEventsDumb.titleToShort).success).toBeFalsy();
  });

  it(errString + "title too long", () => {
    expect(eventSchema.safeParse(mockEventsDumb.titleToLong).success).toBeFalsy();
  });

  it(errString + "description too short", () => {
    expect(eventSchema.safeParse(mockEventsDumb.descriptionToShort).success).toBeFalsy();
  });

  it(errString + "description too long", () => {
    expect(eventSchema.safeParse(mockEventsDumb.descriptionToLong).success).toBeFalsy();
  });

  it(errString + "address too short", () => {
    expect(eventSchema.safeParse(mockEventsDumb.addressToShort).success).toBeFalsy();
  });

  it(errString + "address too long", () => {
    expect(eventSchema.safeParse(mockEventsDumb.addressToLong).success).toBeFalsy();
  });
});
