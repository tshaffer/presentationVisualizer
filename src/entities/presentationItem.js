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
  dropDownValues: Array<string>;

  constructor(
    uiElementType: string,
    dropDownValues: Array<string> = []
  ) {
    this.uiElementType = uiElementType;
    this.dropDownValues = dropDownValues;
  }
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
  dropDownValues: Array<string>) {
  const parameterItemDescriptor = new ItemDescriptor('selectField', dropDownValues);
  const selectFieldPresentationItem =
    new PresentationItem(
      parameterName,
      bsdmSignMetadata[parameterName],
      ['meta', parameterName],
      parameterItemDescriptor);
  return selectFieldPresentationItem;
}
