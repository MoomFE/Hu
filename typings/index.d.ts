
type KEYTYPE = string | number | symbol;

/* ------------------ Lit 实例对象定义 ------------------ */

interface $lit {
  readonly $data: Record< KEYTYPE, any >;
  readonly $props: Record< KEYTYPE, any >;
  readonly $methods: Record< KEYTYPE, any >;
}

interface Element {
  $lit: $lit
}

/* ------------------ Lit 静态对象定义 ------------------ */

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

/* ------------------ Lit 实例选项对象 ------------------ */

/**
 * Lit 实例控制自定义元素行为的选项对象
 */
interface LitOptions{

  /**
   * 声明需要从自定义标签上接收哪些属性
   */
  props?: KEYTYPE[] | {
    [ key: string ]: (( value: any ) => any) | PropOptions;
    [ key: number ]: (( value: any ) => any) | PropOptions;
    [ key: symbol ]: (( value: any ) => any) | PropOptions;
  };

  /**
   * 返回 Lit 实例的初始数据对象的函数
   */
  data?( this: $lit ): {
    [ key: string ]: any;
    [ key: number ]: any;
    [ key: symbol ]: any;
  };

  methods: {
    [ key: string ]: ( this: $lit, ...args: any[] ) => any;
    [ key: number ]: ( this: $lit, ...args: any[] ) => any;
    [ key: symbol ]: ( this: $lit, ...args: any[] ) => any;
  };

}


interface PropOptions {
  type?: (( value: any ) => any) | PropOptionsType
}

interface PropOptionsType {
  from: ( value: any ) => any;
  to: ( value: any ) => any;
}