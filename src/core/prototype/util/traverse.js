import { observeProxyMap } from "../../../static/observable/observe";
import each from "../../../shared/util/each";


export default function watchDeeper( value, deep ){
  // 监听对象的观察者对象选项参数
  const options = observeProxyMap.get( value );

  // 监听对象的观察者对象选项参数
  if( options ){
    deep--;

    if( options.isArray ){
      value.forEach( value => {
        if( deep ) watchDeeper( value, deep );
      });
    }else{
      each( value, ( key, value ) => {
        if( deep ) watchDeeper( value, deep );
      });
    }
  }
}