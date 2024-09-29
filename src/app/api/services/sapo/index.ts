import { IGetOutboundSapo } from "@/query-keys/outbound";

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

//crete a functionn to fetch data from the api
export const fetchInventoriesSapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/variants/search.json${path}`,
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

  const marketplaces = [
    "tiktok",
    "shopee",
    "lazada",
    "tiki",
    "sendo",
    "shopify",
    "all",
    "motherswork",
    "wholesales",
    "offline",
  ];

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

  //url encode tags
  tags = encodeURIComponent(tags);

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
  let queryOrderUrl = `https://swifthub2.mysapogo.com/admin/orders.json?page=1&limit=1&query=${id}`;

  const response = await fetch(queryOrderUrl, {
    headers: {
      accept: "application/json, text/plain, */*",
      cookie,
    },
    body: null,
    method: "GET",
  });
  const res = (await response.json()) as {
    orders: {
      id: number;
    }[];
  };

  //if res length is 0, return null
  if (res.orders.length === 0) {
    return null;
  }

  let getOrderUrl = `https://swifthub2.mysapogo.com/admin/orders/${res.orders[0].id}.json`;

  const orderResponse = await fetch(getOrderUrl, {
    headers: {
      accept: "application/json, text/plain, */*",
      cookie,
    },
    body: null,
    method: "GET",
  });

  return orderResponse.json() as Promise<{
    order: IGetOutboundSapo[];
  }>;
};
