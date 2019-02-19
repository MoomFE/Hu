/**
 * Lit 实例控制自定义元素行为的选项对象
 */
interface LitOptions {

  props: string[],

  /**
   * 返回 Lit 实例的初始数据对象的函数
   */
  data(): {};

}



/* ------------------ Lit 实例对象定义相关 ------------------ */

// interface $lit {
//   readonly $data: Record< string, any >;
//   readonly $props: Record< string, any >;
//   readonly $methods: Record< string, function >;
// }

/* ------------------ Lit 静态对象定义相关 ------------------ */

/**
 * Lit 静态对象
 */
interface Lit{

  /**
   * 定义一个全局的自定义元素
   * @param name 自定义元素的名称
   * @param options Lit 实例控制自定义元素行为的选项对象
   */
  define( name: string, options: LitOptions ): void;

}

declare const Lit: Lit;

interface Window {
  /**
   * Lit 静态对象
   */
  Lit: Lit
}