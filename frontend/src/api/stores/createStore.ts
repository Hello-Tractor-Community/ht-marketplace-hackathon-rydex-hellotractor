import { RJSFSchema } from "@rjsf/utils";
import apiClient from "../../utils/apiClient";
import { Store } from "./getStores";

export const createStoreSchema = (
  dealerTypes: string[],
  regions: string[]
): RJSFSchema => ({
  title: "Store",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Store Name",
      description: "The name of the store",
      minLength: 1,
    },
    description: {
      type: "string",
      title: "Description",
      description: "A brief description of the store",
    },

    phone: {
      type: "string",
      title: "Phone Number",
      description: "The contact phone number for the store",
    },
    email: {
      type: "string",
      title: "Email Address",
      description: "The contact email address for the store",
      format: "email",
    },
    website: {
      type: "string",
      title: "Website URL",
      description: "The website URL of the store",
      format: "uri",
    },

    region: {
      type: "string",
      title: "Region",
      description: "The region of the store",
      enum: regions,
    },

    type: {
      type: "string",
      title: "Store Type",
      enum: ["STORE", "DEALER", "SERVICE_CENTER"],
      description: "The type of the store",
    },
    dealerType: {
      type: "string",
      title: "Dealer Type",
      description: "The type of dealer, if applicable",
      enum: dealerTypes,
    },

    location: {
      type: "object",
      title: "Location",
      description: "The location of the store",
      properties: {
        latlng: {
          type: "string",
          title: "Latitude and Longitude",
          description: "The latitude and longitude of the store",
        },
        address: {
          type: "string",
          title: "Address",
          description: "The address of the store",
        },
      },
      required: ["latlng", "address"],
    },
    logo: {
      type: "object",
      title: "Logo",
      description: "The logo of the store",
    },
    data: {
      type: "object",
      title: "Additional Data",
      description: "Additional data for the store",
      properties: {
        coverImage: {
          type: "object",
          title: "Cover Image",
          description: "The cover image of the store",
        },
        services: {
          type: "array",
          title: "Services",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                title: "Service Title",
                description: "The title of the service",
              },
              description: {
                type: "string",
                title: "Service Description",
                description: "The description of the service",
              },
            },
            required: ["title"],
          },
          description: "List of services offered by the store",
        },
        businessHours: {
          type: "array",
          title: "Business Hours",
          items: {
            type: "object",
            properties: {
              day: {
                type: "string",
                title: "Day",
                description: "The day of the week",
              },
              hours: {
                type: "string",
                title: "Hours",
                description: "The business hours for the day",
              },
            },
            required: ["day", "hours"],
          },
          description: "The business hours of the store",
        },
      },
    },
  },
  required: [
    "name",
    "phone",
    "email",
    "website",
    "location",
    "type",
    "region",
    "data",
  ],
  additionalProperties: false,
});

export const createStore = async (data: Partial<Store>) => {
  const response = await apiClient.post<Store>("/store", data);

  return response.data;
};

export const updateStore = async (id: string, data: Partial<Store>) => {
  const response = await apiClient.put<Store>(`/store/${id}`, data);

  return response.data;
};
