import { userDirectives, directives } from "../../html/const/index";
import isDirective from "../../html/util/isDirective";


export default ( id, directiveClass ) => {
  
  // 获取已注册的指令
  if( !directiveClass ){
    return userDirectives[ id ] || directives[ id ];
  }

  // 注册指令
  userDirectives[ id ] = directiveClass;

}


/**
 * 指令范例
 */
class directiveClass{

  /**
   * 指令初始化时调用
   * @param {Element} element 指令所绑定的元素, 可以用来直接操作 DOM
   * @param {string} name 指令名, 不包括 `:` 前缀
   * @param {string[]} strings 有时同一个指令可能是允许使用多个插值绑定的, 该变量就包含了内容中除了插值绑定的部分
   *  - 例如: `:name=${ 'Hu.js' }` 是单个插值绑定的写法, 此时 `string` 将会是 `[ '', '' ]`
   *  - 例如: `:name="${ 'My' } name is ${ 'Hu' }.js"` 是多个插值绑定的写法, 此时 `string` 将会是 `[ '', ' name is ', '.js' ]`
   * @param {{}} modifier 一个包含修饰符的对象
   *  - 例如: `:name` 中, 修饰符对象为: `{}`
   *  - 例如: `:name.foo.bar` 中, 修饰符对象为: `{ foo: true, bar: true }`
   */
  constructor( element, name, strings, modifier ){

    /**
     * 在使用多个插值绑定的情况下
     * 就需要返回多个指令类去单独处理每个插值绑定的部分
     * 生成的多个指令类存储在 `parts` 实例属性中
     * 在实例化当前指令类时
     * 如果指令类拥有 `parts` 实例属性将返回 `parts` 内的所有指令类
     */
    this.parts = [];

  }

  /**
   * 指令被设置值时调用, 有以下情况
   *  1. 正常传值调用
   *  2. 传递指令方法的调用
   *     - 传递指令方法时, 需要将当前指令类传递给指令方法, 然后退出当前方法,
   *       指令方法会将用户的输入处理, 然后使用正常传值调用的方式再次调用当前方法
   * @param {any} value 
   */
  commit( value ){
    if( isDirective( value ) ) return value( this );
  }

  /**
   * 当前指令被释放时调用
   */
  destroy(){

  }

}