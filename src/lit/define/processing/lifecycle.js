import $assign from "../../../shared/global/Object/$assign";


export default function lifecycle( options ){

  [
    "constructor",
    "connectedCallback",
    "disconnectedCallback",
    "updateStart",
    "updateEnd",
    "firstUpdated",
    "updated"
  ].forEach( lifecycle => {
    const events = [];

    options[ lifecycle ] = function(){
      events.forEach( fn => fn.apply( this, arguments ) )
    }

    $assign( true, options[ lifecycle ], {
      push(){
        [].push.apply( events, arguments );
      }
    });

  });

}