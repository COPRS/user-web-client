export interface Product {
  Id: String;
  Name: String;
  ContentType: String;
  ContentLength: number;
  PublicationDate: String;
  EvictionDate: String;
  ProductionType: String;
  Checksum: Array<{
    Algorithm: String;
    Value: String;
    ChecksumDate: String;
  }>;
  ContentDate: {
    Start: String;
    End: String;
  };
  Footprint: {
    type: String;
    coordinates: Array<Array<[number, number]>>;
  };
  Attributes: Array<any>;
}
