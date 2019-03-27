!function(){
  mocha.setup('bdd');


  window.expect = chai.expect;
  window.should = chai.should();

  Reflect.defineProperty( window, 'customName', {
    get(){
      return `custom-element-${ ZenJS.guid }`;
    }
  });

  window.triggerEvent = ( target, type, process ) => {
    const event = document.createEvent('HTMLEvents');

    event.initEvent( type, true, true );

    if( type === 'click' ) event.button = 0;
    if( process ) process( event );

    target.dispatchEvent( event );
  }

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

}();