export interface AddressDistrict {
  id: string | number | null | undefined;
  attributes: {
    name?: string;
    parent_id: number;
    carrierCodes?: any;
    aliases?: string;
  };
}

export interface AddressProvince {
  id: string | number | null | undefined;
  attributes: {
    name?: string;
    parent_id: number;
    carrierCodes?: any;
    aliases?: string;
  };
}

export interface AddressWard {
  id: string | number | null | undefined;
  attributes: {
    name?: string;
    parent_id: number;
    carrierCodes?: any;
    aliases?: string;
  };
}

export interface Country {
  country?: string;
}

export interface OmsInbound {
  id: number;
  Item: SharedItem[];
  code?: string;
  users_permissions_user?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  status?:
    | `draft`
    | `waiting_for_items`
    | `waiting_for_confirm`
    | `waiting_for_supplementation`
    | `done_partially`
    | `done`
    | `denied`
    | `cancelled`;
  pickupMethod?: `byShipper` | `byWarehouse`;
  expectedPickupDate?: Date;
  expectedInboundDate?: Date;
  note?: string;
  organization?:
    | any
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  internalRef?: string;
}

export interface OmsInboundHistory {
  status?:
    | `draft`
    | `waiting_for_confirm`
    | `waiting_for_items`
    | `waiting_for_supplementation`
    | `done_partially`
    | `done`
    | `denied`
    | `cancelled`;
  note?: any;
  oms_inbound?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
}

export interface OmsOutbound {
  system_item_master: any;
  id: number;
  code: string;
  users_permissions_user?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  status:
    | `new`
    | `pending`
    | `processing`
    | `picking`
    | `picked`
    | `ready_to_ship`
    | `completed`
    | `shipped`
    | `cancelled`
    | `delivered`
    | `returned`;
  note?: string;
  oms_user?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  type?: `ecom` | `b2b` | `transfer`;
  shippingDate?: Date;
  priority?: `REGULAR` | `HIGH` | `URGENT`;
  inspect?: `VIEW_ONLY` | `ALLOW_TO_TRY` | `NOT_ALLOWED`;
  codAmount?: number;
  organization?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  shippingFee?: number;
  deliveryTime?: Date;
  completeTime?: Date;
  cancelReason?: string;
  system_carrier?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  items?: SharedOrderItem[];
  marketplace?: string;
  marketplace_order_number?: string;
  marketplace_status?: string;
  isShippingLabelPrinted?: boolean;
  log?: any;
  documents?: any;
  orderItems: SharedItem[];
  wh_load_type_trackings?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
}

export interface OmsOutboundHistory {
  status?:
    | `processing`
    | `ready_to_ship`
    | `delivering`
    | `shipped`
    | `returned`;
  oms_outbound?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  note?: any;
}

export interface OmsUser {
  id: string | number;
  attributes: {
    contact?: SharedAddressBox;
    phone?: string;
    name?: string;
    users_permissions_user?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
  };
}

export interface Organization {
  id: string;
  attributes: {
    name?: string;
    taxcode: string;
    address?: string;
    legalRep?: string;
    phone?: string;
    address_province?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    address_district?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    address_ward?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    system_stores?:
      | number[]
      | { set: number[] | { id: number }[] }
      | {
          disconnect?: number[] | { id: number }[];
          connect?:
            | number[]
            | {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }[];
        };
  };
}

export interface SharedAddressBox {
  __component?: "shared.address-box";
  address_province?:
    | any
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address_district?:
    | any
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address_ward?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address: string;
}

export interface SharedCapacity {
  __component?: "shared.capacity";
  width: number;
  height: number;
  depth: number;
  maxWeight: number;
}

export interface SharedItem {
  lot: string;
  __component?: "shared.item";
  system_item_master?:
    | any
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  qty: number;
  received?: number;
  rejected?: number;
  discount?: number;
  picked?: number;
}

export interface SharedOrderItem {
  __component?: "shared.order-item";
  system_inventories?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
  qty?: number;
}

export interface SharedShops {
  __component?: "shared.shops";
  shopee?: string;
  lazada?: string;
  tiki?: string;
  woocommerce?: string;
  webstore?: string;
}

export interface SystemCarrier {
  name?: string;
  channelId?: number;
  priority?: number;
  limit?: any;
  parentChannelId?: number;
  logo?: number;
}

export interface SystemCarrierTrackingHistory {
  packageNumber?: string;
  trackingNumber?: string;
  trackingInfo?: any;
}

export interface SystemInventory {
  id: number;
  reservedQty?: number;
  availableQty?: number;
  handlingMethod?: string;
  lot?: string;
  mfg?: Date;
  exp?: Date;
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  system_item_master?:
    | any
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  organization?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  properties?: any;
  serialNo?: string;
  damagedQty?: number;
  quarantineQty?: number;
  wh_load_type_trackings?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
  system_transactions?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
}

export interface WMSLog {
  id: number | string;
  attributes: {
    transaction: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    user: number;
    status: string;
    videoUrl: string;
    history: {
      status: "success" | "error" | "failed" | "downloaded";
      message: string;
    }[];
    action?: "download" | "preview";
  };
}
export interface SHOrder {
  id: number | string;
  attributes: {
    orderNumber: string;
    trackingNumber: string;
    fulfillment_status: string;
    cancelled_status: string;
    cancelled_at: string;
    fulfillments: FulfillmentOrder;
  };
}

export interface SystemItemCategory {
  name?: string;
  system_item_masters?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
}

export interface SystemItemMaster {
  id: number | string;
  attributes: {
    name: string;
    description?: string;
    isLotSerialControl?: boolean;
    bestBeforeMandatory?: boolean;
    users_permissions_user?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    shipAlone?: boolean;
    shipAsIs?: boolean;
    stackable?: boolean;
    sku: string;
    height?: number;
    length?: number;
    depth?: number;
    system_inventories?:
      | number[]
      | { set: number[] | { id: number }[] }
      | {
          disconnect?: number[] | { id: number }[];
          connect?:
            | number[]
            | {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }[];
        };
    images?: string;
    reStockLevel?: number;
    isFragile?: boolean;
    trackingMethod: `LIFO` | `FIFO` | `FEFO` | `DEFAULT`;
    expWarningDays?: number;
    price?: number;
    storageTemp?: number;
    weight?: number;
    innerPackW?: number;
    innerPackH?: number;
    innerPackL?: number;
    innerPackWeight?: number;
    masterW?: number;
    masterWeight?: number;
    masterH?: number;
    masterL?: number;
    palletW?: number;
    palletH?: number;
    palletL?: number;
    palletWeight?: number;
    system_item_master?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    system_item_category?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    barcode?: string;
    organization?:
      | number
      | { set: [number] | [{ id: number }] }
      | {
          disconnect?: [number] | [{ id: number }];
          connect?:
            | [number]
            | [
                {
                  id: number;
                  position?: {
                    before?: number;
                    after?: number;
                    start?: boolean;
                    end?: boolean;
                  };
                }
              ];
        };
    bundle?: SharedItem[];
    isBundle?: boolean;
    isAlias?: boolean;
  };
}

export interface SystemPickingList {
  oms_outbounds?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
  users_permissions_user?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  isBulk?: boolean;
  status?: `open` | `processing` | `done`;
}

export interface SystemStore {
  storeId?: string;
  organization?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  saleChannel?: `tiktok` | `shopee` | `lazada` | `tiki` | `sendo` | `webstore`;
}

export interface SystemTransaction {
  type: string;
  qty?: number;
  ref?: string;
  system_inventory?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
}

export interface UnitLoadType {
  name: string;
  ref?: string;
  image?: number;
  attributes?: any;
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  loadTypeId: string;
  isLocked?: boolean;
  TYPE: `TRANSFERRING` | `STORAGE` | `PICKING` | `PACKING` | `SHIPPING`;
  allocation?: number;
  Dimention?: SharedCapacity;
  color?: string;
}

export interface Warehouse {
  name: string;
  users_permissions_user?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address: string;
  lat?: number;
  long?: number;
  is_active?: boolean;
  warehouse_type?: `FULFILLMENT` | `GENERAL`;
  address_province:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address_district:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  address_ward:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  contactName: string;
  contactPhone: string;
  wh_zones?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
  wh_options?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
}

export interface WhBinLocation {
  name: string;
  locked?: boolean;
  wh_row?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
}

export interface WhLoadTypeTracking {
  qty: number;
  wh_bin_location?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  wh_unit_load_type?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  system_inventory?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  oms_outbound?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
}

export interface WhOption {
  entityType: `zone` | `row` | `bay` | `level` | `bin` | `unitLoad`;
  entityId: number;
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  optionKeyId?: string;
  optionKeyValue: any;
}

export interface WhOptionKey {
  optionKey: string;
}

export interface WhRow {
  name: string;
  note?: string;
  wh_zone?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  wh_bin_locations?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
  attributes?: any;
}

export interface WhZone {
  name: string;
  note?: string;
  warehouse?:
    | number
    | { set: [number] | [{ id: number }] }
    | {
        disconnect?: [number] | [{ id: number }];
        connect?:
          | [number]
          | [
              {
                id: number;
                position?: {
                  before?: number;
                  after?: number;
                  start?: boolean;
                  end?: boolean;
                };
              }
            ];
      };
  attributes?: any;
  wh_rows?:
    | number[]
    | { set: number[] | { id: number }[] }
    | {
        disconnect?: number[] | { id: number }[];
        connect?:
          | number[]
          | {
              id: number;
              position?: {
                before?: number;
                after?: number;
                start?: boolean;
                end?: boolean;
              };
            }[];
      };
}

export interface WmsLog {
  transaction: string;
  type?: string;
  user?: number;
  status?: string;
}

export type FulfillmentOrder = {
  line_items: HaravanLineItem[];
};

export type HaravanLineItem = {
  quantity: number;
  sku: string;
  barcode: string;
  name: string;
  image: {
    src: {
      src: string;
    };
  };
};
