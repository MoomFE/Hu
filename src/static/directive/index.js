import { userDirectives } from "../../html/core/templateProcessor";


export default ( id, directiveClass ) => {
  
  // 获取已注册的指令
  if( !directiveClass ){
    return userDirectives[ id ];
  }

  // 注册指令
  userDirectives[ id ] = directiveClass;

}