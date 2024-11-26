import { SearchOption } from "../../components/Search/searchTextField";
import apiClient from "../../utils/apiClient";
import { getProducts, Product } from "./getProducts";

export type Category = {
  id: number;
  name: string;
  subCategories?: SubCategory[];
  icon?: string;
};

export type SubCategory = {
  id: number;
  name: string;
  products?: Product[];
  categoryId: number;
  category?: Category;
  specificationSchema?: object;
  filterSchema?: object;
};

export const getSearchOptions = async (
  search: string
): Promise<SearchOption[]> => {
  const params = {
    filter: `contains(name,'${search}')`,
    fields: ["id", "name"],
    "page[number]": 1,
    "page[size]": 3,
  };
  const [categories, subCategories, products] = await Promise.all([
    apiClient.get<Category[]>(`/category`, { params }),
    apiClient.get<SubCategory[]>(`/category/subCategory`, { params }),
    getProducts(params),
  ]);

  const searchOptions: SearchOption[] = [];

  categories.data.forEach((category) => {
    searchOptions.push({
      title: category.name,
      type: "category",
      id: category.id,
    });
  });
  subCategories.data.forEach((category) => {
    searchOptions.push({
      title: category.name,
      type: "subCategory",
      id: category.id,
    });
  });

  products.products.forEach((product) => {
    searchOptions.push({
      title: product.name,
      type: "product",
      id: product.id,
    });
  });

  return searchOptions;
};

export const getSubcategories = async () => {
  const response = await apiClient.get<SubCategory[]>("/category/subCategory");
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCategories = async (params?: any) => {
  const response = await apiClient.get<Category[]>("/category", { params });
  return response.data;
};
