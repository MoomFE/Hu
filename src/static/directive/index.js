import { userDirectives, directives } from "../../html/const";
import commitPart from "../../html/util/commitPart";
import destroyPart from "../../html/util/destroyPart";


export default function directive( name, directive ){
  
  // 获取已注册的指令
  if( !directive ){
    return userDirectives[ name ] || directives[ name ];
  }

  // 注册指令
  userDirectives[ name ] = directive;

}

// 指令提交更改方法
directive.commit = commitPart;
// 指令注销方法
directive.destroy = destroyPart;