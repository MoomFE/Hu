!function(){
  mocha.setup('bdd');


  window.expect = chai.expect;
  window.should = chai.should();

  Reflect.defineProperty( window, 'customName', {
    get(){
      return `custom-element-${ ZenJS.guid }`;
    }
  });

  window.stripExpressionMarkers = html => {
    return html.replace( /<!---->/g, '' );
  }

  window.triggerEvent = ( target, type, process ) => {
    const event = document.createEvent('HTMLEvents');

    event.initEvent( type, true, true );

    if( type === 'click' ) event.button = 0;
    if( process ) process( event );

    target.dispatchEvent( event );
  }

  {
    const error = console.error;

    window.errorMsg = void 0;

    window.errorStart = function(){
      console.error = msg => {
        errorMsg = msg;
      };
    }

    window.errorEnd = function(){
      console.error = error;
    }
  }

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

    }catch(e){}

    window.supportsPassive = supportsPassive;
  }

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

}();