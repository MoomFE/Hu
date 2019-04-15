import isEqual from "../../shared/util/isEqual";
import BooleanDirective from "../directive/boolean";


export default class PropertyCommitter extends BooleanDirective{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem[ this.attr ] = value
    );
  }

}