export interface RawOrderItem {
  productCode: string;
  productName: string;
  quantityOrdered: number;
  quantityShipped: number;
  carrier?: string;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
}

export interface RawOrder {
  orderNumber: string;
  orderDate: string;
  items: RawOrderItem[];
}

// Synthetic B2B order data
export const orders: Record<string, RawOrder> = {
  "SO-10481": {
    orderNumber: "SO-10481",
    orderDate: "2026-08-28",
    items: [
      {
        productCode: "REA-2205",
        productName: "Sterile Petri Dishes, Pack of 100",
        quantityOrdered: 10,
        quantityShipped: 0,
      },
      {
        productCode: "INS-3391",
        productName: "Precision pH Meter",
        quantityOrdered: 1,
        quantityShipped: 0,
      },
    ],
  },

  "SO-10482": {
    orderNumber: "SO-10482",
    orderDate: "2026-08-25",
    items: [
      {
        productCode: "REA-2201",
        productName: "BioPure Buffer Solution, 5L",
        quantityOrdered: 4,
        quantityShipped: 2,
        carrier: "FreightLine Logistics",
        trackingNumber: "FL48213590",
        expectedDeliveryDate: "2026-09-05",
      },
      {
        productCode: "INS-3390",
        productName: "MicroSpin Centrifuge Rotor",
        quantityOrdered: 2,
        quantityShipped: 0,
      },
    ],
  },

  "SO-10483": {
    orderNumber: "SO-10483",
    orderDate: "2026-08-15",
    items: [
      {
        productCode: "REA-2210",
        productName: "Analytical Grade Ethanol, 4L",
        quantityOrdered: 6,
        quantityShipped: 6,
        carrier: "Continental Freight Co.",
        trackingNumber: "CFC9834217",
        expectedDeliveryDate: "2026-08-22",
      },
      {
        productCode: "CON-1150",
        productName: "Nitrile Gloves, Size M (Case)",
        quantityOrdered: 3,
        quantityShipped: 3,
        carrier: "Continental Freight Co.",
        trackingNumber: "CFC9834217",
        expectedDeliveryDate: "2026-08-22",
      },
    ],
  },

  "SO-10484": {
    orderNumber: "SO-10484",
    orderDate: "2026-08-20",
    items: [
      {
        productCode: "INS-3400",
        productName: "Benchtop Vortex Mixer",
        quantityOrdered: 2,
        quantityShipped: 2,
        carrier: "FreightLine Logistics",
        trackingNumber: "FL55021847",
        expectedDeliveryDate: "2026-08-29",
      },
      {
        productCode: "REA-2230",
        productName: "Tris-EDTA Buffer Concentrate, 1L",
        quantityOrdered: 8,
        quantityShipped: 8,
        carrier: "Continental Freight Co.",
        trackingNumber: "CFC9841193",
        expectedDeliveryDate: "2026-08-30",
      },
      {
        productCode: "CON-1175",
        productName: "Filter Tips, 200uL (Rack of 96)",
        quantityOrdered: 10,
        quantityShipped: 4,
        carrier: "FreightLine Logistics",
        trackingNumber: "FL55029301",
        expectedDeliveryDate: "2026-09-06",
      },
      {
        productCode: "INS-3410",
        productName: "Digital Analytical Balance",
        quantityOrdered: 1,
        quantityShipped: 0,
      },
    ],
  },
};
