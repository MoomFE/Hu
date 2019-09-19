
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
   * - 包含了声明实例时的 props 属性上定义的所有属性
   */
  readonly $props: Record< KEYTYPE, any >;
  /**
   * Hu 实例方法对象
   * - 包含了声明实例时的 methods 属性上定义的所有方法
   * - 非响应式对象
   */
  readonly $methods: Record< KEYTYPE, any >;
  /**
   * Hu 实例数据对象
   * - 包含了声明实例时的 data 方法返回的所有属性
   */
  readonly $data: Record< KEYTYPE, any >;
  /**
   * Hu 实例计算属性对象
   * - 包含了声明实例时的 computed 属性上定义的所有的计算属性
   */
  readonly $computed: Record< KEYTYPE, any >;
  /**
   * Hu 实例初始化选项
   * - 只读
   * - 包含了 Hu 的初始化选项
   * - 需要在初始化选项中包含自定义属性时会有用处
   */
  readonly $options: Record< KEYTYPE, any >;
  /**
   * Hu 实例信息选项
   * - 只读
   * - 包含了当前实例的各种信息及状态
   */
  readonly $info: {
    /**
     * 当前实例的 UID
     *  - 在由 new 创建的实例中, uid 和 name 是相同的
     */
    uid: String
    /**
     * 当前自定义元素的名称
     *  - 在由 new 创建的实例中, name 是自动生成的名称
     */
    name: String;
    /**
     * 标识当前实例的首次挂载是否已完成
     */
    isMounted: Boolean;
    /**
     * 标识当前实例是否是自定义元素
     */
    isCustomElement: Boolean;
    /**
     * 标识当前自定义元素是否在文档流中
     * - 如果是使用 new 创建的实例, 则作用和 isMounted 一致
     */
    isConnected: Boolean
  };
  /**
   * 一个持有注册过 ref 引用特性的所有 DOM 元素的对象
   * - 非响应式对象
   */
  readonly $refs: {
    [ key: string ]: Element | Element[]
  };
  /**
   * 为当前实例的根实例
   *  - 若当前实例没有父实例, $root 选项会是自己
   */
  readonly $root: $hu;
  /**
   * 当前实例的父实例
   */
  readonly $parent: $hu | undefined;
  /**
   * 当前实例的直接子组件
   *  - $children 并不保证顺序且不是响应式的
   */
  readonly $children: $hu[];
  /**
   * 在下次 DOM 更新循环结束之后执行回调, 在修改数据之后立即使用这个方法, 可以获取更新后的 DOM
   * @param callback 需要执行的回调
   */
  readonly $nextTick( callback: ( this: $hu ) => void ): void;
  /**
   * 返回一个 Promise 对象, 在下次 DOM 更新循环结束之后执行, 在修改数据之后立即使用这个方法, 可以获取更新后的 DOM
   */
  readonly $nextTick(): Promise;

  /**
   * 观察 Hu 实例变化的一个键路径表达式或计算属性函数
   * @param expOrFn 值可以是:
   *            - 需要监听的一个键路径表达式, 每当值变化时, 会调用回调函数
   *            - 需要监听的一个计算属性函数, 每当返回值得出一个不同的结果时, 会调用回调函数
   * @param callback 回调函数得到的参数为新值和旧值
   * @param options 监听选项
   * @returns 返回一个方法, 运行以取消监听
   */
  readonly $watch( expOrFn: string | (() => any), callback: ( this: $hu, value, oldValue ) => void, options: WatchOptions ): () => void;

  /**
   * 观察 Hu 实例变化的一个键路径表达式或计算属性函数
   * @param expOrFn 值可以是:
   *            - 需要监听的一个键路径表达式, 每当值变化时, 会调用回调函数
   *            - 需要监听的一个计算属性函数, 每当返回值得出一个不同的结果时, 会调用回调函数
   * @param options 监听选项
   * @returns 返回一个方法, 运行以取消监听
   */
  readonly $watch( expOrFn: string | (() => any), options: WatchOptions ): () => void;

  /**
   * 如果 Hu 实例在实例化时没有收到 el 选项, 则它处于"未挂载"状态, 没有关联的 DOM 元素. 可以使用 hu.$mount() 手动地挂载一个未挂载的实例
   * @param elementOrSelector 提供一个在页面上已存在的 DOM 元素作为 Hu 实例的挂载目标. 可以是 CSS 选择器或是一个 HTMLElement 实例
   * @returns 返回实例自身
   */
  readonly $mount( elementOrSelector: Element | string ): this;

  /**
   * 迫使 Hu 实例重新渲染
   */
  readonly $forceUpdate(): void;

  /**
   * 监听当前实例上的自定义事件
   * - 事件可以由 hu.$emit 触发
   * - 回调函数会接收所有传入事件触发函数的额外参数
   * @param type 事件名称
   * @param fn 事件触发时调用的监听器
   */
  readonly $on( type: string | string[], fn: () => void ): this;

  /**
   * 监听当前实例上的自定义事件, 但是只触发一次, 在第一次触发之后移除监听器
   * @param type 事件名称
   * @param fn 事件触发时调用的监听器
   */
  readonly $once( type: string, fn: () => void ): this;

  /**
   * 移除当前实例上的自定义事件监听器
   * - 如果没有提供参数, 则移除所有的事件监听器
   * - 如果只提供了事件, 则移除该事件所有的监听器
   * - 如果同时提供了事件与回调, 则只移除这个回调的监听器
   * @param type 事件名称
   * @param fn 需要移除的事件监听器
   */
  readonly $off( type: string | string[], fn: () => void ): this;

  /**
   * 触发当前实例上的事件, 附加参数都会传给监听器回调
   * @param type 事件名称
   * @param args 需要传递给事件监听器的参数
   */
  readonly $emit( type: string, ...args: any[] ): this;

  /**
   * 完全销毁一个实例
   * - 解绑它的全部指令及事件监听器
   * - 将触发 beforeDestroy 和 destroyed 生命周期方法
   */
  readonly $destroy();
}

interface Element {

  /**
   * Hu 实例对象
   */
  readonly $hu: $hu;

  /**
   * 监听当前实例上的自定义事件
   * - 事件可以由 hu.$emit 触发
   * - 回调函数会接收所有传入事件触发函数的额外参数
   * @param type 事件名称
   * @param fn 事件触发时调用的监听器
   */
  readonly $on( type: string | string[], fn: () => void ): this;

  /**
   * 监听当前实例上的自定义事件, 但是只触发一次, 在第一次触发之后移除监听器
   * @param type 事件名称
   * @param fn 事件触发时调用的监听器
   */
  readonly $once( type: string, fn: () => void ): this;

  /**
   * 移除当前实例上的自定义事件监听器
   * - 如果没有提供参数, 则移除所有的事件监听器
   * - 如果只提供了事件, 则移除该事件所有的监听器
   * - 如果同时提供了事件与回调, 则只移除这个回调的监听器
   * @param type 事件名称
   * @param fn 需要移除的事件监听器
   */
  readonly $off( type: string | string[], fn: () => void ): this;

}

/* ------------------ Hu 静态对象定义 ------------------ */

/**
 * 指令类
 */
class DirectiveClass {

  /**
   * 指令初始化时调用
   * @param element 指令所绑定的元素, 可以用来直接操作 DOM
   * @param strings 有时同一个指令可能是允许使用多个插值绑定的, 该变量就包含了内容中除了插值绑定的部分
   *  - 例如: `:name=${ 'Hu.js' }` 是单个插值绑定的写法, 此时 `string` 将会是 `[ '', '' ]`
   *  - 例如: `:name="${ 'My' } name is ${ 'Hu' }.js"` 是多个插值绑定的写法, 此时 `string` 将会是 `[ '', ' name is ', '.js' ]`
   * @param modifiers 一个包含修饰符的对象
   *  - 例如: `:name` 中, 修饰符对象为: `{}`
   *  - 例如: `:name.foo.bar` 中, 修饰符对象为: `{ foo: true, bar: true }`
   */
  constructor( element: Element, strings: string[], modifiers: {} ): void;

  /**
   * 指令被设置值时调用, 有以下情况
   *  1. 正常传值调用
   *  2. 传递指令方法的调用
   *     - 传递指令方法时, 需要将当前指令类传递给指令方法, 然后退出当前方法,
   *       指令方法会将用户的输入处理, 然后使用正常传值调用的方式再次调用当前方法
   * @param value 用户传入值
   * @param isDirectiveFn 用户传入值是否是指令方法
   */
  commit( value: any, isDirectiveFn: boolean ): void;

  /**
   * 当前指令被释放时调用
   */
  destroy(): void;

}

/**
 * 指令方法类
 */
class DirectiveFnClass {

  /**
   * 指令方法初始化时调用
   * @param part 指令方法被应用的组件
   */
  constructor( part: DirectiveClass ): void;

  /**
   * 指令方法在被应用或更新时调用
   * @param args 用户向指令方法传入的参数
   */
  commit( ...args: any[] ): void;

  /**
   * 当前指令方法被释放时调用
   */
  destroy(): void;

  /**
   * 用于代理指令方法的使用步骤
   */
  static proxy();

}

const pluginInstall = ( Hu: Hu, privateOptions: {}, ...args: any[] ) => {

}


/**
 * Hu 静态对象
 */
interface Hu{

  /**
   * @param options Hu 实例控制元素行为的选项对象
   */
  new( options: ComponentOptions ): $hu;

  /**
   * 定义一个全局的自定义元素
   * @param name 自定义元素的名称
   * @param options Hu 实例控制自定义元素行为的选项对象
   */
  define( name: string, options: ComponentOptions ): void;

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
  html: html;

  /**
   * 将 Hu.html 创建出的模板字面量挂载到指定 DOM 节点
   * @param result Hu.html 的返回值
   * @param container 挂载目标
   * @param options.templateFactory
   * @param options.eventContext
   */
  render( result: TemplateResult, container: Element | DocumentFragment, options?: { templateFactory?: TemplateFactory, eventContext?: EventTarget }): void;

  /**
   * 注册全局指令
   * @param name 指令名称
   * @param directive 指令类
   */
  directive( name: string, DirectiveClass: DirectiveClass ): void;

  /**
   * 获取已注册的全局指令
   * @param name 指令名称
   * @param directive 指令类
   */
  directive( name: string ): DirectiveClass | undefined;

  /**
   * 注册指令方法
   */
  directiveFn( DirectiveFnClass: DirectiveFnClass ): () => {};

  /**
   * 字符串形式的 Hu 安装版本号
   */
  version: string;

  /**
   * 在下次 DOM 更新循环结束之后执行回调, 在修改数据之后立即使用这个方法, 可以获取更新后的 DOM
   * @param callback 需要执行的回调
   * @param context 回调的 this 对象
   *
   */
  nextTick<T>( callback: ( this: T ) => void, context: T ): void;
  /**
   * 返回一个 Promise 对象, 在下次 DOM 更新循环结束之后执行, 在修改数据之后立即使用这个方法, 可以获取更新后的 DOM
   */
  nextTick<T>( context: T ): Promise<T>;

  /**
   * 共享出来的部分内部使用的方法
   */
  util: {

    /**
     * 绑定事件
     * @param elem 绑定事件的元素对象
     * @param type 事件名称
     * @param listener 事件回调
     * @param options 事件修饰符
     */
    addEvent( elem: Element, type: string, listener: function, options: boolean | {} ): void;

    /**
     * 解绑事件
     * @param elem 解绑事件的元素对象
     * @param type 事件名称
     * @param listener 事件回调
     * @param options 事件修饰符
     */
    removeEvent( elem: Element, type: string, listener: function, options: boolean | {} ): void;

    /**
     * 对象遍历方法
     *  - 和 jQuery 的 each 方法不同, 遍历过程无法通过返回 false 进行中断
     *  - 就是个普通的对象遍历方法
     * @param obj 
     * @param callback 
     */
    each( obj: {}, callback: function ): void;

    /**
     * 创建一个干净的目标对象, 并把传入方法的对象全部浅拷贝到目标对象并返回目标对象
     *  - 创建出来的对象没有原型对象
     *  - 相当于 `Object.assign( Object.create( null ), ...args );`
     * @param args 需要继承到目标对象的一些对象
     */
    create( ...args: {}[] ): {},

    /**
     * 将值转为字符串形式
     *  - `null` 和 `undefined` 将转为 `''`
     *  - 数组 `[]` 和对象 `{}` 将使用 `JSON.stringify` 进行转换
     *  - 其余类型将直接使用 `String( value )` 进行转换
     * @param value 需要转换的对象
     */
    toString( value: any ): string,

    /**
     * 判断传入对象是否是纯粹的对象
     * @param obj 需要判断的对象
     */
    isPlainObject( obj: any ): boolean;

    /**
     * 判断传入对象是否是一个空对象
     * @param obj 需要判断的对象
     */
    isEmptyObject( obj: any ): boolean;

    /**
     * 判断传入对象是否是原始对象
     * @param obj 需要判断的对象
     */
    isPrimitive( obj: any ): boolean;

    /**
     * 判断传入对象是否可迭代
     *  - 判断传入对象是否可以使用 `for...of` 进行迭代
     * @param value 需要判断的对象
     */
    isIterable( value ): boolean,

    /**
     * 判断传入的两个值是否相等
     *  - 用于避免 NaN !== NaN 的问题
     * @param value 需要判断的对象
     * @param value2 需要判断的对象
     */
    isEqual( value, value2 ): boolean;

    /**
     * 判断传入的两个值是否不相等
     *  - 用于避免 NaN !== NaN 的问题
     *  - isEqual 的翻转方法
     * @param value 需要判断的对象
     * @param value2 需要判断的对象
     */
    isNotEqual,

    /**
     * 判断传入对象是否是 String 类型
     * @param obj 需要判断的对象
     */
    isString( obj: any ): boolean;

    /**
     * 判断传入对象是否是 Object 类型且不为 null
     * @param obj 需要判断的对象
     */
    isObject( obj: any ): boolean;

    /**
     * 判断传入对象是否是 Function 类型
     * @param obj 需要判断的对象
     */
    isFunction( obj: any ): boolean;

    /**
     * 判断传入对象是否是 Symbol 类型
     * @param obj 需要判断的对象
     */
    isSymbol( obj: any ): boolean;

    /**
     * 返回一个字符串 UID
     */
    uid(): string;

    /**
     * 用于防止方法执行时被依赖收集
     * @param fn 需要执行的方法
     */
    safety<T>( fn: () => T ): T;

  },

  /**
   * 用于给 Hu 安装插件, 提供了一些内部使用的变量
   * @param plugins 需要安装的插件
   * @param args 需要传递给插件的选项
   */
  use(
    plugin: pluginInstall | { pluginInstall },
    ...args: any[]
  ): Hu;

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

interface ComponentOptions{

  /**
   * 提供一个在页面上已存在的 DOM 元素作为 Hu 实例的挂载目标. 可以是 CSS 选择器或是一个 HTMLElement 实例
   * - 只在由 new 创建的实例中使用
   */
  el?: Element | string;

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
    [ key: string ]: (( this: $hu, value, oldValue ) => void) | WatchOptions;
    [ key: number ]: (( this: $hu, value, oldValue ) => void) | WatchOptions;
  };

  /**
   * 指定当前实例的样式
   *  - 在使用 polyfill 的环境下, 可以解决自定义元素样式无法生效的问题
   */
  styles?: string | string[];

  /**
   * Hu 实例的渲染函数
   * @param html 用于创建模板字面量的对象
   */
  render?( this: $hu, html: html ): TemplateResult;

  /**
   * 实例初始化后被调用
   *  - 计算属性 computed 和数据监听 watch 还未初始化
   */
  beforeCreate?( this: $hu );

  /**
   * 实例创建完成后被调用
   *  - 但是挂载还未开始
   */
  created?( this: $hu );

  /**
   * 首次挂载开始之前被调用
   *  - 对于自定义元素, 会在被添加到文档流时调用
   *  - 对于自定义元素, 会在 mounted 及 connected 钩子之前执行
   */
  beforeMount?( this: $hu );

  /**
   * 首次挂载之后被调用
   *  - 对于自定义元素, 会在被添加到文档流时调用
   *  - 对于自定义元素, 会在 connected 钩子之前执行
   */
  mounted?( this: $hu );

  /**
   * 实例销毁之前调用
   *  - 此时实例完全可用
   */
  beforeDestroy?( this: $hu );

  /**
   * 实例销毁后调用
   */
  destroyed?( this: $hu );

  /**
   * 自定义元素被添加到文档流 ( 自定义元素独有 )
   *  - 此时实例完全可用
   */
  connected?( this: $hu );

  /**
   * 自定义元素被移动到新文档时调用 ( 自定义元素独有 )
   *  - 只在无需 polyfill 的环境下可用
   *  - 此时实例完全可用
   * @param newDocument 被移动到的新文档 document 引用
   * @param oldDocument 被移动到的旧文档 document 引用
   */
  adopted?( this: $hu, newDocument: Document, oldDocument: Document );

  /**
   * 自定义元素被从文档流移除 ( 自定义元素独有 )
   *  - 此时实例完全可用
   */
  disconnected?( this: $hu );

  /**
   * 选项接受一个混入对象的数组, 这些混入实例对象可以像正常的实例对象一样包含选项
   *  - 举例: 如果你的混入包含一个生命周期方法而创建组件本身也有一个, 两个函数将被调用
   *  - Mixin 生命周期方法按照传入顺序依次调用, 并在调用组件自身的生命周期方法之前被调用
   */
  mixins: ComponentOptions[];

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
   *  - 如果创建当前自定义元素时未定义属于当前 prop 的 attribute 时, 则取当前默认值
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
  handler?: ( this: $hu, value, oldValue ) => void
}

/* ------------------ Lit-HTML ------------------ */

interface html{
  /**
   * 用于创建模板字面量的对象
   * @param strings
   * @param values
   */
  ( strings: TemplateStringsArray, ...values: unknown[] ): TemplateResult;

  /**
   * 渲染数组时使用, 若数组发生变动, 将基于 key 的变化重新排列元素顺序而不是替换元素
   * @param items 需要遍历的数组
   * @param key 数组的 key 或者一个可以返回 key 的函数 ( key 必须是在当前数组中是唯一的 )
   * @param template 遍历数组的回调方法
   */
  repeat<T>(
    items: T[],
    key: string | ((T) => string),
    template: ( item: T, index: number, items: T[] ) => TemplateResult | undefined
  );

  /**
   * 将内容按普通 HTML 不转义直接插入到当前位置
   *  - 在网站上动态渲染任意 HTML 是非常危险的, 因为容易导致 XSS 攻击
   *  - 只在可信内容上使用 unsafe, 永不用在用户提交的内容上
   * @param value
   */
  unsafe( value: string );

  /**
   * 将元素属性或内容与观察者对象的目标对象绑定, 若观察者对象的目标对象更新, 元素属性也会更新
   *  - 和常规绑定相比, 若是使用此方法绑定的元素属性或内容, 变量更新时可以不触发整体重新渲染
   *  - 纯渲染实例可以使用此方法达到和常规绑定一样的体验
   *  - 和常规绑定一样, 观察者对象的目标对象更新后, 属性值会在下一 tick 进行更新, 可以使用 nextTick 方法获取更新后的值
   * @param obj 观察者对象
   * @param name 目标对象名称
   */
  bind( obj: any, name: string | number | symbol );

}

class TemplateResult{
  strings: TemplateStringsArray;
  values: unknown[];
  type: string;

  getHTML(): string;
  getTemplateElement(): HTMLTemplateElement;
}