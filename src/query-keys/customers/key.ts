export const customersQueryKeys = {
  getProvinces: () => ["get-provinces"],
  getDistricts: (id: number) => ["get-districts", id],
  getWards: (id: number) => ["get-wards", id],
  getCustomers: ({ pageParam }: { pageParam?: number }) => [
    "get-customers",
    pageParam,
  ],
  getOrganization: ({ pageParam }: { pageParam?: number }) => [
    "get-organization",
    pageParam,
  ],
};
