import { marker, Template } from "../../../node_modules/lit-html/lib/template";


const templateCaches = new Map();

export default result => {
  let templateCache = templateCaches.get( result.type );

  if( !templateCache ){
    templateCaches.set(
      result.type,
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      }
    );
  }

  let template = templateCache.stringsArray.get( result.strings );

  if( template ){
    return template;
  }

  const key = result.strings.join( marker );

  template = templateCache.keyString.get( key );

  if( !template ){
    templateCache.keyString.set(
      key,
      template = new Template(
        result,
        result.getTemplateElement()
      )
    );
  }

  templateCache.stringsArray.set( result.strings, template );

  return template;
};