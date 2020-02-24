import { userDirectives, directives } from "../../html/const";


export default function directive( name, directive ){

  // 获取已注册的指令
  if( !directive ){
    return userDirectives[ name ] || directives[ name ];
  }

  // 注册指令
  userDirectives[ name ] = directive;

}