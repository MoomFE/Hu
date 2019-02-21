import Lit from "../../shared/global/Lit/index";


const otherLit = window.Lit;

Lit.noConflict = () => {
  if( window.Lit === Lit ) window.Lit = otherLit;
  return Lit;
}

if( typeof window !== 'undefined' ){
  window.Lit = Lit;
}