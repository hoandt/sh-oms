import { getSystemInventoryDetailSapo } from "@/services";
import { IIventorySapo } from "@/types/inventories";
import { CompositeItemDomain } from "@/types/outbound";
import React, { useEffect } from "react";

function Composite({
  compositeDomains,
}: {
  compositeDomains: CompositeItemDomain[];
}) {
  const compositeItems = compositeDomains.map((compositeDomain) => {
    return {
      productId: compositeDomain.product_id,
      variantId: compositeDomain.variant_id,
    };
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  //usestate and useeffect to get product info   getSystemInventoryDetailSapo();

  const [items, setItems] = React.useState<
    {
      data: IIventorySapo;
    }[]
  >([]);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      //promise.all to get all the product info
      const promises = compositeItems.map((item) => {
        return getSystemInventoryDetailSapo({ productId: `${item.productId}` });
      });
      const items = await Promise.all(promises);
      setItems(items);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div>
        {/* isloading display */}
        {isLoading && <div>Loading original items...</div>}
        {/* if items.length */}
        {items.length > 0 &&
          items.map(
            (
              item: {
                data: IIventorySapo;
              },
              i
            ) => {
              return (
                <div
                  key={i}
                  // display table style
                  className="flex flex-col   w-full h-full p-2 bg-white border border-gray-200 rounded   "
                >
                  <div>
                    {compositeItems
                      .filter(
                        (compositeItem) =>
                          compositeItem.productId === item.data?.id
                      )
                      .map((compositeItem, j) => {
                        //find compositeItem.variantId in item.data.variants
                        //if found, return the variant
                        const variant = item.data?.variants.find(
                          (variant) => variant.id === compositeItem.variantId
                        );
                        return (
                          //display the variant and barcode with qty, 2 columns
                          <div key={j} className="flex justify-between">
                            <div className="flex flex-col align-middle justify-center items-center px-4">
                              <div className="text-lg"> 1</div>
                            </div>
                            {/* multiply */}
                            <div className="flex flex-col align-middle justify-center items-center mr-4">
                              <div className="text-lg text-slate-400"> x</div>
                            </div>
                            <div className="flex flex-col flex-1">
                              <div className="text-sm font-bold">
                                {variant?.name}
                              </div>
                              <div className="text-sm">{variant?.barcode}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}

export default Composite;
