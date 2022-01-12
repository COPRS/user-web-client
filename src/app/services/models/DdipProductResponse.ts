export interface DdipProductResponse {
  '@odata.context': '$metadata#Products';
  '@odata.count': number;
  value: DdipProduct[];
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
  ContentDate: {
    Start: string;
    End: string;
  };
  Footprint: DdipProductFootprint | undefined;
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
