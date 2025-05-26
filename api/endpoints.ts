export const ENDPOINTS = {
  APP: {
    show: (id: string) => `app/${id}`,
  },
  STORE: {
    list: "stores",
    base: "store",
    detail: (id: string) => `store/${id}`,
    products: (id: string) => `store/${id}/products`,
    categories: (id: string) => `store/${id}/store_category_products`,
  },
};
