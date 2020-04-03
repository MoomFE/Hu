import HuConstructor from './HuConstructor';
import init from '../static/define/init/index';
import uid from '../shared/util/uid';
import initOptions from '../static/define/initOptions/index';


const Hu = new Proxy(HuConstructor, {
  // eslint-disable-next-line no-shadow
  construct(HuConstructor, [_userOptions]) {
    const name = `anonymous-${uid()}`;
    const [userOptions, options] = initOptions(false, name, _userOptions);
    const targetProxy = init(false, undefined, name, options, userOptions);

    return targetProxy;
  }
});

Hu.version = '__VERSION__';

export default Hu;
