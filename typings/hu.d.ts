
type KEYTYPE = string | number | symbol;

/* ------------------ Hu 实例对象定义 ------------------ */

/**
 * Hu 实例对象
 */
interface $hu {

  /**
   * Hu 实例的 Shadow DOM ( 阴影 DOM ) 节点
   */
  readonly $el: ShadowRoot;

  /**
   * Hu 实例的自定义元素节点
   */
  readonly $customElement: Element;

  /**
   * Hu 实例属性对象
   * - 包含了声明自定义元素时的 props 属性上定义的所有属性
   */
  readonly $props: Record< KEYTYPE, any >;
  /**
   * Hu 实例方法对象
   * - 包含了声明自定义元素时的 methods 属性上定义的所有方法
   */
  readonly $methods: Record< KEYTYPE, any >;
  /**
   * Hu 实例数据对象
   * - 包含了声明自定义元素时的 data 方法返回的所有属性
   */
  readonly $data: Record< KEYTYPE, any >;
  /**
   * Hu 实例计算属性对象
   * - 包含了声明自定义元素时的 computed 属性上定义的所有的计算属性
   */
  readonly $computed: Record< KEYTYPE, any >;

  /**
   * 观察 Hu 实例变化的一个键路径表达式或计算属性函数
   * @param expOrFn 值可以是:
   *            - 需要监听的一个键路径表达式, 每当值变化时, 会调用回调函数
   *            - 需要监听的一个计算属性函数, 每当返回值得出一个不同的结果时, 会调用回调函数
   * @param callback 回调函数得到的参数为新值和旧值
   * @param options 监听选项
   * @returns 返回一个方法, 运行以取消监听
   */
  readonly $watch( expOrFn: string | (() => any), callback: ( value, oldValue ) => void, options: WatchOptions ): () => void;

  /**
   * 迫使 Hu 实例重新渲染
   */
  readonly $forceUpdate(): void;
}

interface Element {
  /**
   * Hu 实例对象
   */
  $hu: $hu
}

/* ------------------ Hu 静态对象定义 ------------------ */

/**
 * Hu 静态对象
 */
interface Hu{

  /**
   * 定义一个全局的自定义元素
   * @param name 自定义元素的名称
   * @param options Hu 实例控制自定义元素行为的选项对象
   */
  define( name: string, options: LitOptions ): void;

  /**
   * 释放 window.Hu 的控制权, 还原到定义 Hu 之前
   */
  noConflict(): Hu;

  /**
   * 方法会返回一个可响应的对象代理, Hu 内部会用它来处理 data 函数返回的对象
   * - 返回的可响应的对象代理可以直接用于渲染函数和计算属性内, 并且会在发生改变时触发相应的更新
   * - 而对源对象直接进行修改将是不可响应的
   * - 也可以作为最小化的跨组件状态存储器
   * @param obj
   */
  observable<T>( obj: T ): T;

  /**
   * 用于创建模板字面量的对象
   * @param strings
   * @param values
   */
  html( strings: TemplateStringsArray, ...values: unknown[] ): TemplateResult;

  /**
   * 将 Hu.html 创建出的模板字面量挂载到指定 DOM 节点
   * @param result Hu.html 的返回值
   * @param container 挂载目标
   * @param options.templateFactory
   * @param options.eventContext
   */
  render( result: TemplateResult, container: Element | DocumentFragment, options?: { templateFactory?: TemplateFactory, eventContext?: EventTarget }): void;

}

declare const Hu: Hu;

interface Window {
  /**
   * Hu 静态对象
   */
  Hu: Hu
}

/* ------------------ Hu 实例选项对象 ------------------ */

type fromAttribute = ( value: string | null ) => any;
type toAttribute = ( value: any ) => string | null;

interface LitOptions{

  /**
   * 声明需要从自定义标签上接收哪些属性
   */
  props?: KEYTYPE[] | {
    [ key: string ]: fromAttribute | PropOptions;
    [ key: number ]: fromAttribute | PropOptions;
    [ key: symbol ]: fromAttribute | PropOptions;
  };

  /**
   * 定义一系列的方法以在 Hu 实例中使用
   */
  methods?: {
    [ key: string ]: ( this: $hu, ...args: any[] ) => any;
    [ key: number ]: ( this: $hu, ...args: any[] ) => any;
    [ key: symbol ]: ( this: $hu, ...args: any[] ) => any;
  };

  /**
   * 返回 Hu 实例的初始数据对象的函数
   */
  data?( this: $hu ): {
    [ key: string ]: any;
    [ key: number ]: any;
    [ key: symbol ]: any;
  };

  /**
   * 定义一系列的计算属性, 会自动计算依赖, 根据依赖自动更新值
   */
  computed?: {
    [ key: string ]: (( this: $hu ) => any) | ComputedOptions;
    [ key: number ]: (( this: $hu ) => any) | ComputedOptions;
    [ key: symbol ]: (( this: $hu ) => any) | ComputedOptions;
  };

  /**
   * 定义需要监听的属性
   *  - 键是需要观察的表达式
   *  - 值是回调函数或者一个包含选项的对象
   */
  watch?: {
    [ key: string ]: (( value, oldValue ) => void) | WatchOptions;
    [ key: number ]: (( value, oldValue ) => void) | WatchOptions;
  };

  /**
   * Hu 实例的渲染函数
   * @param html 用于创建模板字面量的对象
   */
  render?( this: $hu, html: ( strings: TemplateStringsArray, ...values: unknown[] ) => TemplateResult ): TemplateResult;

  /**
   * 在实例初始化后立即调用, computed, watch 还未初始化
   */
  beforeCreate?( this: $hu );

  /**
   * 在实例创建完成后被立即调用, 挂载阶段还没开始
   */
  created?( this: $hu );

  /**
   * 在自定义元素挂载开始之前被调用
   */
  beforeMount?( this: $hu );

  /**
   * 在自定义元素挂载开始之后被调用, 组件 DOM 已挂载
   */
  mounted?( this: $hu );

}

interface ComputedOptions {
  /** 计算属性的 getter */
  get( this: $hu ): any;
  /** 计算属性的 setter */
  set( this: $hu ): void;
}

interface PropOptions<T=any> {
  /**
   * 定义当前 prop 的需要从哪个 attribute 上取值
   */
  attr?: string | number,
  /**
   * 定义当前 prop 的类型, 可传入自定义方法用于转换从 attribute 上的取值
   */
  type?: fromAttribute | {
    /**
     * 定义当前 prop 的类型, 可传入自定义方法定义如何从 attribute 转换为当前 prop 值
     */
    from: fromAttribute;
    /**
     * 定义如何从当前 prop 值转换为 attribute ( 当前不可用 )
     */
    to: toAttribute;
  },
  /**
   * 定义当前 prop 的默认值
   * - 如果创建当前自定义元素时未定义属于当前 prop 的 attribute 时, 则取当前默认值
   */
  default?: string | number | boolean | null | undefined | (() => any)
}

interface WatchOptions {
  /**
   * 对象内部值变化时也触发回调函数
   */
  deep?: false;
  /**
   * 立即触发回调
   */
  immediate?: false;
  /**
   * 回调函数得到的参数为新值和旧值
   */
  handler?: ( value, oldValue ) => void
}

/* ------------------ Hu-HTML ------------------ */

class TemplateResult{
  strings: TemplateStringsArray;
  values: unknown[];
  type: string;
  processor: TemplateProcessor;

  getHTML(): string;
  getTemplateElement(): HTMLTemplateElement;
}