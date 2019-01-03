import isFunction from "../../../shared/global/ZenJS/isFunction";
import warn from "../../console/index";



export default function properties( options ){

  [ 'data', 'props' ].forEach( attr => {
    const value = options[ attr ];

    if( value != null && !isFunction( value ) ){
      warn(`使用 Lit.define 定义组件时, "${ attr }" 参数必须为一个方法 !`);
      options[ attr ] = null;
    }
  });

}