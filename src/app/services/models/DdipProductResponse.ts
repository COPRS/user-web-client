/**
 * Copyright 2023 Airbus
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  Quicklooks: string[];
  ExtendedAttributes: DdipProductExtendedAttribute[];
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
  Quicklooks: DdipQuicklook[];
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

export interface DdipQuicklook {
  Image: string;
}
