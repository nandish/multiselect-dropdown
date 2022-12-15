export class ListItem {
    id: String | number;
    text: String | number;
    tooltip?: String | undefined;
    isDisabled?: boolean;

    public constructor(source: any) {
        if (typeof source === 'string' || typeof source === 'number') {
            this.id = this.text = source;
            this.isDisabled = false;
        } else {
            this.id = source.id;
            this.text = source.text;
            this.tooltip = source.tooltip;
            this.isDisabled = source.isDisabled;
        }
    }
}