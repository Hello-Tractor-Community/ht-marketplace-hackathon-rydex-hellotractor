import { Request } from "express";
import { Op } from "sequelize";

const parser: any = require("@bitovi/sequelize-querystring-parser");

export const likeHelper = (req: Request, data: any) => {
  // console.log(req.query);

  const match = (req.query.filter as string)?.match(/like\((\w+),\'(\w+)\'\)/);

  // console.log("match", match);
  if (match?.length) {
    data.where = {
      ...data.where,
      [match[1]]: {
        [Op.iLike]: `%${match[2]}%`,
      },
    };
  }

  return data;
};

export const likeHelper2 = (data: any) => {
  // console.log("liking data", data);
  if (!data) {
    return data;
  }

  for (const key of [
    ...Object.getOwnPropertySymbols(data),
    ...Object.keys(data),
  ]) {
    // console.log("key", key);
    const val = data[key];
    // console.log("val", val);
    if (Array.isArray(val)) {
      data[key] = val.map((v) => likeHelper2(v));
      continue;
    }
    if (typeof val === "object") {
      // console.log("val is object");
      data[key] = likeHelper2(val);
      continue;
    }

    if (key == Op.like) {
      // console.log("key is like");
      delete data[key];
      data = {
        [Op.iLike]: val,
      };
    }
  }

  return data;
};

export const extendedParser = (req: Request) => {
  console.log("Parsing", req.url.split("?")[1]);

  const parsed = parser.parse(req.url.split("?")[1]);
  parsed.data.where = likeHelper2(parsed.data.where);

  console.log("Parsed", parsed.data);
  return parsed;
};
