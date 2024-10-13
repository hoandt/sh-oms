import { IReportBestSeller, IReportOrderToday, IReportOverviewChannel, IReportPriceOrders, IReportPriceOrdersChannel } from "@/types/reports";

export const transactionQueryKeys = {
  getTransactions: ({ pageParam }: { pageParam?: number }) => [
    "get-transactions",
    pageParam,
  ],
  getTransactionsByInboundId: ({
    pageParam,
    id,
  }: {
    pageParam?: number;
    id: number;
  }) => ["get-transactions-inbound", pageParam, id],
  getReportOrderToday: (payload: IReportOrderToday = {}) => ["get-report-today", {...payload}],
  getReportBestSeller: (payload: IReportBestSeller = {}) => ["get-report-best-seller", {...payload}],
  getReportOverviewChannel: (payload: IReportOverviewChannel = {}) => ["get-report-overview-channel", {...payload}],
  getReportPriceOrders: (payload: IReportPriceOrders = {}) => ["get-report-price-orders", {...payload}],
  getReportPriceOrderChannel: (payload: IReportPriceOrdersChannel = {}) => ["get-report-price-orders-channel", {...payload}],
};
