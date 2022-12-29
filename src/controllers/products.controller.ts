import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { Product } from "~/models";

interface IQueryObject extends Record<string, any> {
  featured?: boolean;
  company?: string | ParsedQs | Array<string> | Array<ParsedQs>;
  name?: {
    $regex: string | ParsedQs | string[] | ParsedQs[];
    $options: string;
  };
  sort?: string;
  fields?: string;
  numericFilters?: string;
}

type MatchType = ">" | ">=" | "=" | "<" | "<=";

const getAllProductsStatic = async (req: Request, res: Response) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject: IQueryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    const filters = (numericFilters as string).replace(
      regEx,
      (match) => `-${operatorMap[match as MatchType]}-`
    );
    const options = ["price", "rating"];
    filters.split(",").forEach((item: any) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = (sort as string).split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = (fields as string).split(",").join(" ");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

export { getAllProducts, getAllProductsStatic };
