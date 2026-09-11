import type { Request, Response } from "express";

export interface SupportCaseRequest {
  customerName: string;
  contactEmail: string;
  productName: string;
  serialNumber: string;
  issueDescription: string;
  errorCode?: string;
  troubleshootingAttempted?: string[];
}

const REQUIRED_FIELDS: Array<keyof SupportCaseRequest> = [
  "customerName",
  "contactEmail",
  "productName",
  "serialNumber",
  "issueDescription",
];

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSupportCaseRequest(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "Request body must be a JSON object.";
  }

  const record = body as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (!isNonBlankString(record[field])) {
      return `Missing required field: ${field}`;
    }
  }

  if ("errorCode" in record && record.errorCode !== undefined && typeof record.errorCode !== "string") {
    return "Invalid field: errorCode must be a string.";
  }

  if ("troubleshootingAttempted" in record && record.troubleshootingAttempted !== undefined) {
    const attempts = record.troubleshootingAttempted;
    const isStringArray = Array.isArray(attempts) && attempts.every((entry) => typeof entry === "string");
    if (!isStringArray) {
      return "Invalid field: troubleshootingAttempted must be an array of strings.";
    }
  }

  return null;
}

let nextCaseNumber = 2001;

export function createSupportCaseHandler(req: Request, res: Response): void {
  const validationError = validateSupportCaseRequest(req.body);

  if (validationError) {
    res.status(400).json({
      error: "INVALID_REQUEST",
      message: validationError,
    });
    return;
  }

  const caseNumber = `CASE-${nextCaseNumber}`;
  nextCaseNumber += 1;

  res.status(201).json({
    caseNumber,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    message: "Technical support case created successfully.",
  });
}
