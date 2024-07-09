import { getVariantInventoryDetailSapo } from "@/services";
import { Variant } from "@/types/inventories";
import { formatDate } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const LotInventory = () => {
  //extract url get
  const params = useSearchParams();

  const [isLoading, setIsLoading] = React.useState(true);
  const [variantInventory, setVariantInventory] = React.useState<
    LotVariantInventory[]
  >([]);
  useEffect(() => {
    const fetchVariantInventory = async (productId: string) => {
      const res = await getVariantInventoryDetailSapo({
        productId,
      });

      setVariantInventory(res.data);
      setIsLoading(false);
    };

    params.get("variantId")
      ? fetchVariantInventory(params.get("variantId") as string)
      : setIsLoading(false);
  }, [params.get("variantId")]);

  return (
    <div className="  ">
      {isLoading && <div>Loading Inventory...</div>}
      {/* @Hoan fix variantInventory.length > 0   */}
      {variantInventory && variantInventory.length === 0 && (
        <table className="mt-2 py-2 bg-white">
          <thead>
            <tr className="rounded-t bg-slate-200 py-2 text-sm text-slate-500">
              <th className="font-bold px-2">Lot Number</th>
              <th className="font-bold px-2">MFG Date</th>
              <th className="font-bold px-2">Available</th>
            </tr>
          </thead>
          {variantInventory.map((lot) => (
            <tr key={lot.id} className="my-1 py-2">
              <td className="font-bold px-2">{lot.lots_number}</td>
              <td className="px-2">
                {formatDate(lot.manufacture_date, "MM/yyyy")}
              </td>
              <td className="px-2">{lot.available}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default LotInventory;

type LotVariantInventory = {
  id: number;
  tenant_id: number;
  product_id: number;
  variant_id: number;
  lots_number: string;
  quantity: number;
  available: number;
  manufacture_date: string;
  expiration_date: string;
  created_on: string;
  modified_on: string;
  lots_date_status: string;
  status: string;
  lots_inventories: {
    lots_id: number;
    location_id: number;
    product_id: number;
    variant_id: number;
    onhand: number;
    available: number;
    committed: number;
    onway: number;
    incoming: number;
    wait_to_pack: number;
    cost_price: number;
  }[];
};

const sampleLotVariantInventory = [
  {
    id: 2331584,
    tenant_id: 744443,
    product_id: 177576634,
    variant_id: 287199481,
    lots_number: "L0822",
    quantity: 176,
    available: 176,
    manufacture_date: "2022-08-07T17:00:00Z",
    expiration_date: "2030-08-08T16:59:59Z",
    created_on: "2024-06-26T04:32:23Z",
    modified_on: "2024-06-26T04:32:23Z",
    lots_date_status: "UnExpired",
    status: "un_expired",
    lots_inventories: [
      {
        lots_id: 2331584,
        location_id: 719032,
        product_id: 177576634,
        variant_id: 287199481,
        onhand: 176,
        available: 176,
        committed: 0,
        onway: 0,
        incoming: 0,
        wait_to_pack: 0,
        cost_price: 0,
      },
    ],
  },
  {
    id: 2331581,
    tenant_id: 744443,
    product_id: 177576634,
    variant_id: 287199481,
    lots_number: "L0622",
    quantity: 136,
    available: 136,
    manufacture_date: "2022-06-05T17:00:00Z",
    expiration_date: "2030-06-06T16:59:59Z",
    created_on: "2024-06-26T04:31:14Z",
    modified_on: "2024-06-26T04:31:14Z",
    lots_date_status: "UnExpired",
    status: "un_expired",
    lots_inventories: [
      {
        lots_id: 2331581,
        location_id: 719032,
        product_id: 177576634,
        variant_id: 287199481,
        onhand: 136,
        available: 136,
        committed: 0,
        onway: 0,
        incoming: 0,
        wait_to_pack: 0,
        cost_price: 0,
      },
    ],
  },
  {
    id: 2331578,
    tenant_id: 744443,
    product_id: 177576634,
    variant_id: 287199481,
    lots_number: "L0922",
    quantity: 8,
    available: 8,
    manufacture_date: "2022-09-08T17:00:00Z",
    expiration_date: "2030-09-09T16:59:59Z",
    created_on: "2024-06-26T04:30:44Z",
    modified_on: "2024-06-26T04:30:44Z",
    lots_date_status: "UnExpired",
    status: "un_expired",
    lots_inventories: [
      {
        lots_id: 2331578,
        location_id: 719032,
        product_id: 177576634,
        variant_id: 287199481,
        onhand: 8,
        available: 8,
        committed: 0,
        onway: 0,
        incoming: 0,
        wait_to_pack: 0,
        cost_price: 0,
      },
    ],
  },
];
