declare const should: Chai.Should;
declare const expect: Chai.ExpectStatic;

/**
 * 返回一个唯一的自定义元素名称
 */
declare const customName: string;

interface Window {

  /**
   * 返回一个唯一的自定义元素名称
   */
  customName: string;

}