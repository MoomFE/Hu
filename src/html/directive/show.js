import TextDirective from './text';


export default class ShowDirective extends TextDirective{

  commit(){
    this.elem.style.display = this.value ? '' : 'none'
  }

}