/* @flow */

export default class PresentationItem {

  name: string;
  value: Object;
  propKeys: Array<string>;
  itemDescriptor: ItemDescriptor;

  constructor(
    name: string,
    value: Object,
    propKeys: Array<string>,
    itemDescriptor: ItemDescriptor
  ) {
    this.name = name;
    this.value = value;
    this.propKeys = propKeys;
    this.itemDescriptor = itemDescriptor;
  }

}

class ItemDescriptor {
  uiElementType: string;
  dropDownValues: Array<Object>;

  constructor(
    uiElementType: string,
    dropDownValues: Array<Object>
  ) {
    this.uiElementType = uiElementType;
    this.dropDownValues = dropDownValues;
  }
}

export function buildTextPresentationItem(
  parameterName : string,
  parameterValue : Object,
  propertyKeys : Array<string>) {

  const parameterItemDescriptor = new ItemDescriptor('textField');
  const textPresentationItem =
    new PresentationItem(parameterName, parameterValue, propertyKeys, parameterItemDescriptor);
  return textPresentationItem;
}

export function buildSelectFieldPresentationItem(
  parameterName : string,
  parameterValue : Object,
  propertyKeys : Array<string>,
  dropDownValues: Array<Object>) {

  const parameterItemDescriptor = new ItemDescriptor('selectField', dropDownValues);
  const selectFieldPresentationItem =
    new PresentationItem(parameterName, parameterValue, propertyKeys, parameterItemDescriptor);
  return selectFieldPresentationItem;
}

export function buildCheckboxPresentationItem(
  parameterName : string,
  parameterValue : Object,
  propertyKeys : Array<string>) {

  const parameterItemDescriptor = new ItemDescriptor('checkBox');
  const selectFieldPresentationItem =
    new PresentationItem(parameterName, parameterValue, propertyKeys, parameterItemDescriptor);
  return selectFieldPresentationItem;
}

export function buildSignPropertyTextPresentationItem(
  bsdmSignMetadata : Object,
  parameterName : string) {
  const parameterItemDescriptor = new ItemDescriptor('textField');
  const textPresentationItem =
    new PresentationItem(
      parameterName,
      bsdmSignMetadata[parameterName],
      ['meta', parameterName],
      parameterItemDescriptor);
  return textPresentationItem;
}

export function buildSignPropertyCheckboxPresentationItem(
  bsdmSignMetadata : Object,
  parameterName : string) {
  const parameterItemDescriptor = new ItemDescriptor('checkBox');
  const checkboxPresentationItem =
    new PresentationItem(
      parameterName,
      bsdmSignMetadata[parameterName],
      ['meta', parameterName],
      parameterItemDescriptor);
  return checkboxPresentationItem;
}

export function buildSignPropertySelectFieldPresentationItem(
  bsdmSignMetadata : Object,
  parameterName : string,
  dropDownValues: Array<Object>) {
  const parameterItemDescriptor = new ItemDescriptor('selectField', dropDownValues);
  const selectFieldPresentationItem =
    new PresentationItem(
      parameterName,
      bsdmSignMetadata[parameterName],
      ['meta', parameterName],
      parameterItemDescriptor);
  return selectFieldPresentationItem;
}
