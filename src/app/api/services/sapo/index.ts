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
