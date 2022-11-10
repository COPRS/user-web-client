export interface DdipProductResponse<T> {
  '@odata.context': '$metadata#Products';
  '@odata.count': number;
  value: T[];
}

export interface DdipProduct {
  '@odata.mediaContentType': string;
  Id: string;
  Name: string;
  ContentType: string;
  ContentLength: number;
  PublicationDate: string;
  EvictionDate: string;
  Checksum: DdipProductChecksum[];
  ProductionType: string;
  ProductType: string;
  ContentDate: {
    Start: string;
    End: string;
  };
  Footprint: DdipProductFootprint | undefined;
}

export interface DdipProductRawFromPrip {
  '@odata.mediaContentType': string;
  Id: string;
  Name: string;
  ContentType: string;
  ContentLength: number;
  PublicationDate: string;
  EvictionDate: string;
  Checksum: DdipProductChecksum[];
  ProductionType: string;
  ContentDate: {
    Start: string;
    End: string;
  };
  Footprint: null;
  Attributes: [];
  StringAttributes: DdipProductExtendedAttribute[];
  IntegerAttributes: DdipProductExtendedAttribute[];
  DoubleAttributes: DdipProductExtendedAttribute[];
  BooleanAttributes: DdipProductExtendedAttribute[];
  DateTimeOffsetAttributes: DdipProductExtendedAttribute[];
}

export interface DdipProductExtendedAttribute {
  Name: string;
  ValueType: string;
  Value: string | number | boolean;
}
export interface DdipProductChecksum {
  Algorithm: string;
  Value: string;
  ChecksumDate: string;
}

export interface DdipProductFootprint {
  type: string;
  crs: any;
  coordinates: Array<Array<[number, number]>>;
}
