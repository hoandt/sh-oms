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

export const fetchInboundsSapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/purchase_orders.json${path}`,
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

export const fetchOutboundsSapo = async (path: string) => {
  const cookie = await fetchCookies();

  const response = await fetch(
    `https://swifthub2.mysapogo.com/admin/orders.json${path}`,
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
  console.log({id})
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

