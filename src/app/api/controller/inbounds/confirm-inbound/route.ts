import { postInbound, updateInbound } from "@/app/api/services/inbounds";
import {
  getInventory,
  postInventory,
  updateInventory,
} from "@/app/api/services/inventories";
import { postTransaction } from "@/app/api/services/transactions";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const responseData = await req.json();
    const inbounds = responseData.inbound;

    for (const inbound of inbounds || []) {
      for (const item of inbound.Item || []) {
        const id = item.system_item_master.data.id;
        const lot = item.lot;

        const inventories = await getInventory({
          options: {
            filters: {
              $and: [
                {
                  system_item_master: {
                    id: {
                      $eq: id,
                    },
                  },
                },
                {
                  lot: {
                    $eq: lot || undefined,
                  },
                },
              ],
            },
          },
        });

        if (inventories?.data.length === 0) {
          const newInventory = await postInventory({
            inventory: {
              system_item_master: id,
              availableQty: item.qty,
              lot: item.lot,
              exp: item.exp,
              mfg: item.mfg,
              warehouse: inbound.warehouse.id,
              organization: inbound.organization.id,
            },
          });

          postTransaction({
            transaction: {
              system_inventory: newInventory?.data.data.id,
              type: "inbound",
              ref: inbound.code,
              qty: item.qty,
            },
          });
        } else {
          updateInventory({
            id: inventories.data[0].id,
            inventory: {
              availableQty:
                inventories.data[0].attributes.availableQty + item.qty,
            },
          });

          postTransaction({
            transaction: {
              system_inventory: inventories.data[0].id,
              type: "inbound",
              ref: inbound.code,
              qty: item.qty,
            },
          });
        }

        updateInbound({
          id: inbound.id,
          inbound: {
            status: "done",
          },
        });
      }
    }

    return NextResponse.json({ message: "Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

const createSystemTransaction = async (
  inventoryId: number,
  type: string,
  ref: string,
  qty: number
) => {};
