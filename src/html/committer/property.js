import isEqual from "../../shared/util/isEqual";
import AttributeCommitter from "./attribute";


export default class PropertyCommitter extends AttributeCommitter{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem[ this.attr ] = value
    );
  }

}