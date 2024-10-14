export const fetchDashboard = async () => {
  const response = await fetch(
    "https://tracking.swifthub.net/downloads/output.json",
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
