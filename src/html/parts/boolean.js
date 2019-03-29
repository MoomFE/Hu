import AttributePart from "./attribute";


export default class BooleanPart extends AttributePart{

  commit(){
    const value = this.value = !!this.value;
    const oldValue = this.oldValue;

    if( value !== oldValue ){
      if( value ){
        this.elem.setAttribute( this.attr , '' );
      }else{
        this.elem.removeAttribute( this.attr );
      }
    }
  }

}