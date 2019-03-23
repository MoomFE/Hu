import rWhitespace from "../../shared/const/rWhitespace";
import { isArray } from "../../shared/global/Array/index";
import each from "../../shared/util/each";
import { has } from "../../shared/global/Reflect/index";


/**
 * 存放上次设置的 class 内容
 */
const classesMap = new WeakMap();

/**
 * 格式化用户传入的 class 内容
 */
function parseClass( classes, value ){
  switch( typeof value ){
    case 'string': {
      value.split( rWhitespace ).forEach( name => {
        return classes[ name ] = true;
      });
      break;
    };
    case 'object': {
      if( isArray( value ) ){
        value.forEach( name => {
          return parseClass( classes, name );
        });
      }else{
        each( value, ( name, truthy ) => {
          return truthy ? parseClass( classes, name )
                        : delete classes[ name ];
        });
      }
    }
  }
}


export default class ClassPart{

  constructor( element ){
    this.element = element;
  }

  setValue( value ){
    parseClass( this.value = {}, value );
  }

  commit(){
    const { value: classes, element: { classList } } = this;

    // 非首次运行
    if( classesMap.has( this ) ){
      const oldClasses = classesMap.get( this );

      // 移除旧 class
      each( oldClasses, name => {
        has( classes, name ) || classList.remove( name );
      });
      // 添加新 class
      each( classes, name => {
        has( oldClasses, name ) || classList.add( name );
      });
    }
    // 首次运行
    else{
      each( classes, name => {
        return classList.add( name );
      })
    }

    // 保存最新的 classes
    classesMap.set( this, classes );
  }

}