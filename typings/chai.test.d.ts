declare const should: Chai.Should;
declare const expect: Chai.ExpectStatic;

/**
 * 返回一个唯一的自定义元素名称
 */
declare const customName: string;

/**
 * 自定义事件的触发
 * @param target 需要触发事件的对象
 * @param type 需要触发的事件名称
 * @param process 其它处理
 */
declare const triggerEvent: ( target: Element, type: String, process: Function ) => void;

interface Window {

  /**
   * 返回一个唯一的自定义元素名称
   */
  customName: string;

  /**
   * 自定义事件的触发
   * @param target 需要触发事件的对象
   * @param type 需要触发的事件名称
   * @param process 其它处理
   */
  triggerEvent( target: Element, type: String, process: Function ): void;

}