import directiveFn from '../../static/directiveFn/index';
import $watch from '../../core/prototype/$watch';
import { safety } from '../../static/observable/const';
import isDirectiveFn from '../util/isDirectiveFn';


export class BindDirectiveFnClass{
  constructor( part ){
    this.part = part;
  }
  commit( obj, name ){
    // 并非首次绑定且绑定的对象和上次不一样了
    // 那么对上次的绑定解绑
    if( this.unWatch && ( this.obj !== obj || this.name !== name ) ){
      this.unWatch();
    }

    this.obj = obj;
    this.name = name;
    this.unWatch = $watch(
      () => obj[ name ],
      ( value ) => this.part.commit( value, isDirectiveFn( value ) ),
      {
        immediate: true,
        deep: true
      }
    );
  }
  destroy(){
    this.unWatch();
  }

  static proxy( using, args ){
    return new Proxy( using, {
      get( target, name ){
        if( args.length === 1 ) return bind( args[0], name );
        return safety(() => {
          return bind( args[0][ args[1] ], name );
        });
      }
    });
  }
}


const bind = directiveFn( BindDirectiveFnClass );

export default bind;