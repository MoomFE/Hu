import isEqual from '../../shared/util/isEqual';
import TextDirective from './text';


export default class ShowDirective extends TextDirective{

  commit(){
    const { value, oldValue } = this;

    isEqual( value, oldValue ) || (
      this.elem.style.display = value ? '' : 'none'
    );
  }

}