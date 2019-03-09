import each from "../../../shared/util/each";


export default function initWatch( root, options, target, targetProxy ){
  // 添加监听方法
  each( options.watch, target.$watch );
}