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

export class ItemDescriptor {
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
