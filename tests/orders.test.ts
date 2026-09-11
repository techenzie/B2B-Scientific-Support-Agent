import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("GET /api/orders/:orderNumber", () => {
  it("returns Processing status when nothing has shipped", async () => {
    const res = await request(app).get("/api/orders/SO-10481");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Processing");
    expect(res.body.items.every((item: any) => item.shipmentStatus === "NOT_SHIPPED")).toBe(true);
  });

  it("returns Partially Shipped status with a partially shipped line item", async () => {
    const res = await request(app).get("/api/orders/SO-10482");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Partially Shipped");

    const buffer = res.body.items.find((item: any) => item.productCode === "REA-2201");
    expect(buffer.quantityOrdered).toBe(4);
    expect(buffer.quantityShipped).toBe(2);
    expect(buffer.shipmentStatus).toBe("PARTIALLY_SHIPPED");
    expect(buffer.carrier).toBe("FreightLine Logistics");
    expect(buffer.trackingNumber).toBeDefined();
    expect(buffer.expectedDeliveryDate).toBeDefined();

    const rotor = res.body.items.find((item: any) => item.productCode === "INS-3390");
    expect(rotor.shipmentStatus).toBe("NOT_SHIPPED");
  });

  it("returns Shipped Complete status when all quantities have shipped", async () => {
    const res = await request(app).get("/api/orders/SO-10483");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Shipped Complete");
    expect(res.body.items.every((item: any) => item.shipmentStatus === "SHIPPED")).toBe(true);
  });

  it("returns a 404 with a structured error for an unknown order number", async () => {
    const res = await request(app).get("/api/orders/SO-99999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "ORDER_NOT_FOUND",
      message: "No order was found for the supplied order number.",
    });
  });
});
