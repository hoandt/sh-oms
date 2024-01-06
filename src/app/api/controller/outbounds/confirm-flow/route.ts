import { NextResponse, NextRequest } from "next/server";
import {  updateOutbound } from "@/app/api/services/outbounds";
import { getInventory, updateInventory } from "@/app/api/services/inventories";
import { SystemInventory } from "@/types/todo";
import { sortArrayByExp } from "@/lib/helpers";

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const token = true;
        if (token) {
          const responseData = await req.json();
          const outbounds = responseData.payload.outbounds;
    
          for (const outbound of outbounds || []) {
            const items: unknown[] = [];
    
            for (const order of outbound.orderItems || []) {
              const qtyOrder = order.qty;
              const id = order.system_item_master.data.id;
    
              const inventories = await getInventory({
                options: {
                  filters: {
                    system_item_master: {
                      id: {
                        $eq: id
                      }
                    }
                  }
                }
              });
    
              const availableQty = inventories?.data.reduce(
                (accumulator: any, currentValue: any) =>
                  accumulator + currentValue.attributes.availableQty,
                0
              );
    
              if (inventories?.data.length === 0) {
                updateOutbound({
                  id: outbound.id,
                  outbounds: {
                    status: "pending",
                    note: "Not found inventory",
                    log: {},
                    documents: {}
                  }
                });
                return;
              } else {
                if (qtyOrder > availableQty) {
                  updateOutbound({
                    id: outbound.id,
                    outbounds: {
                      status: "pending",
                      note: "Not enough stock",
                      log: {},
                      documents: {}
                    }
                  });
                  return;
                }
              }
    
              if (inventories?.data.length) {
                let qtyOrderManual = order.qty;
                sortArrayByExp(inventories?.data)?.forEach((e) => {
                  if (qtyOrderManual < (e.attributes.availableQty || 0)) {
                    return items.push({
                      system_inventories: e.id,
                      qty: qtyOrderManual
                    });
                  }
                  if (
                    qtyOrderManual > (e.attributes.availableQty || 0) &&
                    qtyOrderManual !== 0
                  ) {
                    items.push({
                      system_inventories: e.id,
                      qty: e.attributes.availableQty
                    });
                    qtyOrderManual =
                      qtyOrderManual - (e.attributes.availableQty || 0);
                  }
                });
    
                let qtyInventoryManual = order.qty;
                for (const inventory of inventories?.data) {
                  let inventoryPayload = {};
                  if (!inventory.attributes.availableQty) {
                    continue;
                  }
                  if (qtyInventoryManual < inventory.attributes.availableQty) {
                    inventoryPayload = {
                      availableQty:
                        inventory.attributes.availableQty - qtyInventoryManual,
                      reservedQty:
                        inventory.attributes.reservedQty + qtyInventoryManual,
                      properties: updateProperties(
                        inventory.attributes.properties,
                        {
                          id: outbound.id,
                          qty: qtyInventoryManual
                        }
                      )
                    };
                    qtyInventoryManual = 0;
                  } else {
                    inventoryPayload = {
                      availableQty: 0,
                      reservedQty:
                        (inventory.attributes.reservedQty || 0) +
                        inventory.attributes.availableQty,
                      properties: updateProperties(
                        inventory.attributes.properties,
                        {
                          id: outbound.id,
                          qty: inventory.attributes.availableQty
                        }
                      )
                    };
                    qtyInventoryManual =
                      qtyInventoryManual - inventory.attributes.availableQty;
                  }
    
                  updateInventory({
                    id: inventory.id,
                    inventory: inventoryPayload
                  });
                }
              }
            }
    
            setTimeout(() => {
              if (items.length) {
                const payloadOutbounds = {
                  status: "processing",
                  items
                };
    
                updateOutbound({
                  id: outbound.id,
                  outbounds: payloadOutbounds
                });
              }
            }, 1000);
    
            await timer(500);
          }
          
          return NextResponse.json({ message: "Successfully" }, { status: 200 });
        } else {
          return NextResponse.json({ message: "Internal Error" }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
      }
}

function updateProperties(data: any, newObj: any) {
    if (data?.reservedQty) {
      const checkIndex = data.reservedQty.findIndex((item: any) => {
        return item.id == newObj.id;
      });
  
      if (checkIndex === -1) {
        return {
          reservedQty: data.reservedQty.concat(newObj)
        };
      } else {
        return {
          reservedQty: data.reservedQty.map((item: any) => {
            return { ...item, qty: item.qty + newObj.qty };
          })
        };
      }
    }
    return {
      reservedQty: [newObj]
    };
  }
  
  function timer(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
  