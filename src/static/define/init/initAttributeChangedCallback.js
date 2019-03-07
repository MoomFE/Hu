import isEqual from "../../../shared/util/isEqual";


export default propsMap => function( name, oldValue, value ){
  if( value === oldValue ) return;

  /** 当前组件 $props 对象 */
  const { $props } = this.$hu;
  /** 当前属性被改动后需要修改的对应 prop */
  const props = propsMap[ name ];

  for( const { name, from } of props ){
    /** 格式转换后的 value */
    const fromValue = from( value );

    isEqual( $props[ name ], fromValue ) || (
      $props[ name ] = fromValue
    );
  }
}