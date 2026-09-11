import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

const validCase = {
  customerName: "Alex Morgan",
  contactEmail: "alex.morgan@example.com",
  productName: "AtlasReader X200",
  serialNumber: "ARX200-78431",
  errorCode: "E417",
  issueDescription: "Instrument displays E417 when starting an assay.",
  troubleshootingAttempted: ["Restarted the instrument", "Reinserted the assay plate"],
};

describe("POST /api/support/cases", () => {
  it("creates a case and returns a generated CASE-xxxx number", async () => {
    const res = await request(app).post("/api/support/cases").send(validCase);

    expect(res.status).toBe(201);
    expect(res.body.caseNumber).toMatch(/^CASE-\d+$/);
    expect(res.body.status).toBe("OPEN");
    expect(res.body.message).toBe("Technical support case created successfully.");
    expect(res.body.createdAt).toBeDefined();
  });

  it("accepts a request without the optional errorCode and troubleshootingAttempted fields", async () => {
    const { errorCode, troubleshootingAttempted, ...minimalCase } = validCase;
    const res = await request(app).post("/api/support/cases").send(minimalCase);

    expect(res.status).toBe(201);
    expect(res.body.caseNumber).toMatch(/^CASE-\d+$/);
  });

  it("returns 400 when a required field is missing", async () => {
    const { serialNumber, ...incompleteCase } = validCase;
    const res = await request(app).post("/api/support/cases").send(incompleteCase);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "INVALID_REQUEST",
      message: "Missing required field: serialNumber",
    });
  });

  it("returns 400 when errorCode is not a string", async () => {
    const res = await request(app)
      .post("/api/support/cases")
      .send({ ...validCase, errorCode: 417 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "INVALID_REQUEST",
      message: "Invalid field: errorCode must be a string.",
    });
  });

  it("issues different sequential case numbers for two successful requests", async () => {
    const first = await request(app).post("/api/support/cases").send(validCase);
    const second = await request(app).post("/api/support/cases").send(validCase);

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(first.body.caseNumber).not.toBe(second.body.caseNumber);

    const firstNumber = parseInt(first.body.caseNumber.split("-")[1], 10);
    const secondNumber = parseInt(second.body.caseNumber.split("-")[1], 10);
    expect(secondNumber).toBe(firstNumber + 1);
  });
});
