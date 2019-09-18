import directiveFn from '../../static/directiveFn/index';
import $watch from '../../core/prototype/$watch';


export class bind{
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
}

export default directiveFn( bind );