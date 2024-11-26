import { RJSFSchema } from "@rjsf/utils";
import apiClient from "../../utils/apiClient";
import { Store } from "./getStores";

export const createStoreSchema: RJSFSchema = {
  title: "Store",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The name of the store",
      minLength: 1,
    },
    description: {
      type: "string",
      description: "A brief description of the store",
    },

    phone: {
      type: "string",
      description: "The contact phone number for the store",
    },
    email: {
      type: "string",
      description: "The contact email address for the store",
      format: "email",
    },
    website: {
      type: "string",
      description: "The website URL of the store",
      format: "uri",
    },

    location: {
      type: "object",
      description: "The location of the store",
      properties: {
        latlng: {
          type: "string",
          description: "The latitude and longitude of the store",
        },
        address: {
          type: "string",
          description: "The address of the store",
        },
      },
      required: ["latlng", "address"],
    },
    data: {
      type: "object",
      description: "Additional data for the store",
      additionalProperties: {
        type: "string",
      },
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export const createStore = async (data: Partial<Store>) => {
  const response = await apiClient.post<Store>("/store", data);

  return response.data;
};

export const updateStore = async (id: string, data: Partial<Store>) => {
  const response = await apiClient.put<Store>(`/store/${id}`, data);

  return response.data;
};
