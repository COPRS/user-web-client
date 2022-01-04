export type DdipProductResponse = {
  '@odata.context': '$metadata#Products';
  '@odata.count': number;
  value: DdipProduct[];
};

export type DdipProduct = {
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
};

export type DdipProductChecksum = {
  Algorithm: string;
  Value: string;
  ChecksumDate: string;
};
