import TextDirective from "./text";
import isEqual from "../../shared/util/isEqual";


export default class HtmlDirective extends TextDirective{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem.innerHTML = value
    );
  }

}