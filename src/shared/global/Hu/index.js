import HuConstructor from "./hu";
import init from "../../../static/define/init/index";
import uid from "../../util/uid";
import initOptions from "../../../static/define/initOptions/index";


const Hu = new Proxy( HuConstructor, {
  construct( HuConstructor, [ _userOptions ] ){
    const name = 'anonymous-' + uid();
    const [ userOptions, options ] = initOptions( false, name, _userOptions );
    const targetProxy = init( false, void 0, name, options, userOptions );

    return targetProxy;
  }
});

Hu.version = '__VERSION__';

export default Hu;