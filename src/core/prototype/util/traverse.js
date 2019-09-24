import { observeProxyMap } from "../../../static/observable/observe";
import { targetStack } from "../../../static/observable/const";
import each from "../../../shared/util/each";


const seen = new Set;

export default ( value, deep ) => {
  traverse( value, deep );
  seen.clear();
};

function traverse( value, deep ){
  // 监听对象的观察者对象选项参数
  const options = observeProxyMap.get( value );

  // 只有观察者对象才能响应深度监听
  if( options ){

    // 检查当前对象是否已经建立了监听, 防止监听无限引用的对象时的死循环
    if( seen.has( value ) ){
      return;
    }
    // 保存建立了监听的对象
    seen.add( value );

    // 标记监听订阅信息
    if( --deep ){
      if( options.isArray ){
        value.forEach( value => traverse( value, deep ) );
      }else{
        each( value, ( key, value ) => traverse( value, deep ) );
      }
    }else{
      options.deepSubs.add( targetStack.target );
    }
  }
}