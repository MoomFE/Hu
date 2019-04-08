import Hu from "../../core/index";


const otherHu = window.Hu;

Hu.noConflict = () => {
  if( window.Hu === Hu ) window.Hu = otherHu;
  return Hu;
}

if( typeof window !== 'undefined' ){
  window.Hu = Hu;
}