import { AttributeQueryParameter } from './AttributeQuery';

export type ProductQuery = {
  missionName: String;
  productType: String;
  attributes?: AttributeQueryParameter[];
};
