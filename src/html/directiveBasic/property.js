import isEqual from "../../shared/util/isEqual";
import BasicBooleanDirective from "./boolean";


export default class BasicPropertyDirective extends BasicBooleanDirective{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem[ this.attr ] = value
    );
  }

}