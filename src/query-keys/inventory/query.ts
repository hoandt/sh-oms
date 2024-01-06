import { useQuery } from "@tanstack/react-query";
import { inventoryQueryKeys } from "./key";
import { getSystemInventories } from "@/services/inventories";

interface IGetInventory {
    code: string;
    page?: number;
    pageSize?: number;
}

export const useGetInventories = ({
    code,
    page,
    pageSize
  }: IGetInventory) => {
    const query = useQuery({
      queryKey: inventoryQueryKeys.getInventories({pageParam: page, code}),
      queryFn: () => getSystemInventories({ code, page, pageSize })
    });
    return query;
  };
  