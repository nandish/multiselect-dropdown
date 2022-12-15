import { Component, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDropdownSettings } from './dropdown-settings.model';
import { ListItem } from './list-item.model';

const noop = () => { };

@Component({
  selector: 'ng-reg-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})





export class MultiSelectComponent implements ControlValueAccessor {

  public _settings: IDropdownSettings = {};
  public _data: Array<ListItem> = [];
  public selectedItems: Array<ListItem> = [];
  public isDropdownOpen = true;
  _placeholder = "Select";

  private _sourceDataType: any = null;
  private _sourceDataFields: Array<string> = [];
  //filter: ListItem = new ListItem(this.data);

  defaultSettings: IDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "text",
    tooltipField: "tooltip",
    disabledField: "isDisabled",
    enableCheckAll: true,
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 999999999999,
    searchPlaceholderText: "Search",
    noDataAvailablePlaceholderText: "No data available",
    noFilteredDataAvailablePlaceholderText: "No filtered data available",
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false
  };

  @Input()
  public set placeholder(value: string) {
    if (value) {
      this._placeholder = value;
    } else {
      this._placeholder = 'Select';
    }
  }

  @Input()
  disabled = false;

  @Input()
  public set settings(value: IDropdownSettings) {
    if (value) {
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  @Input()
  public set data(value: Array<any>) {
    if (!value) {
      this._data = [];
    } else {
      const firstItem = value[0];
      this._sourceDataType = typeof firstItem;
      this._sourceDataFields = this.getFields(firstItem);
      this._data = value.map(item => this.deobjectify(item))
    }
  }

  @Output("onDropDownClose")
  onDropDownClose: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output("onSelect")
  onSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output("onDeSelect")
  onDeSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output("onSelectAll")
  onSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();

  @Output("onDeSelectAll")
  onDeSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();


  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  writeValue(value: any): void {
    if (value !== undefined && value !== null && value.length > 0) {
      if (this._settings.singleSelection) {
        try {
          if (value.length >= 1) {
            this.selectedItems = [this.deobjectify(value[0])];
          }
        } catch (e) {
          // console.error(e.body.msg);
        }
      } else {
        const _data = value.map((item: any) => this.deobjectify(item));
        if (this._settings.limitSelection! > 0) {
          this.selectedItems = _data.splice(0, this._settings.limitSelection);
        } else {
          this.selectedItems = _data;
        }
      }
    } else {
      this.selectedItems = [];
    }
    this.onChangeCallback(value);

    //this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }



  // Set touched on blur
  @HostListener("blur")
  public onTouched() {
    // this.closeDropdown();
    this.onTouchedCallback();
  }

  toggleDropdown(evt: any) {
    evt.preventDefault();
    if (this.disabled && this._settings.singleSelection) {
      return;
    }
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this._settings.defaultOpen) {
      this.onDropDownClose.emit();
    }
  }

  closeDropdown() {
    this._settings.defaultOpen = false;
    // clear search text
    if (this._settings.clearSearchFilter) {
      //this.filter.text = "";
    }
    this.onDropDownClose.emit();
  }

  private deobjectify(item: any) {
    if (typeof item === "string" || typeof item === "number") {
      return new ListItem(item);
    } else {
      return new ListItem({
        id: item[this._settings.idField!],
        text: item[this._settings.textField!],
        tooltip: item[this._settings.tooltipField!],
        isDisabled: item[this._settings.disabledField!]
      })
    }
  }

  getFields(inputData: any) {
    const fields: any = [];
    if (typeof inputData !== "object") {
      return fields;
    }
    // tslint:disable-next-line:forin
    for (const prop in inputData) {
      fields.push(prop);
    }
    return fields;
  }

}
