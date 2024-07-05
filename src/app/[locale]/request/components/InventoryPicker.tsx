import { useGetInventoriesBySapo } from "@/query-keys";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { TrashIcon, X } from "lucide-react";
import { IIventoriesSapo } from "@/types/inventories";
import { Button } from "@/components/ui/button";

const formSearchInventory = z.object({
  keyword: z.string(),
});

const InventoryPicker = ({
  handleQtyChange,
}: {
  handleQtyChange: (
    lines: z.infer<typeof formOrderLine>[],
    selectedItems: IIventoriesSapo[]
  ) => void;
}) => {
  const form = useForm<z.infer<typeof formSearchInventory>>({
    resolver: zodResolver(formSearchInventory),
    defaultValues: {
      keyword: "",
    },
  });
  const [keyword, setKeyword] = React.useState<string>("");
  const [selectedInventory, setSelectedInventory] = React.useState<
    IIventoriesSapo[]
  >([]);
  const [showTable, setShowTable] = React.useState<boolean>(false);

  const { data: inventories, isLoading } = useGetInventoriesBySapo({
    page: 1,
    pageSize: 10,
    keyword: keyword,
  });

  React.useEffect(() => {
    // show table when input "inputKeywordRef" is focused

    setShowTable(keyword.length > 0);
    // detect click outside to hide table
    function handleClickOutside(event: MouseEvent) {
      if (event.target instanceof HTMLElement) {
        if (!event.target.closest(".fixed")) {
          setShowTable(false);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [keyword]);

  const handleQuantityChange = (itemLines: z.infer<typeof formOrderLine>[]) => {
    handleQtyChange(itemLines, selectedInventory);
    setSelectedInventory((prev) => [...prev]);
  };

  return (
    <div className="px-6 border rounded border-slate-400 bg-white mt-8 py-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative  flex items-center w-6/12">
                  <Input
                    placeholder="Select SKU..."
                    autoComplete="off"
                    {...field}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      field.onChange(e);
                    }}
                    onClick={() => {
                      setShowTable(true);
                    }}
                  />
                  {form.getValues("keyword").length > 0 && (
                    <X
                      className="absolute right-5 cursor-pointer hover:text-red-500 text-red-600"
                      onClick={() => {
                        form.setValue("keyword", "");
                        form.setFocus("keyword");
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={cn({
            fixed: showTable,
            hidden: !showTable,
            "bg-white border border-gray-200 shadow-md mt-2 w-8/12 z-10 px-2 py-4":
              true,
          })}
        >
          {/* display a style table, with border, rounded corner */}
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {inventories?.data.map((inventory) => (
                <tr
                  key={inventory.id}
                  // hover effect
                  className="hover:bg-gray-100 cursor-pointer "
                  onClick={() => {
                    setSelectedInventory((prev) => {
                      if (prev.find((item) => item.id === inventory.id)) {
                        return prev;
                      } else {
                        return [...prev, inventory];
                      }
                    });
                    setKeyword("");
                    setShowTable(false);
                    form.setValue("keyword", "");
                    form.setFocus("keyword");
                  }}
                >
                  <td>{inventory.sku}</td>
                  <td>{inventory.name}</td>
                </tr>
              ))}
              {inventories?.data.length === 0 && (
                <tr>
                  <td colSpan={2}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedInventory.length > 0 && (
        //display an order form
        <SelectedInventory
          selectedInventory={selectedInventory}
          handleQuantityChange={handleQuantityChange}
        />
      )}
    </div>
  );
};

export default InventoryPicker;

export const formOrderLine = z.object({
  product_id: z.number(),
  variant_id: z.number(),
  is_freeform: z.boolean(),
  price: z.number(),
  tax_included: z.boolean(),
  tax_rate_override: z.number(),
  note: z.string(),
  quantity: z.number().min(1),
  discount_items: z.array(z.object({})),
});

const SelectedInventory = ({
  selectedInventory,
  handleQuantityChange,
}: {
  selectedInventory: IIventoriesSapo[];
  handleQuantityChange: (itemLines: z.infer<typeof formOrderLine>[]) => void;
}) => {
  const form = useForm<z.infer<typeof formOrderLine>[]>({
    resolver: zodResolver(formOrderLine),
  });
  const [isLocked, setIsLocked] = React.useState<boolean>(false);
  const onSubmit = (data: z.infer<typeof formOrderLine>[]) => {
    handleQuantityChange(data);
    setIsLocked(true);
  };
  return (
    <div>
      <h2 className="text-lg font-bold my-1 text-slate-500 mt-4 flex flex-col justify-between">
        <span>Selected Inventory</span>
        {isLocked && (
          <>
            <span className="text-base font-normal ">
              Total lines: {`${selectedInventory.length}`}{" "}
            </span>
            <span className="text-base font-normal ">
              Total qty:{" "}
              {selectedInventory.reduce(
                (acc, curr) =>
                  acc + form.getValues(`${curr.id}.quantity`) * 1 || 0,
                0
              )}
            </span>
          </>
        )}
      </h2>
      <Form {...form}>
        <table className="w-full border border-gray-200 rounded ">
          <thead>
            <tr className="text-left font-bold px-2 bg-slate-100 text-slate-700">
              {!isLocked && <th className="w-1/12 px-1 py-2"></th>}
              <th className="w-2/12 px-1 py-2">SKU</th>{" "}
              <th className="w-2/12">Qty</th>
              <th className="w-1/12">Available Qty</th>
              <th className="w-4/12">Name</th>
            </tr>
          </thead>
          <tbody>
            {selectedInventory.map((inventory, index) => (
              <tr key={inventory.id} className="px-2 py-2 hover:bg-slate-100">
                {!isLocked && (
                  <td>
                    <TrashIcon
                      className="pl-3 cursor-pointer w-8 px-2 text-red-500"
                      onClick={() => {
                        //remove current inventory from selectedInventory
                        selectedInventory.splice(index, 1);
                        handleQuantityChange(form.getValues());
                      }}
                    />
                  </td>
                )}
                <td className="px-1">{inventory.sku}</td>
                <td className="px-1 py-2">
                  <FormField
                    control={form.control}
                    name={`${inventory.id}.quantity`}
                    render={({ field }) => (
                      <div className="flex items-center gap-1">
                        {" "}
                        <Input
                          min={1}
                          required
                          {...field}
                          type="number"
                          disabled={isLocked}
                        />
                        <span
                          className="mr-4 cursor-pointer text-sm text-slate-500 "
                          onClick={() => {
                            form.setValue(
                              `${inventory.id}.quantity`,
                              inventory.inventories?.reduce(
                                (acc, curr) => acc + curr.available,
                                0
                              ) as number
                            );
                          }}
                        >
                          Max
                        </span>
                      </div>
                    )}
                  />
                </td>
                <td className="px-1">
                  {inventory.inventories?.reduce(
                    (acc, curr) => acc + curr.available,
                    0
                  )}
                </td>
                <td className="px-1">{inventory.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* submit */}
        <div className="flex flex-row gap-2 mt-2">
          {!isLocked && (
            <Button onClick={() => onSubmit(form.getValues())}>Confirm</Button>
          )}
          {isLocked && (
            <Button
              className=""
              variant={"link"}
              onClick={() => setIsLocked((prev) => !prev)}
            >
              Edit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};
