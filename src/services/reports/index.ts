import { fetchData } from "@/lib/helpers";
import { IOutbound } from "@/types/outbound";
import {
  IReportBestSellerResponse,
  IReportComparation,
  IReportOrderToday,
  IReportOrderTodayResponse,
  IReportOverviewChannel,
  IReportOverviewChannelResponse,
  IReportPriceOrders,
  IReportPriceOrdersChannel,
  IReportPriceOrdersChannelResponse,
  IReportPriceOrdersResponse,
} from "@/types/reports";
import qs from "qs";

export const getReportOrderToday = async (payload: IReportOrderToday = {}) => {
  const params = {
    ...payload,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/reports/getReportOrderToday${queryOptions}`;
  const responses = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return responses as IReportOrderTodayResponse;
};

export const getBestSeller = async (payload: IReportOrderToday = {}) => {
  const params = {
    ...payload,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/reports/getBestSeller${queryOptions}`;
  const responses = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return responses as { products: IReportBestSellerResponse[] };
};

export const getOverviewChannel = async (
  payload: IReportOverviewChannel = {}
) => {
  const params = {
    ...payload,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/reports/getOverviewChannel${queryOptions}`;
  const responses = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return responses as IReportOverviewChannelResponse[];
};

export const getPriceOrder = async (payload: IReportPriceOrders = {}) => {
  const params = {
    ...payload,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/reports/getPriceOrder${queryOptions}`;
  const responses = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return responses as {
    comparison: IReportComparation;
    revenues: IReportPriceOrdersResponse[];
  };
};

export const getReportPriceOrdersChannel = async (
  payload: IReportPriceOrdersChannel = {}
) => {
  const params = {
    ...payload,
  };

  const queryOptions = qs.stringify(params, {
    encodeValuesOnly: true,
    addQueryPrefix: true,
  });

  const ENDPOINT = `/api/controller/reports/getPriceOrderByChannel${queryOptions}`;
  const responses = await fetchData(ENDPOINT, {
    method: "GET",
  });

  return responses as IReportPriceOrdersChannelResponse[];
};
