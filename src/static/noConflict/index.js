import Hu from "../../core/index";
import { inBrowser } from "../../shared/const/env";


const otherHu = inBrowser ? window.Hu
                          : undefined;

Hu.noConflict = () => {
  if( inBrowser && window.Hu === Hu ) window.Hu = otherHu;
  return Hu;
}

if( inBrowser ){
  window.Hu = Hu;
}