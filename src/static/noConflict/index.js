import Hu from "../../shared/global/Hu/index";


const otherHu = window.Hu;

Hu.noConflict = () => {
  if( window.Hu === Hu ) window.Hu = otherHu;
  return Hu;
}

if( typeof window !== 'undefined' ){
  window.Hu = Hu;
}