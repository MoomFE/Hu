import $assign from "../../../shared/global/Object/$assign";


export default function liefCycle( options ){

  [
    "constructor",
    "connectedCallback",
    "disconnectedCallback",
    "updateStart",
    "updateEnd",
    "firstUpdated",
    "updated"
  ].forEach( liefCycle => {
    const events = [];

    options[ liefCycle ] = function(){
      events.forEach( fn => fn.apply( this, arguments ) )
    }

    $assign( true, options[ liefCycle ], {
      push(){
        [].push.apply( events, arguments );
      }
    });

  });

}