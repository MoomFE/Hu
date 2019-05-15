import Hu from "../../core/index";
import { inBrowser } from "../../shared/const/env";


const otherHu = inBrowser ? window.Hu
                          : void 0;

Hu.noConflict = () => {
  if( inBrowser && window.Hu === Hu ) window.Hu = otherHu;
  return Hu;
}

if( inBrowser ){
  window.Hu = Hu;
}