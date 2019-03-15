import { defineInstance } from "../../../static/define/define";


export function Hu(){
  
}

const HuProxy = new Proxy( Hu, {
  construct( target, [ userOptions ] ){
    const $hu = defineInstance( userOptions )
    return $hu;
  }
});

Hu.version = '__VERSION__';

export default HuProxy;