import { assign } from '../shared/global/Object/index';


import Hu from '../core/Hu';
import define from '../static/define/index';
import staticRender from '../static/render/index';
import nextTick from '../static/nextTick/index';
import { observable } from '../static/observable/observe';
import util from '../static/util/index';
import html from '../html/html';
import directive from '../static/directive/index';
import directiveFn from '../static/directiveFn/index';
import use from '../static/use/index';


assign(Hu, {
  define,
  render: staticRender,
  html,
  nextTick,
  observable,
  util,
  directive,
  directiveFn,
  use
});


export default Hu;
