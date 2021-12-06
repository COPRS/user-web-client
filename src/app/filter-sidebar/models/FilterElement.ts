export interface FilterElement {
  attributeName: string;
  operator:
    | string
    | 'contains'
    | 'endswith'
    | 'eq'
    | 'ge'
    | 'gt'
    | 'le'
    | 'lt'
    | 'startswith';
  value: string;
}
