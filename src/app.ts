import express from "express";
import { getOrderHandler } from "./orders.js";
import { createSupportCaseHandler } from "./support.js";

export const app = express();

app.use(express.json());

app.get("/api/orders/:orderNumber", getOrderHandler);
app.post("/api/support/cases", createSupportCaseHandler);
