import rWhitespace from "../../shared/const/rWhitespace";
import isArray from "../../shared/global/Array/isArray";
import each from "../../shared/util/each";



const classesMap = new WeakMap();


export class ClassPart{

  constructor( element ){
    this.element = element;
  }

  parse( classes, value ){
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
            return this.parse( classes, name );
          });
        }else{
          each( value, ( name, truthy ) => {
            return truthy ? this.parse( classes, name )
                          : delete classes[ name ];
          });
        }
      }
    }
  }

  setValue( value ){
    this.parse( this.value = {}, value );
  }

  commit(){
    const { value: classes, element: { classList } } = this;

    // 非首次运行
    if( classesMap.has( this ) ){
      const oldClasses = classesMap.get( this );

      // 移除旧 class
      each( oldClasses, name => {
        name in classes || classList.remove( name );
      });
      // 添加新 class
      each( classes, name => {
        name in oldClasses || classList.add( name );
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