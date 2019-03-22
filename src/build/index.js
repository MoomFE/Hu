import { assign } from '../shared/global/Object/index';


import Hu from '../shared/global/Hu/index';
import define from '../static/define/index';
import html, { render } from '../static/html/index';
import nextTick from '../static/nextTick/index';
import observeProto from '../static/observeProto/observeProto';
import '../static/observable/index';
import '../static/noConflict/index';


assign( Hu, {
  define,
  render,
  html,
  nextTick,
  observeProto
});


export default Hu;