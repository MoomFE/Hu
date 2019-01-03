interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}

interface ArrayConstructor {

  /**
   * 创建一个新的数组, 将传入数组按照指定的长度进行分割, 如果数组不能均分, 则最后的数组中是数组剩余的元素
   * @param array 需要进行分割的数组
   * @param size 分割的长度
   */
  $chunk<T>( array: T[], size: number ): T[][];

  /**
   * 传入一个数组, 返回一个新的数组 ( 浅拷贝 )
   * @param source 需要复制的数组
   * @param array 将需要复制的数组合并到这个数组后进行返回, 返回的依旧是一个新的数组
   */
  $copy<T>( source: T[], array: any[] ): T[];

  /**
   * 快捷创建数组
   * @param length 需要创建的数组的长度
   * @param insert 需要填充到数组中的内容
   */
  $create<T>( length: number, insert: T ): T[];

  /**
   * 快捷创建数组
   * @param length 需要创建的数组的长度
   * @param insert 会向方法内传入当前数组创建进度的 index， 然后将方法的返回值填充到数组中
   * @param isInsert 若值为真, 则不执行方法, 直接将方法作为填充内容 - default: false
   */
  $create<T>( length: number, insert: ( index: number ) => T, isInsert?: boolean ): T[];

  /**
   * 调用传入方法遍历传入数组
   * @param array 需要进行遍历的数组
   * @param callback 遍历数组时调用的方法, 方法返回 false 时, 将终止后续遍历
   */
  $each<T>( array: T[], callback: ( value: T, index: number, arr: T[] ) => boolean ): T[];

  /**
   * 比较两个数组的内容是否相同, 与 boolean.$equals 不同, 比较的两个数组可以是类数组对象
   * @param array 进行比较的第一个数组
   * @param array2 进行比较的第二个数组
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $equals<T,U>( array: ArrayLike<T>, array2: ArrayLike<U>, predicate: Function | boolean ): boolean;

  /**
   * 判断传入对象是否是一个类数组对象
   * @param value 需要判断的对象
   */
  $isArrayLike<T>( value: ArrayLike<T> ): boolean;

  /**
   * 将传入参数转为数组
   * @param value 需要转为数组的对象
   * @param transKey json 对象转数组时使用, 是否将传入对象的 key 转为数组 ( 默认是 value ) - default: false
   */
  $toArray<T>( value: ArrayLike<T>, transKey?: false ): T[];

}


interface Array<T> {

  /**
   * 创建一个新的数组, 将数组按照指定的长度进行分割, 如果数组不能均分, 则最后的数组中是数组剩余的元素
   * @param size 分割的长度
   */
  $chunk( size: number ): this[];

  /**
   * 调用传入方法遍历当前数组
   * @param callback 遍历数组时调用的方法, 方法返回 false 时, 将终止后续遍历
   */
  $each( callback: ( value: T, index: number, arr: T[] ) => boolean ): this;

  /**
   * 比较当前数组和目标数组的内容是否相同, 与 boolean.$equals 不同, 比较的两个数组可以是类数组对象
   * @param array 进行比较的数组
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $equals( array: ArrayLike<T>, predicate: Function | boolean ): boolean;

  /**
   * 在数组指定位置插入对象
   * @param index 插入在数组中的位置, 可为负数
   * @param args 需要插入的对象, 可以是多个
   */
  $add( index: number, ...args: any[] ): this;

  /**
   * 在数组指定位置删除若干对象
   * @param index 需要删除的下标, 可为负数
   * @param num 需要从该下标开始删除几个对象 - default: 1
   * @param returnDeleted 是否返回删除的数据 - default: false
   */
  $delete( index: number, num?: number, returnDeleted?: false ): this;

  /**
   * 在数组指定位置删除若干对象
   * @param index 需要删除的下标, 可为负数
   * @param num 需要从该下标开始删除几个对象 - default: 1
   * @param returnDeleted 是否返回删除的数据 - default: false
   */
  $remove( index: number, num?: number, returnDeleted?: false ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param value 需要从数组中删除的对象
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $deleteValue( value: any, predicate: ( ( value: T ) => boolean ) | boolean ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param predicate 用于自定义筛选内容, 方法内返回 true 则代表删除
   */
  $deleteValue( predicate: ( value: T ) => boolean ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param value 需要从数组中删除的对象
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $removeValue( value: any, predicate: ( ( value: T ) => boolean ) | boolean ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param predicate 用于自定义筛选内容, 方法内返回 true 则代表删除
   */
  $removeValue( predicate: ( value: T ) => boolean ): this;

  /**
   * 行为类似于原生的 concat 方法, 但是不会创建一个新的数组, 而是将所有传入参数放到数组后
   * @param args 需要添加到数组后的数据
   */
  $concat( ...args: any[] ): this;

  /**
   * 行为类似于原生的 concat 方法, 但是不会创建一个新的数组, 而是将所有传入参数放到数组指定下标位置
   * @param index 需要插入到数组位置的下标
   * @param args 需要添加的数据
   */
  $concatTo( index: number, ...args: any[] ): this;

  /**
   * 使用传入的方法遍历集合的内容, 返回首个符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $find( traversal: ( value ) => boolean, fromIndex?: number ) : T | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $find( arr: any[], fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $find( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $find( obj: any, fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $find( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;

  /**
   * 使用传入的方法遍历集合的内容, 返回首个符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findIndex( arr: any[], fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findIndex( obj: any, fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;

  /**
   * 使用传入的方法遍历集合的内容, 返回首个符合传入方法检测的键值数组
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findChunk( arr: any[], fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findChunk( obj: any, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLast( traversal: ( value ) => boolean, fromIndex?: number ) : T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLast( arr: any[], fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLast( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLast( obj: any, fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLast( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastIndex( arr: any[], fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastIndex( obj: any, fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个符合传入方法检测的键值数组
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastChunk( arr: any[], fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastChunk( obj: any, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;

  /**
   * 使用传入的方法遍历集合的内容, 返回所有符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAll( traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAll( arr: any[], fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAll( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAll( obj: any, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAll( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法遍历集合的内容, 返回所有符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllIndex( arr: any[], fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllIndex( obj: any, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法遍历集合的内容, 返回所有符合传入方法检测的键值数组集
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的键值数组集
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllChunk( arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的键值数组集
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的键值数组集
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllChunk( obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有符合传入筛选条件的键值数组集
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的符合传入方法检测的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSome( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSome( count?: number, arr: any[], fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSome( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSome( count?: number, obj: any, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSome( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的符合传入方法检测的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeIndex( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeIndex( count?: number, arr: any[], fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeIndex( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeIndex( count?: number, obj: any, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeIndex( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的符合传入方法检测的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeChunk( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeChunk( count?: number, arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeChunk( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeChunk( count?: number, obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeChunk( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的符合传入方法检测的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSome( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSome( count?: number, arr: any[], fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSome( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSome( count?: number, obj: any, fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSome( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的符合传入方法检测的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeIndex( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeIndex( count?: number, arr: any[], fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeIndex( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeIndex( count?: number, obj: any, fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeIndex( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的符合传入方法检测的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeChunk( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeChunk( count?: number, arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeChunk( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeChunk( count?: number, obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeChunk( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 使用传入的方法遍历集合的内容, 返回首个不符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNot( traversal: ( value ) => boolean, fromIndex?: number ) : T | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNot( arr: any[], fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNot( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNot( obj: any, fromIndex?: number ): T | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNot( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;

  /**
   * 使用传入的方法遍历集合的内容, 返回首个不符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotIndex( arr: any[], fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotIndex( obj: any, fromIndex?: number ): number;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;

  /**
   * 使用传入的方法遍历集合的内容, 返回首个不符合传入方法检测的键值数组
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotChunk( arr: any[], fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotChunk( obj: any, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findNotChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个不符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNot( traversal: ( value ) => boolean, fromIndex?: number ) : T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNot( arr: any[], fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNot( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNot( obj: any, fromIndex?: number ): T | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNot( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T | undefined;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个不符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotIndex( arr: any[], fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotIndex( obj: any, fromIndex?: number ): number;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number;

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回首个不符合传入方法检测的键值数组
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotChunk( arr: any[], fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotChunk( obj: any, fromIndex?: number ): [ number, T ] | undefined;
  /**
   * 逆序遍历集合的内容, 查找到首个不符合传入筛选条件的键值数组
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: -1
   */
  $findLastNotChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ] | undefined;

  /**
   * 使用传入的方法遍历集合的内容, 返回所有不符合传入方法检测的值
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNot( traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNot( arr: any[], fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的值
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNot( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNot( obj: any, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的值
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNot( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法遍历集合的内容, 返回所有不符合传入方法检测的下标
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotIndex( traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotIndex( arr: any[], fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的下标
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotIndex( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotIndex( obj: any, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的下标
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotIndex( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法遍历集合的内容, 返回所有不符合传入方法检测的键值数组集
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotChunk( traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的键值数组集
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotChunk( arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的键值数组集
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotChunk( arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的键值数组集
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotChunk( obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到所有不符合传入筛选条件的键值数组集
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findAllNotChunk( obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的不符合传入方法检测的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNot( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNot( count?: number, arr: any[], fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNot( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNot( count?: number, obj: any, fromIndex?: number ): T[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNot( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的不符合传入方法检测的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotIndex( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotIndex( count?: number, arr: any[], fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotIndex( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotIndex( count?: number, obj: any, fromIndex?: number ): number[];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotIndex( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法遍历集合的内容, 返回指定数量的不符合传入方法检测的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotChunk( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotChunk( count?: number, arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotChunk( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotChunk( count?: number, obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findSomeNotChunk( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的不符合传入方法检测的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNot( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNot( count?: number, arr: any[], fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNot( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNot( count?: number, obj: any, fromIndex?: number ): T[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的值
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNot( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): T[];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的不符合传入方法检测的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotIndex( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotIndex( count?: number, arr: any[], fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotIndex( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotIndex( count?: number, obj: any, fromIndex?: number ): number[];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的下标
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotIndex( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): number[];

  /**
   * 使用传入的方法逆序遍历集合的内容, 返回指定数量的不符合传入方法检测的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param traversal 检测值的方法, 方法返回 boolean 值
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotChunk( count?: number, traversal: ( value ) => boolean, fromIndex?: number ) : [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotChunk( count?: number, arr: any[], fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param arr 用于筛选的一组 [ key, value, key2, value2, ... ] 键值集
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotChunk( count?: number, arr: any[], predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotChunk( count?: number, obj: any, fromIndex?: number ): [ number, T ][];
  /**
   * 逆序遍历集合的内容, 查找到指定数量的不符合传入筛选条件的键值数组集
   * @param count 指定查找的结果最大数量 - default: Infinity
   * @param obj 用于筛选的 { key: value, key2: value2 ... } 键值对
   * @param predicate 可指定比对键值时所调用的方法. 也可为 boolean 值, 值为真, 使用全等进行比较, 值为假, 使用双等进行比较 - default: true
   * @param fromIndex 从指定的索引开始搜索 - default: 0
   */
  $findLastSomeNotChunk( count?: number, obj: any, predicate?: ( ( value1, value2 ) => boolean ) | boolean, fromIndex?: number ): [ number, T ][];

  /**
   * 获取指定下标的对象
   * @param index 需要获取的下标, 可为负数 - default: 0
   */
  $get( index: number ): T | undefined;

  /**
   * 获取指定下标开始的若干个对象
   * @param index 需要获取的下标, 可为负数 - default: 0
   * @param num 需要从该下标开始获取几个对象 - default: 1
   */
  $get( index: number, num: number ): T[];

  /**
   * 修改数组指定下标的值
   * @param index 下标, 可为负数
   * @param value 值
   */
  $set( index: number, value: any ): this;

  /**
   * 修改数组指定下标的值
   * @param obj 批量修改数组指定下标的值
   */
  $set( obj: { index: number, value: any } ): this;

  /**
   * 修改数组内指定下标的值, 修改时无论如何不会超出数组原有范围
   * @param index 下标, 可为负数
   * @param value 值
   */
  $edit( index: number, value: any ): this;

  /**
   * 修改数组内指定下标的值, 修改时无论如何不会超出数组原有范围
   * @param obj 批量修改数组内指定下标的值
   */
  $edit( obj: { index: number, value: any } ): this;

  /**
   * 修改数组内指定下标的值
   * @param index 下标, 可为负数
   * @param value 值
   */
  $edit( index: number, value: any ): this;

  /**
   * 修改数组内指定下标的值
   * @param obj 批量修改数组内指定下标的值
   */
  $edit( obj: { index: number, value: any } ): this;

  /**
   * 查找数组内是否有此传入值
   * @param value 需要在数组中检测的对象
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $inArray( value: any, predicate: Function | boolean ): boolean;

  /**
   * 查找数组内是否有此传入值
   * @param predicate 用于自定义筛选内容
   */
  $inArray( predicate: Function ): boolean;

  /**
   * 移动数组内的某个元素到指定的位置
   * @param from 需要移动的元素下标, 可为负数
   * @param to 需要移动到的位置下标, 可为负数
   */
  $move( from: number, to: number ): this;

  /**
   * 提取数组一个范围内的元素, 移动到指定下标中 ( 指定下标是按照需要移动的元素移除后的下标进行计算 )
   * @param start 需要移动的位置的起始下标, 可为负数
   * @param moveCount 从起始下标开始, 取几位进行移动
   * @param toIndex 需要移动到数组的目标下标, 可为负数
   */
  $moveRange( start: number, moveCount: number, toIndex: number ): this;

  /**
   * 将一个或多个元素添加到数组的末尾, 并返回当前数组
   * @param args 需要插入到数组末尾的对象
   */
  $push( ...args: any[] ): this;

  /**
   * 从数组中删除最后一个元素, 并返回当前数组
   */
  $pop(): this;

  /**
   * 将一个或多个元素添加到数组的开头, 并返回当前数组
   * @param args 需要插入到数组开头的对象
   */
  $unshift( ...args: any[] ): this;

  /**
   * 从数组中删除第一个元素, 并返回当前数组
   */
  $shift(): this;

  /**
   * 通过删除现有元素和 / 或添加新元素来更改一个数组的内容, 并返回当前数组
   * @param start 指定修改的开始位置
   * @param deleteCount 整数, 表示要移除的数组元素的个数
   * @param args 要添加进数组的元素
   */
  $splice( start: number, deleteCount?: number, ...args: any[] ): this;

}


interface ObjectConstructor {

  /**
   * 将多个源对象的可枚举属性合并到第一个对象中
   * @param shallow 是否使用浅拷贝模式, 类似于使用 boolean.assign, 可不填 - Default: false
   * @param target 要复制到的目标对象
   * @param source 需要复制属性的多个源对象
   */
  $assign<T, U>( shallow?: boolean, target?: T, ...source: U[] ): T & U;

  /**
   * 将多个源对象的可枚举属性合并到第一个对象中
   * @param target 要复制到的目标对象
   * @param source 需要复制属性的多个源对象
   */
  $assign<T, U>( target: T, ...source: U[] ): T & U;

  /**
   * 判断传入的两个对象是否相同
   *
   * // 下面的比对结果都是 true
   * boolean.$equals( NaN, NaN );
   * boolean.$equals( 'ZenJS', 'ZenJS' );
   * boolean.$equals( { a: 1 }, { a: 1 } );
   * boolean.$equals( [ 1, 2, 3 ], [ 1, 2, 3 ] );
   * boolean.$equals( function(){ return true }, function(){ return true } );
   * boolean.$equals( new Map([ [ 1, 2 ], [ 3, 4 ] ]), new Map([ [ 1, 2 ], [ 3, 4 ] ]) );
   * boolean.$equals( new Set([ 1, 2, 3, 4 ]), new Set([ 1, 2, 3, 4 ]) );
   * boolean.$equals( document.createElement('div'), document.createElement('div') );
   * boolean.$equals( new Date('2018/7/28'), new Date('2018/7/28') );
   * boolean.$equals( /ZenJS/, /ZenJS/ );
   *
   * @param obj 需要判断的第一个对象
   * @param obj2 需要判断的第二个对象
   */
  $equals( obj: any, obj2: any ): boolean;

  /**
   * 调用传入方法遍历传入对象
   * @param obj 需要进行遍历的对象
   * @param callback 遍历对象时调用的方法, 方法返回 false 时, 将终止后续遍历
   */
  $each<T>( obj: T, callback: ( name: string, value: any, obj: T ) => any ): T;

  /**
   * 判断传入对象是否是空对象
   * @param obj 需要判断的对象
   */
  $isEmptyObject( obj: any ): boolean;

  /**
   * 判断传入对象是否是纯粹的对象
   * @param obj 需要判断的对象
   */
  $isPlainObject( obj: any ): boolean;

}


interface Object {

  /**
   * 将多个源对象的可枚举属性合并到当前对象中
   * @param shallow 是否使用浅拷贝模式, 类似于使用 boolean.assign, 可不填 - Default: false
   * @param source 需要复制属性的多个源对象
   */
  $assign<T>( shallow?: boolean, ...source: T[] ): this & T;

  /**
   * 将多个源对象的可枚举属性合并到当前对象中
   * @param source 需要复制属性的多个源对象
   */
  $assign<T>( ...source: T[] ): this & T;

  /**
   * 判断当前对象和传入对象是否相同, 比对规则请参考 boolean.$equals
   * @param obj 需要比对的对象
   */
  $equals( obj: any ): boolean;

  /**
   * 调用传入方法遍历当前对象
   * @param callback 遍历当前对象时调用的方法, 方法返回 false 时, 将终止后续遍历
   */
  $each( callback: ( name: string, value: any, obj: this ) => any ): this;

  /**
   * 获取对象的某个值
   * @param key 需要获取的值的 key
   */
  $get<K extends keyof this>( key: K ): this[K];

  /**
   * 设置或修改对象的某个值
   * @param key 需要修改的值的 key
   * @param value 需要设置的值
   */
  $set( key: String, value: any ): this;

  /**
   * 批量设置或修改对象的值
   * @param obj key, value 的键值对
   */
  $set( obj: {} ): this;

  /**
   * 设置或修改对象的某个值
   * @param key 需要修改的值的 key
   * @param value 需要设置的值
   */
  $edit( key: String, value: any ): this;

  /**
   * 批量设置或修改对象的值
   * @param obj key, value 的键值对
   */
  $edit( obj: {} ): this;

  /**
   * 删除对象中指定值
   * @param args 可删除多个指定值
   */
  $delete( ...args: string[] ): this;

  /**
   * 删除对象中指定值
   * @param args 可删除多个指定值
   */
  $remove( ...args: string[] ): this;

  /**
   * 从对象中删除与传入值相同的值
   * @param value 需要对象中删除的值
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $deleteValue( value: any, predicate: boolean | ( ( value1, value2 ) => boolean ) ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param predicate 用于自定义筛选内容
   */
  $deleteValue( predicate: ( value ) => boolean ): this;

  /**
   * 从对象中删除与传入值相同的值
   * @param value 需要对象中删除的值
   * @param predicate 是否使用全等进行判断, 为 false 则使用双等进行判断, 可传入自定义方法 - default: true
   */
  $removeValue( value: any, predicate: boolean | ( ( value1, value2 ) => boolean ) ): this;

  /**
   * 从数组中删除与传入值相同的对象
   * @param predicate 用于自定义筛选内容
   */
  $removeValue( predicate: ( value ) => boolean ): this;

  /**
   * 返回当前对象
   */
  $self(): this;

}


interface NumberConstructor {

  /**
   * 判断传入对象是否是数字类型或可转为数字
   * @param obj 需要判断的对象
   */
  $isNumber( obj: any ): boolean;

}


interface Number {

  /**
   * 将传入数字与当前数字相加, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $add( num: number ): number;

  /**
   * 将传入数字与当前数字相加, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $jia( num: number ): number;

  /**
   * 将传入数字与当前数字相减, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $subtract( num: number ): number;

  /**
   * 将传入数字与当前数字相减, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $jian( num: number ): number;

  /**
   * 将传入数字与当前数字相乘, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $multiply( num: number ): number;

  /**
   * 将传入数字与当前数字相乘, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $cheng( num: number ): number;

  /**
   * 将传入数字与当前数字相除, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $divide( num: number ): number;

  /**
   * 将传入数字与当前数字相除, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $chu( num: number ): number;

}


interface Math {

  /**
   * 在 0 到 9 之间随机一个数字
   */
  $random(): number;

  /**
   * 在 0 到传入值之间随机一个数字
   * @param to 指定一个数字, 可为负数
   */
  $random( to: number ): number;

  /**
   * 在最小数和最大数之间随机一个数字
   * @param from 指定一个最小数, 可为负数 - default: 0
   * @param to 指定一个最大数, 可为负数 - default: 9
   */
  $random( from: number, to: number ): number;

  /**
   * 将传入的两个数字进行相加, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $add( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相加, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $jia( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相减, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $subtract( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相减, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $jian( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相乘, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $multiply( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相乘, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $cheng( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相除, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $divide( num1: number, num2: number ): number;

  /**
   * 将传入的两个数字进行相除, 不会发生浮点数精度不准的问题
   * @param num1 数字1
   * @param num2 数字2
   */
  $chu( num1: number, num2: number ): number;

  /**
   * 传入多个数字, 求出传入参数的平均值
   * @param args 任意个数数字
   */
  $mean( ...args: number[] ): number;

}


interface StringConstructor {

  /**
   * 随机26个字母中的一个
   * @param uppercase 是否大写 - default: false
   */
  $random( uppercase?: false ): string;

  /**
   * 随机指定长度的字符串
   * @param length 随机的字符串长度 - default: 12
   * @param uppercase 是否随机大写字母 - default: false
   * @param number 是否随机数字 - default: false
   */
  $someRandom( length?: number, uppercase?: false, number?: false ): string;

}


interface String {

  /**
   * 对当前字符串进行全局替换
   * @param searchValue 字符串或正则, 匹配字符串中被替换的部分
   * @param replaceValue 进行替换的字符串, 也可传入方法用来返回新字符串 - default: ''
   */
  $replaceAll( searchValue: string | RegExp, replaceValue: string | Function ): string;

  /**
   * 将字符串首字母大写, 其他字母小写
   * @param ignoreNext 是否忽略其他字母小写的操作
   */
  $toCapitalize( ignoreNext?: boolean ): string;

  /**
   * 将字符串首字母大写, 其他字母小写
   * @param ignoreNext 是否忽略其他字母小写的操作
   */
  $toUpperFirstCase( ignoreNext?: boolean ): string;

  /**
   * 将字符串首字母小写, 其他字母大写
   * @param ignoreNext 是否忽略其他字母大写的操作
   */
  $toLowerFirstCase( ignoreNext?: boolean ): string;

}


interface DateConstructor{

  /**
   * 解析传入的 ( 时间字符串 | Unix 时间戳 | Date 对象 | Dayjs 对象 ), 返回原生的 Date 对象
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   */
  $parse( date: string| number | Date | Dayjs ): Date;

  /**
   * 解析传入时间及时间日期字符串并替换成相应的值
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param formatStr ( YY: 两位数的年份 )
   *                  ( YYYY: 四位数的年份 )
   *                  ( M: 月份, 从 1 开始 )
   *                  ( MM: 月份, 两位数 )
   *                  ( MMM: 简写的月份名称 )
   *                  ( MMMM: 完整的月份名称 )
   *                  ( D: 月份里的一天 )
   *                  ( DD: 月份里的一天，两位数 )
   *                  ( d: 一周中的一天，星期天是 0 )
   *                  ( dd: 最简写的一周中一天的名称 )
   *                  ( ddd: 简写的一周中一天的名称 )
   *                  ( dddd: 一周中一天的名称 )
   *                  ( H: 小时 )
   *                  ( HH: 小时, 两位数 )
   *                  ( m: 分钟 )
   *                  ( mm: 分钟, 两位数 )
   *                  ( s: 秒 )
   *                  ( ss: 秒, 两位数 )
   *                  ( SSS: 秒, 三位数 )
   *                  ( Z: UTC 的偏移量 )
   *                  ( ZZ: UTC 的偏移量, 数字前面加上 0 )
   *                  ( A: AM PM )
   *                  ( a: am pm )
   */
  $format( date: string | Date, formatStr: string ): string;

  /**
   * 获取实时年份
   */
  $year(): number;

  /**
   * 获取实时月份
   */
  $month(): number;

  /**
   * 获取实时日期
   */
  $date(): number;

  /**
   * 获取实时星期
   */
  $day(): number;

  /**
   * 获取实时小时
   */
  $hour(): number;

  /**
   * 获取实时分钟
   */
  $minute(): number;

  /**
   * 获取实时秒
   */
  $second(): number;

  /**
   * 获取实时毫秒
   */
  $millisecond(): number;

  /**
   * 基于实时时间设置时间, 返回处理后的时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   * @param value 给传入单位设置的值
   */
  $set( unit : string, value : number ): Date;

  /**
   * 基于实时时间增加时间, 返回处理后的时间
   * @param value 给当前时间对象增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $add( value : number, unit : string ): Date;

  /**
   * 基于实时时间减少时间, 返回处理后的时间
   * @param value 给当前时间的指定单位增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $subtract( value : number, unit : string ): Date;

  /**
   * 基于实时时间设置时间为指定单位的开头时间, 返回处理后的时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $startOf( unit : string ): Date;

  /**
   * 基于实时时间设置时间为指定单位的末尾时间, 返回处理后的时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $endOf( unit: string ): Date;

  /**
   * 获取实时时间和传入时间的时间差，默认毫秒
   * @param input 需要和实时时间比较的时间
   * @param units 单位,
   *              [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *              [ month, M ] 月
   *              [ year, y ] 年
   *              [ hour, h ] 时
   *              [ minute, m ] 分
   *              [ second, s ] 秒
   *              [ millisecond, ms ] 毫秒
   * @param float
   */
  $diff( input: string | Date, units: string, float: boolean ): string;

  /**
   * 返回实时时间 Unix 时间戳 ( 毫秒 )
   */
  $valueOf(): number;

  /**
   * 返回实时时间 Unix 时间戳 ( 秒 )
   */
  $unix(): number

  /**
   * 返回实时月份的天数
   */
  $daysInMonth(): number;

  /**
   * 返回实时时间的包含时间数值的数组
   */
  $toArray(): number[];

  /**
   * 返回实时时间的包含时间数值的对象
   */
  $toObject(): any;

  /**
   * 检查实时时间是否在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时时间是否和传入时间相同
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSame( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时时间是否在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时时间是否在介于传入的两个时间之间
   * @param date1 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param date2 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isBetween( date1: string| number | Date | Dayjs, date2: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时时间是否在传入时间相同或在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSameOrBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时时间是否在传入时间相同或在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSameOrAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查实时年份是否是闰年
   */
  $isLeapYear(): boolean;

}


interface Date {

  /**
   * 返回当前对象的 dayjs 对象
   */
  $dayjs(): Dayjs;

  /**
   * 检测当前时间对象是否是一个有效的时间
   */
  $isValid(): boolean;

  /**
   * 获取年份
   */
  $year(): number;

  /**
   * 获取月份
   */
  $month(): number;

  /**
   * 获取日期
   */
  $date(): number;

  /**
   * 获取星期
   */
  $day(): number;

  /**
   * 获取小时
   */
  $hour(): number;

  /**
   * 获取分钟
   */
  $minute(): number;

  /**
   * 获取秒
   */
  $second(): number;

  /**
   * 获取毫秒
   */
  $millisecond(): number;

  /**
   * 设置时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   * @param value 给传入单位设置的值
   */
  $set( unit : string, value : number ): Date;

  /**
   * 增加时间
   * @param value 给当前时间对象增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $add( value : number, unit : string ): Date;

  /**
   * 减少时间
   * @param value 给当前时间的指定单位增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $subtract( value : number, unit : string ): Date;

  /**
   * 设置当前时间为指定单位的开头时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $startOf( unit : string ): Date;

  /**
   * 设置当前时间为指定单位的末尾时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $endOf( unit: string ): Date;

  /**
   * 接收一系列的时间日期字符串并替换成相应的值
   * @param formatStr ( YY: 两位数的年份 )
   *                  ( YYYY: 四位数的年份 )
   *                  ( M: 月份, 从 1 开始 )
   *                  ( MM: 月份, 两位数 )
   *                  ( MMM: 简写的月份名称 )
   *                  ( MMMM: 完整的月份名称 )
   *                  ( D: 月份里的一天 )
   *                  ( DD: 月份里的一天，两位数 )
   *                  ( d: 一周中的一天，星期天是 0 )
   *                  ( dd: 最简写的一周中一天的名称 )
   *                  ( ddd: 简写的一周中一天的名称 )
   *                  ( dddd: 一周中一天的名称 )
   *                  ( H: 小时 )
   *                  ( HH: 小时, 两位数 )
   *                  ( m: 分钟 )
   *                  ( mm: 分钟, 两位数 )
   *                  ( s: 秒 )
   *                  ( ss: 秒, 两位数 )
   *                  ( SSS: 秒, 三位数 )
   *                  ( Z: UTC 的偏移量 )
   *                  ( ZZ: UTC 的偏移量, 数字前面加上 0 )
   *                  ( A: AM PM )
   *                  ( a: am pm )
   */
  $format( formatStr: string ): string;

  /**
   * 获取当前时间和传入时间的时间差，默认毫秒
   * @param input 需要和当前时间比较的时间
   * @param units 单位,
   *              [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *              [ month, M ] 月
   *              [ year, y ] 年
   *              [ hour, h ] 时
   *              [ minute, m ] 分
   *              [ second, s ] 秒
   *              [ millisecond, ms ] 毫秒
   * @param float
   */
  $diff( input: string | Date, units: string, float: boolean ): string;

  /**
   * 返回 Unix 时间戳 ( 毫秒 )
   */
  $valueOf(): number;

  /**
   * 返回 Unix 时间戳 ( 秒 )
   */
  $unix(): number

  /**
   * 返回月份的天数
   */
  $daysInMonth(): number;

  /**
   * 返回包含时间数值的数组
   */
  $toArray(): number[];

  /**
   * 返回包含时间数值的对象
   */
  $toObject(): any;

  /**
   * 检查当前时间是否在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否和传入时间相同
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSame( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在介于传入的两个时间之间
   * @param date1 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param date2 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isBetween( date1: string| number | Date | Dayjs, date2: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间相同或在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSameOrBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间相同或在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  $isSameOrAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前年份是否是闰年
   */
  $isLeapYear(): boolean;

}


interface Function {

  /**
   * 使当前方法调用次数大于传入数值时, 才会被真正调用
   * @param num 调用次数 - Default: 1
   */
  $after( num?: number ): Function;

  /**
   * 可提前传入方法的指定下标的参数
   * @param argsObj 类似于 { index: obj, index2: obj2 } 结构的对象, 定义了参数的下标和值
   */
  $args( argsObj: any ): Function;

  /**
   * 使当前方法调用过一次便失效
   * @param num 可指定在被第几次调用时是有用的, 默认第一次 - Default: 1
   */
  $one( num?: number ): Function;

  /**
   * 使当前方法调用过一次便失效
   * @param num 可指定在被第几次调用时是有用的, 默认第一次 - Default: 1
   */
  $once( num?: number ): Function;

}


interface RegExpConstructor{

  /**
   * 将字符串转为正则表达式, 自动转义关键字
   * @param keyword 需要转换的字符串
   * @param flogs 交给 RegExp 解析的修饰符
   */
  $parse( keyword: string, flogs: string ): RegExp;

}


interface Window {

  /**
   * 判断传入参数的类型
   * @param obj 需要判断类型的参数
   */
  $typeof( obj: any ): string;

  /**
   * $querystring 模块提供了一些实用函数, 用于解析与格式化 URL 查询字符串
   */
  $querystring: $querystring;

  /**
   * ZenJS
   */
  ZenJS: ZenJS;

  /**
   * 解析传入的 ( 时间字符串 | Unix 时间戳 | Date 对象 | Dayjs 对象 )
   * @param config ( 标准的 ISO 8601 时间字符串 )
   *               ( Unix 毫秒时间戳: 13位数字 )
   *               ( Unix 秒时间戳: 10位数字 )
   *               ( Javascript Date 对象 )
   * @param options \{ locale: string }
   */
  dayjs( config?: string | number | Date | Dayjs, options?: any ): Dayjs;

}


interface $querystring {

  /**
   * 将对象进行序列化成 URL 查询字符串
   * @param obj 需要序列化的对象
   * @param sep 在字符串中分隔不同键值对的字符串 - default: '&'
   * @param eq 在字符串中分隔键和值的字符串 - default: '='
   */
  stringify( obj, sep?: string, eq?: string ): string;

  /**
   * 将 URL 查询字符串反序列化为对象
   * @param str 需要反序列化的字符串
   * @param sep 在字符串中分隔不同键值对的字符串 - default: '&'
   * @param eq 在字符串中分隔键和值的字符串 - default: '='
   */
  parse( str, sep?: string, eq?: string ): {};

}

interface ZenJS {

  /**
   * GUID, 自动自增
   */
  guid: number;

  /**
   * 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象. 它将返回目标对象.
   * boolean.assign polyfill ( 如果浏览器支持此方法, 则会直接返回浏览器原生方法 )
   */
  assign<T, U>( target: T, ...source: U[] ): T & U;

  /**
   * 构造并返回一个新字符串, 该字符串包含被连接在一起的指定数量的字符串的副本.
   * 是 string.prototype.repeat 的降级方案
   * @param str 需要重复的字符串
   * @param count 需要重复的次数
   */
  repeat( str: string, count: number ): string;

  /**
   * 方法返回一个由一个给定对象的自身可枚举属性组成的数组.
   * Object.keys 的引用
   */
  keys<T, K extends keyof T>( obj: T ): K[];

  /**
   * 方法返回一个由一个给定对象自身可枚举属性的键值对数组.
   * Object.entries polyfill
   */
  entries<T, K extends keyof T>( obj: T ): [ K, T[K] ][];

  /**
   * 方法返回一个由一个给定对象自身的所有可枚举属性值的数组.
   * Object.values polyfill
   */
  values<T, K extends keyof T>( obj: T ): T[K][];

  /**
   * 传入一个键值对的列表, 并返回一个带有这些键值对的新对象 ( 是 Object.entries 的反转 )
   * Object.fromEntries polyfill
   */
  fromEntries<K, V>( iterable: [ string, any ][] | Map<K, V> ): {};

  /**
   * 判断传入的两个参数是否全等 ( === )
   * @param one 需要判断的第一参数
   * @param two 需要判断的第二参数
   */
  congruence( one: any, two: any ): boolean;

  /**
   * 判断传入的两个参数是否相等 ( == )
   * @param one 需要判断的第一参数
   * @param two 需要判断的第二参数
   */
  equals( one: any, two: any ): boolean;

  /**
   * 在一个对象上定义/修改一个新属性 ( 对 boolean.defineProperty 的封装 )
   * @param obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param name 要定义或修改的属性的名称
   * @param options 将被定义或修改的属性描述符 ( configurable - 删除/定义 ) ( enumerable - 枚举 ) ( writable - 写入 )
   * @param options2 将被定义或修改的属性描述符, 会覆盖前一个 options ( configurable - 删除/定义 ) ( enumerable - 枚举 ) ( writable - 写入 )
   */
  define( obj: any, name: string, options: any, options2: any );

  /**
   * 在一个对象上定义/修改一个新属性的 value 描述符
   * @param obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param name 要定义或修改的属性的名称
   * @param value 将被定义或修改的 value 描述符
   * @param options 将被定义或修改的属性描述符 ( configurable - 删除/定义 ) ( enumerable - 枚举 ) ( writable - 写入 )
   */
  defineValue( obj: any, name: string, value: Function, options: any );

  /**
   * 在一个对象上定义/修改一个新属性的 get 描述符
   * @param obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param name 要定义或修改的属性的名称
   * @param get 将被定义或修改的 get 描述符
   * @param options 将被定义或修改的属性描述符 ( configurable - 删除/定义 ) ( enumerable - 枚举 ) ( writable - 写入 )
   */
  defineGet( obj: any, name: string, get: Function, options: any );

  /**
   * 在传入的两个正整数中随机一个数字
   * @param from
   * @param to
   */
  intRandom( from: number, to: number ): number;

  /**
   * 返回传入的第一个参数
   * @param {any} arg
   */
  returnArg<T>( arg: T ): T;

  /**
   * 始终返回 true
   */
  returnTrue(): true;

  /**
   * 始终返回 false
   */
  returnFalse(): false;

  /**
   * 一个空方法
   */
  noop(): void;

  /**
   * 获取方法指定位参数, 若未传入参数, 则取默认值
   * @param args arguments
   * @param index 需要在 argument 中取得默认值的下标
   * @param defaultValue 若未传入值时取得默认值
   */
  parametersDefault( args: IArguments, index: number, defaultValue: any ): any;

  /**
   * 获取方法从指定位开始的剩余参数
   * @param { IArguments } args arguments
   * @param { number } index 需要在 arguments 中开始取参数的下标 - default: 0
   */
  parametersRest( args: IArguments, index: number ): any[];

  /**
   * 判断传入对象是否是 string 类型
   * @param obj 需要判断的对象
   */
  isString( obj: any ): boolean;

  /**
   * 判断传入对象是否是 boolean 类型
   * @param obj 需要判断的对象
   */
  isBoolean( obj: any ): boolean;

  /**
   * 判断传入对象是否是 Array 类型
   * @param obj 需要判断的对象
   */
  isArray( obj: any ): boolean;

  /**
   * 判断传入对象是否是 number 类型, 并且不为 NaN
   * @param obj 需要判断的对象
   */
  isNumber( obj: any ): boolean;

  /**
   * 判断传入对象是否是 RegExp 类型
   * @param obj 需要判断的对象
   */
  isRegExp( obj: any ): boolean;

  /**
   * 判断传入对象是否是 Set 对象
   * @param obj 需要判断的对象
   */
  isSet( obj: any ): boolean;

  /**
   * 判断传入对象是否是 Map 对象
   * @param obj 需要判断的对象
   */
  isMap( obj: any ): boolean;

  /**
   * 判断传入对象是否是 Function 类型
   * @param obj 需要判断的对象
   */
  isFunction( obj: any ): boolean;

  /**
   * 判断传入对象是否是 boolean 类型, 并且不为 null
   * @param obj 需要判断的对象
   */
  isObject( obj: any ): boolean;

  /**
   * 判断一个对象是否是引用类型
   * @param obj 需要判断的对象
   */
  isReferenceType( obj: any ): boolean;

  /**
   * 将 Map 或 Set 类型转换为数组类型,
   * 执行到这之前必须确定传进来的是 Map 或 Set 类型
   */
  mapSetToArray<K, V>( mapOrSet: Map<K, V> ): [K, V][];

  /**
   * 将 Map 或 Set 类型转换为数组类型,
   * 执行到这之前必须确定传进来的是 Map 或 Set 类型
   */
  mapSetToArray<T>( mapOrSet: Set<T> ): T[]

  /**
   * 创建一个可写的事件对象
   * @private
   * @param event 原生事件对象
   */
  Event( src: DocumentEventMap ): any;

  /**
   * 内部使用的各种处理事件的方法
   */
  EventListener: {

    /**
     * 事件处理 => 绑定事件
     * @private
     * @param elem 需要绑定事件的对象
     * @param type 需要绑定的事件
     * @param selector 事件委托的选择器
     * @param listener 绑定的事件回调
     * @param options 事件绑定参数
     * @param group 事件分组参数
     * @param data 传递给事件的数据
     */
    add( elem: EventTarget, type: string, selector: string, listener: Function, options: boolean, group: string, data: boolean );

    /**
     * 事件处理 => 触发事件
     * @private
     * @param self 触发事件的对象
     * @param oArgs 原生事件触发时方法的 arguments
     * @param handleOptions 该事件的所有详细参数
     */
    dispatch( self: EventTarget, args: IArguments, handleOptions: boolean );

    /**
     * 事件处理 => 功能性命名空间
     * @private
     * @param name 需要解析哪一块的功能命名空间
     * @param namespace 元素的命名空间列表
     * @param elem 绑定事件的元素
     * @param type 绑定的事件
     * @param options 其他属性
     */
    modifiers( name: string, namespace: string[], elem: EventTarget, type: string, options: boolean );

    /**
     * 事件处理 => 移除事件
     * @private
     * @param elem 需要移除事件的独享
     * @param types 需要移除的事件集
     * @param listener 需要移除的事件回调
     * @param selector 事件委托选择器
     */
    remove( elem: EventTarget, types: string[], listener: Function, selector: string );

    /**
     * 事件处理 => 触发事件
     * @private
     * @param elem 需要触发事件的对象
     * @param types 需要触发的事件集
     * @param data 需要传递到事件回调的参数
     */
    emit( elem: EventTarget, types: string[], data: any[] );

  }

}

/**
 * 判断传入参数的类型
 * @param obj 需要判断类型的参数
 */
declare function $typeof( obj: any ): string;

/**
 * $querystring 模块提供了一些实用函数, 用于解析与格式化 URL 查询字符串
 */
declare const $querystring: $querystring;

/**
 * ZenJS
 */
declare const ZenJS: ZenJS;

/**
 * 解析传入的 ( 时间字符串 | Unix 时间戳 | Date 对象 | Dayjs 对象 )
 * @param config ( 标准的 ISO 8601 时间字符串 )
 *               ( Unix 毫秒时间戳: 13位数字 )
 *               ( Unix 秒时间戳: 10位数字 )
 *               ( Javascript Date 对象 )
 * @param options \{ locale: string }
 */
declare function dayjs( config?: string | number | Date | Dayjs, options?: any ): Dayjs;

declare namespace dayjs {

  /**
   * 给 dayjs 扩展插件
   * @param plugin 传入方法编写一个 dayjs 插件
   * @param options 传递给前面方法的 options 参数
   */
  function extend( plugin: ( options: string | number | Date | Dayjs, dayjsClass: Dayjs, dayjsFactory: 'dayjs' ) => void, options: string | number | Date | Dayjs ): Dayjs;

  /**
   * 改变全局语言, 返回使用语言的字符串
   * @param preset 需要设置或切换的语言名称
   * @param object 语言包配置
   */
  function locale( preset: string, object?: any ): string;

  /**
   * 验证传入值是否是一个 Dayjs 对象
   * @param data
   */
  function isDayjs( data: Dayjs ): boolean;

  /**
   * 可以解析传入的一个 Unix 秒时间戳 ( 10位数字 )
   * @param date
   */
  function unix( date: number ): Dayjs;

}

declare class Dayjs{

  constructor( config?: string | number | Date | Dayjs );

  /**
   * 获得一个 Dayjs 对象的拷贝
   */
  clone(): Dayjs;

  /**
   * 检测当前 Dayjs 对象是否是一个有效的时间
   */
  isValid(): boolean;

  /**
   * 获取年份
   */
  year(): number;

  /**
   * 获取月份
   */
  month(): number;

  /**
   * 获取日期
   */
  date(): number;

  /**
   * 获取星期
   */
  day(): number;

  /**
   * 获取小时
   */
  hour(): number;

  /**
   * 获取分钟
   */
  minute(): number;

  /**
   * 获取秒
   */
  second(): number;

  /**
   * 获取毫秒
   */
  millisecond(): number;

  /**
   * 设置时间
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   * @param value 给传入单位设置的值
   */
  set( unit : string, value : number ): Dayjs;

  /**
   * 增加时间
   * @param value 给当前时间对象增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  add( value : number, unit : string ): Dayjs;

  /**
   * 减少时间
   * @param value 给当前时间的指定单位增加的时间值
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  subtract( value : number, unit : string ): Dayjs;

  /**
   * 返回当前时间的开头时间的 Dayjs 对象
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  startOf( unit : string ): Dayjs;

  /**
   * 返回当前时间的末尾时间的 Dayjs 对象
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  endOf( unit: string ): Dayjs;

  /**
   * 接收一系列的时间日期字符串并替换成相应的值
   * @param formatStr ( YY: 两位数的年份 )
   *                  ( YYYY: 四位数的年份 )
   *                  ( M: 月份, 从 1 开始 )
   *                  ( MM: 月份, 两位数 )
   *                  ( MMM: 简写的月份名称 )
   *                  ( MMMM: 完整的月份名称 )
   *                  ( D: 月份里的一天 )
   *                  ( DD: 月份里的一天，两位数 )
   *                  ( d: 一周中的一天，星期天是 0 )
   *                  ( dd: 最简写的一周中一天的名称 )
   *                  ( ddd: 简写的一周中一天的名称 )
   *                  ( dddd: 一周中一天的名称 )
   *                  ( H: 小时 )
   *                  ( HH: 小时, 两位数 )
   *                  ( m: 分钟 )
   *                  ( mm: 分钟, 两位数 )
   *                  ( s: 秒 )
   *                  ( ss: 秒, 两位数 )
   *                  ( SSS: 秒, 三位数 )
   *                  ( Z: UTC 的偏移量 )
   *                  ( ZZ: UTC 的偏移量, 数字前面加上 0 )
   *                  ( A: AM PM )
   *                  ( a: am pm )
   */
  format( formatStr: string ): string;

  /**
   * 获取当前时间和传入时间的时间差，默认毫秒
   * @param input 需要和当前时间比较的时间
   * @param units 单位,
   *              [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *              [ month, M ] 月
   *              [ year, y ] 年
   *              [ hour, h ] 时
   *              [ minute, m ] 分
   *              [ second, s ] 秒
   *              [ millisecond, ms ] 毫秒
   * @param float
   */
  diff( input: string | Date, units: string, float: boolean ): string;

  /**
   * 返回 Unix 时间戳 ( 毫秒 )
   */
  valueOf(): number;

  /**
   * 返回 Unix 时间戳 ( 秒 )
   */
  unix(): number

  /**
   * 返回月份的天数
   */
  daysInMonth(): number;

  /**
   * 返回原生的 Date 对象
   */
  toDate(): Date;

  /**
   * 返回包含时间数值的数组
   * [ 2018, 8, 18, 00, 00, 00, 000 ]
   */
  toArray(): number[];

  /**
   * 序列化 Dayjs 对象, 返回 ISO8601 格式的字符串
   */
  toJSON(): string;

  /**
   * 返回 ISO8601 格式的字符串
   */
  toISOString(): string;

  /**
   * 返回包含时间数值的对象
   */
  toObject(): {
    years: number
    months: number
    date: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
  }

  /**
   * 以文本方式表示当前 Dayjs 对象
   */
  toString(): string;

  /**
   * 检查当前时间是否在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否和传入时间相同
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isSame( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在介于传入的两个时间之间
   * @param date1 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param date2 ( 标准的 ISO 8601 时间字符串 )
   *              ( Unix 毫秒时间戳: 13位数字 )
   *              ( Unix 秒时间戳: 10位数字 )
   *              ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isBetween( date1: string| number | Date | Dayjs, date2: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间相同或在传入时间之前
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isSameOrBefore( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前时间是否在传入时间相同或在传入时间之后
   * @param date ( 标准的 ISO 8601 时间字符串 )
   *             ( Unix 毫秒时间戳: 13位数字 )
   *             ( Unix 秒时间戳: 10位数字 )
   *             ( Javascript Date 对象 )
   * @param unit 单位,
   *             [ day, d ] 星期几 ( 星期天 0, 星期六 6 ),
   *             [ month, M ] 月
   *             [ year, y ] 年
   *             [ hour, h ] 时
   *             [ minute, m ] 分
   *             [ second, s ] 秒
   *             [ millisecond, ms ] 毫秒
   */
  isSameOrAfter( date: string| number | Date | Dayjs, units: string ): boolean;

  /**
   * 检查当前年份是否是闰年
   */
  isLeapYear(): boolean;

}


/*
 * DOM API
 */

interface Document {

  /**
   * ( Fat ) document.getElementById 的引用
   * @param elmentId ID
   */
  $id( elmentId: string ): Element;

  /**
   * ( Fat ) 当前页面加载完成后执行传入代码
   *
   * @param func DOM 载入完成后执行的方法
   * @param data 需要传入方法的数据
   */
  $ready( func: () => void, data?: any ): void;

  /**
   * ( Fat ) 调用原生 querySelectorAll 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $query( selectors ): Element[];

  /**
   * ( Fat ) 调用原生 querySelectorAll 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $find( selectors ): Element[];

  /**
   * ( Fat ) 调用原生  querySelector 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $queryFirst( selectors ): Element | null;

  /**
   * ( Fat ) 调用原生  querySelector 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $findFirst( selectors ): Element | null;

}

/**
 * ( Fat ) 当前页面及页面资源载入完成后传入代码
 *
 * @param func 页面及页面资源载入完成后执行的方法
 * @param data 需要传入方法的数据
 */
declare function $ready( func: () => void, data?: any ): void;


interface Window {

  /**
   * ( Fat ) 当前页面及页面资源载入完成后传入代码
   *
   * @param func 页面及页面资源载入完成后执行的方法
   * @param data 需要传入方法的数据
   */
  $ready( func: () => void, data?: any ): void;

}

interface Location {

  /**
   * 获取当前页面 search 的指定参数值
   * @param name 需要获取的参数名
   * @returns 参数值
   */
  $search( name: string ): string;

  /**
   * 设置当前页面 search 的指定参数值
   * @param name 需要设置的参数名
   * @param value 需要设置的参数值
   */
  $search( name: string, value: string ): void;

  /**
   * 获取传入 url 的 search 的指定参数值
   * @param url url
   * @param name 需要获取的参数名
   * @returns 参数值
   */
  $urlSearch( url: string, name: string ): string;

  /**
   * 设置传入 url 的 search 的指定参数值
   * @param url url
   * @param name 需要设置的参数名
   * @param value 需要设置的参数值
   * @returns 修改后的 url
   */
  $urlSearch( url: string, name: string, value: string ): string;

}

interface Element {

  /**
   * ( Fat ) 向元素添加一个或多个类
   * @param className 类名
   */
  $addClass( className: string ): this;

  /**
   * ( Fat ) 向元素移除一个或多个类
   * @param className 类名
   */
  $removeClass( className: string ): this;

  /**
   * ( Fat ) 向元素移除一个或多个类
   * @param className 类名
   */
  $deleteClass( className: string ): this;

  /**
   * ( Fat ) 判断元素是否有一个或多个类
   * @param className 类名
   */
  $hasClass( className: string ): boolean;

  /**
   * ( Fat ) 设置或移除元素的一个或多个类进行切换
   * @param className 类名
   * @param toggle 若值为 true, 则规定只添加类, 反之只移除
   */
  $toggleClass( className: string, toggle: boolean ): this;

  /**
   * ( Fat ) 判断当前节点是否符合传入的要求
   * @param selector DOM 节点或 CSS 选择器或用来检测的方法
   */
  $is( selector: Element | string | Function ): boolean;

  /**
   * ( Fat ) 判断当前节点是否不符合传入的要求
   * @param selector DOM 节点或 CSS 选择器或用来检测的方法
   */
  $not( selector: Element | string | Function ): boolean;

  /**
   * ( Fat ) 获取当前节点下首个匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回首个子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $first( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点下首个匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回首个子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $firstChild( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点下最后一个匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回最后一个子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $last( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点下最后一个匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回最后一个子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $lastChild( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点的下一个匹配过滤条件的节点,
   * 若未传入过滤条件, 则直接返回当前节点的下一个节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $next( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点的上一个匹配过滤条件的节点,
   * 若未传入过滤条件, 则直接返回当前节点的上一个节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $prev( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取从当前节点后面的所有匹配过滤条件的兄弟节点,
   * 若未传入过滤条件, 则直接返回当前节点后面的所有兄弟节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $nextAll( filter?: Element | string | Function ): Element[];

  /**
   * ( Fat ) 获取从当前节点前面的所有匹配过滤条件的兄弟节点,
   * 若未传入过滤条件, 则直接返回当前节点前面的所有兄弟节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $prevAll( filter?: Element | string | Function ): Element[];

  /**
   * ( Fat ) 获取当前节点下的所有匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回所有子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $child( filter?: Element | string | Function ): Element[];

  /**
   * ( Fat ) 获取当前节点下的所有匹配过滤条件的子节点,
   * 若未传入过滤条件, 则返回所有子节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $children( filter?: Element | string | Function ): Element[];

  /**
   * ( Fat ) 获取当前节点的父节点, 可传入过滤条件对父节点进行过滤
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $parent( filter?: Element | string | Function ): Element | null;

  /**
   * ( Fat ) 获取当前节点的符合过滤条件的父节点, 未查找到会一直继续向上查找,
   * 若未传入过滤条件, 则直接返回当前节点的父节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   * @param checkSelf 是否从当前节点开始检测, 不从当前节点的父节点开始
   */
  $parents( filter?: Element | string | Function, checkSelf?: boolean ): Element | null;

  /**
   * ( Fat ) 获取当前节点的所有符合过滤条件的兄弟节点
   * 若未传入过滤条件, 则直接返回当前节点的所有兄弟节点
   * @param filter 过滤条件: 方法或者 DOM 节点或 CSS 选择器
   */
  $siblings( filter?: string | Function ): Element[];

  /**
   * ( Fat ) 获取元素的属性值 ( property )
   * @param name 属性名
   */
  $prop( name: string ): any;

  /**
   * ( Fat ) 批量设置元素的属性值 ( property )
   * @param props 属性值得键值对
   */
  $prop( props: {} ): this;

  /**
   * ( Fat ) 设置元素的属性值 ( property )
   * @param name 属性名
   * @param value 属性值
   */
  $prop( name: string, value: any ): this;

  /**
   * ( Fat ) 判断当前元素是否有传入属性值 ( property )
   * @param name 属性名
   */
  $hasProp( name: string ): boolean;

  /**
   * ( Fat ) 移除元素的属性值 ( property )
   * @param name 属性名
   */
  $removeProp( name: string ): this;

  /**
   * ( Fat ) 移除元素的属性值 ( property )
   * @param name 属性名
   */
  $deleteProp( name: string ): this;

  /**
   * ( Fat ) 获取元素的属性值 ( attribute )
   * @param name 属性名
   */
  $attr( name: string ): string | undefined;

  /**
   * ( Fat ) 批量设置元素的属性值 ( attribute )
   * @param attrs 属性值得键值对
   */
  $attr( attrs: {} ): this;

  /**
   * ( Fat ) 设置元素的属性值 ( attribute )
   * @param name 属性名
   * @param value 属性值
   */
  $attr( name: string, value: string ): this;

  /**
   * ( Fat ) 判断当前元素是否有传入属性值 ( attribute )
   * @param name 属性名
   */
  $hasAttr( name: string ): boolean;

  /**
   * ( Fat ) 移除元素的属性值 ( attribute )
   * @param name 属性名
   */
  $removeAttr( name: string ): this;

  /**
   * ( Fat ) 移除元素的属性值 ( attribute )
   * @param name 属性名
   */
  $deleteAttr( name: string ): this;

  /**
   * ( Fat ) 添加元素到当前元素内的尾部
   * @param elem 需要添加的元素
   * @returns 返回当前元素
   */
  $append( elem: Element ): this;

  /**
   * ( Fat ) 添加元素到当前元素内的头部
   * @param elem 需要添加的元素
   * @returns 返回当前元素
   */
  $prepend( elem: Element ): this;

  /**
   * ( Fat ) 添加当前元素到目标元素的尾部
   * @param elem 目标元素
   * @returns 返回当前元素
   */
  $appendTo( elem: Element ): this;

  /**
   * ( Fat ) 添加当前元素到目标元素的元素
   * @param elem 目标元素
   * @returns 返回当前元素
   */
  $prependTo( elem: Element ): this;

  /**
   * ( Fat ) 将目标元素插入到当前元素前面
   * @param elem 目标元素
   * @returns 返回当前元素
   */
  $before( elem: Element ): this;

  /**
   * ( Fat ) 将目标元素插入到当前元素后面
   * @param elem 目标元素
   * @returns 返回当前元素
   */
  $after( elem: Element ): this;

  /**
   * ( Fat ) 移除当前节点
   */
  $delete(): void;

  /**
   * ( Fat ) 移除当前节点
   */
  $remove(): void;

  /**
   * ( Fat ) 调用原生 querySelectorAll 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $query( selectors ): Element[];

  /**
   * ( Fat ) 调用原生 querySelectorAll 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $find( selectors ): Element[];

  /**
   * ( Fat ) 调用原生  querySelector 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $queryFirst( selectors ): Element | null;

  /**
   * ( Fat ) 调用原生  querySelector 方法
   * @param selectors 包含一个或多个要匹配的选择器的 DOMString
   */
  $findFirst( selectors ): Element | null;

  /**
   * ( Fat ) 将当前元素替换为新的元素
   * @param elem
   */
  $replaceWith( elem: Element ): void;

  /**
   * ( Fat ) 将当前元素替换为新的元素
   * @param elem
   */
  $replace( elem: Element ): void;

  /**
   * ( Fat ) 返回调用该方法的节点的一个副本
   * @param deep 是否采用深度克隆, 如果为 true, 则该节点的所有后代节点也都会被克隆, 如果为 false, 则只克隆该节点本身
   */
  $clone( deep?: boolean ): Element;

  /**
   * ( Fat ) 获取元素在父元素的下标
   */
  $index(): number;

  /**
   * ( Fat ) 将元素的下标设置为传入值 ( 将会移动元素 )
   * @param index 需要设置的元素下标
   */
  $index( index: number ): this;

  /**
   * ( Fat ) 读取元素的 innerHTML 值
   */
  $html(): string;

  /**
   * ( Fat ) 设置元素的 innerHTML 值
   * @param value 需要设置的值
   */
  $html( value: string ): this;

  /**
   * ( Fat ) 返回元素的 value 值
   */
  $val(): string;

  /**
   * ( Fat ) 设置元素的 value 值
   * @param value 需要设置的值
   */
  $val( value: string ): this;

  /**
   * ( Fat ) 返回元素的 value 值
   */
  $value(): string;

  /**
   * ( Fat ) 设置元素的 value 值
   * @param value 需要设置的值
   */
  $value( value: string ): this;

  /**
   * ( Fat ) 返回元素的宽度
   */
  $width(): number;

  /**
   * ( Fat ) 设置元素的宽度
   * @param value 需要设置的宽度
   */
  $width( value: number ): this;

  /**
   * ( Fat ) 返回元素的高度
   */
  $height(): number;

  /**
   * ( Fat ) 设置元素的高度
   * @param value 需要设置的高度
   */
  $height( value: number ): this;

  /**
   * ( Fat ) 获取元素的样式
   * @param name 样式名
   */
  $css( name: string ): string;

  /**
   * ( Fat ) 设置元素的样式
   * @param name 样式名
   * @param value 样式值
   */
  $css( name: string, value: string ): this;

  /**
   * ( Fat ) 读取时获取元素的小写 nodeName;
   * 不可写入
   */
  _nodeName: string;

}


interface EventTarget {

  /**
   * ( Fat ) 返回存储在对象上的全部数据
   */
  $data(): {};

  /**
   * ( Fat ) 读取指定名称的数据
   * @param name 需要读取的数据名称
   */
  $data( name: string ): any;

  /**
   * ( Fat ) 将数据进行存储
   * @param name 需要存储的数据名称
   * @param value 存储的数据
   * @param weakRead 当前值为 true 时, 视为读取, 当前名称下有数据返回数据, 如无数据, 将 value 赋值并返回
   */
  $data( name: string, value: any, weakRead?: boolean ): any;

  /**
   * ( Fat ) 判断当前对象下是否存有数据
   */
  $hasData(): boolean;

  /**
   * ( Fat ) 传入数据名称, 判断当前对象下是否存储了这个数据
   * @param {string} name 需要判断的数据名称
   */
  $hasData( name: string ): boolean;

  /**
   * ( Fat ) 删除存储在对象上的全部数据
   */
  $deleteData(): this;

  /**
   * ( Fat ) 传入数据名称, 删除当前对象下存储的相应名称的数据
   * @param {string} name 需要删除的数据名称, 多个可使用空格分隔
   */
  $deleteData( names: string ): this;

  /**
   * ( Fat ) 删除存储在对象上的全部数据
   */
  $removeData(): this;

  /**
   * ( Fat ) 传入数据名称, 删除当前对象下存储的相应名称的数据
   * @param {string} name 需要删除的数据名称, 多个可使用空格分隔
   */
  $removeData( names: string ): this;

  /**
   * ( Fat ) 传入键值对事件进行绑定
   * @param obj \{ 事件: 方法 }
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $on( obj: any, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入事件名和方法对事件进行绑定
   * @param types 需要绑定的事件名
   * @param listener 需要绑定到事件上的方法, 可为 boolean 值, 会自动替换为 return[ true | false ] 方法
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $on( types: string, listener: Function, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入键值对事件进行绑定, 只会执行一次
   * @param obj \{ 事件: 方法 }
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $one( obj: any, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入事件名和方法对事件进行绑定, 只会执行一次
   * @param types 需要绑定的事件名
   * @param listener 需要绑定到事件上的方法, 可为 boolean 值, 会自动替换为 return[ true | false ] 方法
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $one( types: string, listener: Function, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入键值对事件进行绑定, 只会执行一次
   * @param obj \{ 事件: 方法 }
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $once( obj: any, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入事件名和方法对事件进行绑定, 只会执行一次
   * @param types 需要绑定的事件名
   * @param listener 需要绑定到事件上的方法, 可为 boolean 值, 会自动替换为 return[ true | false ] 方法
   * @param selector 事件代理选择器
   * @param options 原生事件绑定参数, useCapture || { capture, passive, once }
   */
  $once( types: string, listener: Function, selector?: string, options?: any ): this;

  /**
   * ( Fat ) 传入事件名和方法进行事件移除
   * @param types 需要解绑的事件集
   * @param selector 事件委托选择器,
   *                 若不填, 则移除所有无事件委托选择器相关事件方法;
   *                 若值为 "*", 则移除所有事件委托选择器相关事件方法;
   *                 若值为 "**", 则移除所有相关事件方法, 不管有没有事件委托选择器;
   *                 为其他值, 则会移除匹配到的事件委托选择器的相关事件方法
   * @param listener 解绑的事件, 只会移除与传入方法匹配的相关事件方法
   */
  $off( types: string, selector?: string, listener?: Function ): this;

  /**
   * ( Fat ) 触发绑定在元素上的事件( 只触发事件 )
   * @param types 触发的事件名
   * @param data 向方法传递的数据, 可为多个
   */
  $emit( types: string, ...data: any[] ): this;

}


interface Document {

  /**
   * ( Plugins ) 读取页面所有 cookie, 以键值对返回
   */
  $cookie(): {};

  /**
   * ( Plugins ) 读取传入名称的页面 cookie
   * @param value 需要读取的 cookie 的值
   */
  $cookie( key: string ): string | undefined;

  /**
   * ( Plugins ) 设置页面 cookie
   * @param key 需要设置的 cookie 的名称
   * @param value 需要设置的 cookie 的值
   * @param attributes cookie 的配置
   */
  $cookie( key: string, value: string, attributes?: any ): string;

  /**
   * ( Plugins ) 删除页面指定 cookie
   * @param key 需要删除的 cookie 名称
   * @param attributes cookie 的配置
   */
  $deleteCookie( key: string, attributes?: any ): void;

  /**
   * ( Plugins ) 删除页面指定 cookie
   * @param key 需要删除的 cookie 名称
   * @param attributes cookie 的配置
   */
  $removeCookie( key: string, attributes?: any ): void;

}