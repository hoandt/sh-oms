import { getBestSeller, getOverviewChannel, getPriceOrder, getReportOrderToday, getReportPriceOrdersChannel } from "@/services";
import { transactionQueryKeys } from "./key";
import { useQuery } from "@tanstack/react-query";
import { IReportBestSeller, IReportOrderToday, IReportOverviewChannel, IReportPriceOrders, IReportPriceOrdersChannel } from "@/types/reports";

export const useGetReportOrderToday = (payload: IReportOrderToday = {}) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getReportOrderToday(payload),
    queryFn: () => getReportOrderToday(payload),
    enabled: !!payload.marketplaceIds && !!payload.from && !!payload.to,
  });
  return query;
};

export const useGetBestSeller = (payload: IReportBestSeller = {}) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getReportBestSeller(payload),
    queryFn: () => getBestSeller(payload),
    enabled: !!payload.marketplaceIds && !!payload.from && !!payload.to,
  });
  return query;
};

export const useGetOverviewChannel = (payload: IReportOverviewChannel = {}) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getReportOverviewChannel(payload),
    queryFn: () => getOverviewChannel(payload),
    enabled: !!payload.marketplaceIds && !!payload.from && !!payload.to,
  });
  return query;
};

export const useGetPriceOrder = (payload: IReportPriceOrders = {}) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getReportPriceOrders(payload),
    queryFn: () => getPriceOrder(payload),
    enabled: !!payload.marketplaceIds && !!payload.from && !!payload.to,
  });
  return query;
};

export const useGetReportPriceOrdersChannel = (payload: IReportPriceOrdersChannel = {}) => {
  const query = useQuery({
    queryKey: transactionQueryKeys.getReportPriceOrderChannel(payload),
    queryFn: () => getReportPriceOrdersChannel(payload),
    enabled: !!payload.marketplaceIds && !!payload.from && !!payload.to,
  });
  return query;
};
