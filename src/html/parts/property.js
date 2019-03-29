import isEqual from "../../shared/util/isEqual";
import AttributePart from "./attribute";


export default class PropertyPart extends AttributePart{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem[ this.attr ] = value
    );
  }

}