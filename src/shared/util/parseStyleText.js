import cached from "./cached";
import rListDelimiter from "../const/rListDelimiter";
import rPropertyDelimiter from "../const/rPropertyDelimiter";


export default
/**
 * 解析 style 字符串, 转换为 JSON 格式
 * @param {String} value
 */
cached( styleText => {
  const styles = {};

  styleText.split( rListDelimiter ).forEach( item => {
    if( item ){
      const tmp = item.split( rPropertyDelimiter );

      if( tmp.length > 1 ){
        styles[ tmp[0].trim() ] = tmp[1].trim();
      }
    }
  });

  return styles;
});