import { customersQueryKeys } from "./key";
import {
  getCustomers,
  getDistricts,
  getProvinces,
  getWards,
} from "@/services/customers";
import { useQuery } from "@tanstack/react-query";

export const useGetProvinces = () => {
  const query = useQuery({
    queryKey: customersQueryKeys.getProvinces(),
    queryFn: () => {
      return getProvinces();
    },
  });
  return query;
};

export const useGetDistricts = ({ provinceId }: { provinceId: number }) => {
  const query = useQuery({
    queryKey: customersQueryKeys.getDistricts(provinceId),
    queryFn: () => getDistricts({ provinceId }),
    enabled: !!provinceId,
  });
  return query;
};

export const useGetWards = ({ districtId }: { districtId: number }) => {
  const query = useQuery({
    queryKey: customersQueryKeys.getWards(districtId),
    queryFn: () => getWards({ districtId }),
    enabled: !!districtId,
  });
  return query;
};

export const useGetCustomers = ({ code, page, pageSize }: any) => {
  const query = useQuery({
    queryKey: customersQueryKeys.getCustomers({
      pageParam: page,
    }),
    queryFn: () => getCustomers({ page, pageSize }),
  });

  return query;
};
