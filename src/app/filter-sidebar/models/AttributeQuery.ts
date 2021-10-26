export interface AttributeQueryParameter {
  attributeName: String;
  operator: String;
  value: String;
}

export interface TextAttributeQueryParameter extends AttributeQueryParameter {
  operator: 'eq' | 'startswith' | 'endswith' | 'contains';
}

export interface NumberAttributeQueryParameter extends AttributeQueryParameter {
  operator: 'GT' | 'GE' | 'LT' | 'LE' | 'EQ';
}

export interface BooleanAttributeQueryParameter
  extends AttributeQueryParameter {
  operator: 'eq';
}
