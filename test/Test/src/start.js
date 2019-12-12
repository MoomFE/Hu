// ------

Reflect.defineProperty( window, 'customName', {
  get: () => `custom-element-${ ZenJS.guid }`
});

// ------

window.triggerEvent = function( target, type, process ){
  /**
   * 创建事件对象
   */
  const event = document.createEvent('HTMLEvents');

  // 如果想设置 initEvent 方法的 bubbles, cancelable 参数
  // 可以将 type 替换为数组
  // 数组内依次是 type, bubbles, cancelable
  if( !Array.isArray( type ) ){
    type = [ type, true, true ];
  }

  // 初始化事件对象
  event.initEvent( ...type );

  // 可传入方法对事件对象做其它处理
  if( process ) process( event, target );

  // 触发事件
  target.dispatchEvent( event );
};

// ------

window.stripExpressionMarkers = html => {
  return html.replace( /<!---->/g, '' );
}

// ------

{
  const templateResult = Hu.html`<!--${ null }-->`;
  const template = templateResult.getTemplateElement();

  window.templateMarker = template.content.firstChild.data.trim();
}

// ------

{
  const error = console.error;

  window.watchError = function( fn, msg ){
    const msgs = [];

    console.error = msg => {
      msgs.push( msg );
    };

    fn();

    console.error = error;

    if( Array.isArray( msg ) ){
      return expect( msgs ).is.deep.equals( msg );
    }else{
      return expect( msgs[0] ).is.equals( msg );
    }
  };
}

// ------

{
  let supportsPassive = false;

  try{
    
    const options = {};

    Reflect.defineProperty( options, 'passive', {
      get: () => {
        return supportsPassive = true;
      }
    });

    window.addEventListener( 'test-passive', null, options );

  }catch( error ){
    
  }

  window.supportsPassive = supportsPassive;
}

// ------

{
  let supportsForInTriggerProxyOwnKeys = false;

  const proxyObj = new Proxy({}, {
    ownKeys(){
      supportsForInTriggerProxyOwnKeys = true;
      return [];
    }
  });

  for( let item in proxyObj );

  window.supportsForInTriggerProxyOwnKeys = supportsForInTriggerProxyOwnKeys;
}

// ------