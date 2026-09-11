import type { Request, Response } from "express";
import { orders, type RawOrderItem } from "./orders.data.js";

export type ShipmentStatus = "NOT_SHIPPED" | "PARTIALLY_SHIPPED" | "SHIPPED";
export type OrderStatus = "Processing" | "Partially Shipped" | "Shipped Complete";

export interface OrderItem extends RawOrderItem {
  shipmentStatus: ShipmentStatus;
}

export interface Order {
  orderNumber: string;
  status: OrderStatus;
  orderDate: string;
  items: OrderItem[];
}

function deriveItemShipmentStatus(item: RawOrderItem): ShipmentStatus {
  if (item.quantityShipped <= 0) return "NOT_SHIPPED";
  if (item.quantityShipped >= item.quantityOrdered) return "SHIPPED";
  return "PARTIALLY_SHIPPED";
}

function deriveOrderStatus(items: OrderItem[]): OrderStatus {
  if (items.every((item) => item.shipmentStatus === "NOT_SHIPPED")) {
    return "Processing";
  }
  if (items.every((item) => item.shipmentStatus === "SHIPPED")) {
    return "Shipped Complete";
  }
  return "Partially Shipped";
}

export function findOrder(orderNumber: string): Order | undefined {
  const rawOrder = orders[orderNumber];
  if (!rawOrder) return undefined;

  const items: OrderItem[] = rawOrder.items.map((item) => ({
    ...item,
    shipmentStatus: deriveItemShipmentStatus(item),
  }));

  return {
    orderNumber: rawOrder.orderNumber,
    orderDate: rawOrder.orderDate,
    items,
    status: deriveOrderStatus(items),
  };
}

export function getOrderHandler(req: Request, res: Response): void {
  const order = findOrder(req.params.orderNumber);

  if (!order) {
    res.status(404).json({
      error: "ORDER_NOT_FOUND",
      message: "No order was found for the supplied order number.",
    });
    return;
  }

  res.status(200).json(order);
}
