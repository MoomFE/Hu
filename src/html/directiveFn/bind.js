import directiveFn from '../../static/directiveFn/index';
import $watch from '../../core/prototype/$watch';
import { pushTarget, popTarget } from '../../static/observable/const';


export class BindDirectiveFnClass{
  constructor( part ){
    this.part = part;
  }
  commit( proxy, name ){
    // 并非首次绑定且绑定的对象和上次不一样了
    // 那么对上次的绑定解绑
    if( this.unWatch && ( this.proxy !== proxy || this.name !== name ) ){
      this.unWatch();
    }

    this.proxy = proxy;
    this.name = name;
    this.unWatch = $watch(
      () => proxy[ name ],
      ( value ) => this.part.commit( value ),
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

        pushTarget();

        const proxy = args[ 0 ][ args[ 1 ] ];

        popTarget();

        return bind( proxy, name );
      }
    });
  }
}


const bind = directiveFn( BindDirectiveFnClass );

export default bind;