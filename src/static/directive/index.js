import Hu from "../../core/index";
import { userDirectives } from "../../html/core/templateProcessor";


Hu.directive = ( id, directiveClass ) => {
  
  // 获取已注册的指令
  if( !directiveClass ){
    return userDirectives[ id ];
  }

  // 注册指令
  userDirectives[ id ] = directiveClass;

}