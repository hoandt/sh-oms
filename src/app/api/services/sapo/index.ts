const fetchCookies = async () => {
  const response = await fetch("https://ext-api.swifthub.net/cookies.txt", {
    headers: {
      accept: "application/json, text/plain, */*",
    },
    body: null,
    method: "GET",
  });

  return response.text();
};

const fetchTokenForMarketPlaces = async () => {
  const response = await fetch(
    "https://ext-api.swifthub.net/marketplace-token.json",
    {
      headers: {
        accept: "application/json, text/plain, */*",
      },
      body: null,
      method: "GET",
    }
  );

  return response.text();
};

//crete a functionn to fetch data from the api
export const fetchInventoriesSapo = async (path: string, sellerId: string) => {
  //default path: ?page=1&pageSize=15&query=&created_on_min=&created_on_max=&brand_ids=

  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/variants/search.json${path}&category_ids=${sellerId}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchInventorySapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/products/${path}.json`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchVariantInventorySapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/lots_dates.json?variant_id=${path}&query=&limit=20&page=1`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return await response.json();
};

export const fetchReportInventorySapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/reports/inventories/variants/${path}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchCaterogyInventorySapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/categories/search.json${path}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchBrandsInventorySapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/brands/search.json${path}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchInboundsSapo = async (path: string, sellerId: string) => {
  const cookie = await fetchCookies();

  //append supplier_ids= sellerId to the path

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/purchase_orders.json${path}&supplier_ids=${sellerId}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchInboundDetailSapo = async (id: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/purchase_orders/${id}.json`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchLocationSapo = async () => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/locations.json`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchOutboundsSapo = async (path: string, sellerId: string) => {
  const cookie = await fetchCookies();

  const saleChannel = path.split("&")[3].split("=")[1];

  const marketplaces = [""];

  const sellers = sellerId.split(",");

  const filteredSellers = sellers.filter((seller) => {
    return marketplaces.some((marketplace) => {
      const prefix =
        marketplace.charAt(0).toUpperCase() +
        marketplace.slice(1).toLowerCase();
      return (
        seller.toLowerCase().startsWith(marketplace) ||
        seller.startsWith(prefix)
      );
    });
  });

  //filter saleChannel in filteredSellers

  const filteredSaleChannel = filteredSellers.filter((seller) => {
    return seller.toLowerCase().startsWith(saleChannel);
  });

  const prefixSaleChannel = filteredSaleChannel.map((seller) => {
    return seller.split("_")[0].toLowerCase();
  });

  let tags = "";

  if (prefixSaleChannel.length > 0) {
    tags = filteredSaleChannel.join(",");
  } else {
    tags = sellerId;
  }

  //replace space with %20
  tags = tags.replace(/\s/g, "+");

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/orders.json${path}&tags=${tags}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchOutboundDetailSapo = async (id: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/orders/${id}.json`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

const TOKEN_MARKET =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzd2lmdGh1YjIiLCJleHAiOjE3Mjg4ODEwNzYsImlhdCI6MTcyODc5NDY3Nn0.v4505aHFcbN1bQ97WYcHie7lj_Ns1jTYLSuUZVHwxpQ";
const TOKEN_ACCOUNT_ID = "MTA4NTI2OQ==";

export interface ICommon {
  marketplaceIds: string;
  from?: number | string;
  to?: number | string;
}

export const fetchAnalyticsOrdersToday = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/orders/today?ids=${payload.marketplaceIds}&from=${payload.from}&to=${payload.to}&zone=Asia/Saigon`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );

  return response.json();
};

export const fetchBestSellerProducts = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/products?ids=${payload.marketplaceIds}&from=${payload.from}&to=${payload.to}&sortField=revenue&sortType=up&limit=4`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

export const fetchDeliveryServicesProviders = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/api/delivery-service-providers`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

export const fetchPriceOrderByChannel = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/orders/type?ids=${payload.marketplaceIds}&from=${payload.from}&to=${payload.to}&statuses=2,3,4,5,7,8,9&zone=Asia/Saigon`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

export const fetchOverviewChannel = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/orders/connection?ids=${payload.marketplaceIds}&from=${payload.from}&to=${payload.to}&statuses=2,3,4,5,7,8,9&zone=Asia/Saigon`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

export const fetchRevenueOrders = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/orders/revenue?ids=${payload.marketplaceIds}&group=day&from=${payload.from}&to=${payload.to}&statuses=0,1,2,3,4,5,6,7,8,9&zone=Asia/Saigon`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};

export const fetchRevenueChannel = async (payload: ICommon) => {
  const response = await fetch(
    `https://market-place.sapoapps.vn/analytics/orders/type?ids=${payload.marketplaceIds}&from=${payload.from}&to=${payload.to}&statuses=0,1,2,3,4,5,6,7,8,9&zone=Asia/Saigon`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: TOKEN_MARKET,
        "x-market-token": TOKEN_MARKET,
        "x-market-account-id": TOKEN_ACCOUNT_ID,
      },
      body: null,
      method: "GET",
    }
  );
  return response.json();
};
