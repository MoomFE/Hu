import { isArray } from "../../shared/global/Array/index";


export default class ModelPart{

  constructor( element ){
    this.elem = element;
  }

  setValue( options ){
    if( !( isArray( options ) && options.length > 1 ) ){
      throw new Error(':model 指令的参数出错, :model 指令不支持此种传参 !');
    }

    this.oldOptions = this.options;
    this.options = options;
  }

  commit(){
    const [ oldProxy, oldName ] = this.oldOptions || [];
    const [ proxy, name ] = this.options;

    if( oldProxy === proxy && oldName === name ){
      return;
    }

    
  }

}