import { assign } from '../shared/global/Object/index';


import Hu from '../core/index';
import define from '../static/define/index';
import html, { render } from '../static/html/index';
import nextTick from '../static/nextTick/index';
import { observable } from '../static/observable/observe';
import util from '../static/util/index';
import '../static/noConflict/index';


assign( Hu, {
  define,
  render,
  html,
  nextTick,
  observable,
  util
});


export default Hu;