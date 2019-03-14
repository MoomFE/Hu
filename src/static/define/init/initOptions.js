import { observe } from "../../observable/util/observe";


export default function initOptions( root, options, target, targetProxy, userOptions ){
  target.$options = observe( userOptions, {
    set: { before: () => 0 }
  });
}