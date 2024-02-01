import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DataFilter = {
  id: string;
  name: string;
  value: string;
};

type Filter = {
  page: string;
  data: DataFilter[];
};

interface FilterState {
  selectedFilter: string;
  setSelectdFilter: (select: string) => any;
  filter: Filter[];
  addFilter: (filter: Filter) => void;
  updateFilter: ({ page, id, value }: any) => void;
  removeFilter: (page: string, id: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      selectedFilter: "",
      setSelectdFilter: (select: string) =>
        set((state) => {
          return { selectedFilter: select };
        }),
      filter: [],
      addFilter: (filter) =>
        set(() => {
          const filters = get().filter;
          const pageExists = filters.some((item) => item.page === filter.page);

          if (pageExists) {
            return {
              filter: filters.map((item) => {
                if (item.page === filter.page) {
                  return {
                    ...item,
                    data: item.data.concat(filter.data[0]),
                  };
                }
                return item;
              }),
            };
          } else {
            return { filter: filters.concat(filter) };
          }
        }),
      updateFilter: ({ page, id, value }) =>
        set((state) => {
          const pageExists = get().filter.some((item) => item.page === page);
          const filters = get().filter;
          const updatedFilters = filters.map((item) => {
            if (item.page === page) {
              return {
                ...item,
                data: item.data.map((e) => {
                  if (e.id === id) {
                    return { ...e, value: value };
                  }
                  return e;
                }),
              };
            }
            return item;
          });

          return { filter: pageExists ? updatedFilters : filters };
        }),
      removeFilter: (page: string, id: string) =>
        set(() => {
          const filters = get().filter;

          const newFilter = filters?.map((item) => {
            if (item.page === page) {
              item.data = item.data.filter((obj) => obj.id !== id);
            }
            return item;
          });

          return { filter: newFilter };
        }),
    }),
    {
      name: "filter-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
