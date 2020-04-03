import isFunction from '../../shared/util/isFunction';
import { apply } from '../../shared/global/Reflect/index';
import Hu from '../../core/Hu';
import create from '../../shared/util/create';
import NodePart from '../../html/core/node';
import ClassDirective from '../../html/directive/class';
import HtmlDirective from '../../html/directive/html';
import ModelDirective from '../../html/directive/model';
import ShowDirective from '../../html/directive/show';
import StyleDirective from '../../html/directive/style';
import TextDirective from '../../html/directive/text';
import AttributeCommitter, { AttributePart } from '../../html/directiveBasic/attribute';
import BasicBooleanDirective from '../../html/directiveBasic/boolean';
import BasicEventDirective from '../../html/directiveBasic/event';
import BasicPropertyDirective from '../../html/directiveBasic/property';


const installed = new Set();
const privateOptions = create({

  // 基础指令
  directiveBasic: create({
    Node: NodePart,
    Attr: AttributeCommitter,
    AttrPart: AttributePart,
    Boolean: BasicBooleanDirective,
    Event: BasicEventDirective,
    Prop: BasicPropertyDirective
  }),

  // 内置功能指令
  directive: create({
    Class: ClassDirective,
    Html: HtmlDirective,
    Model: ModelDirective,
    Show: ShowDirective,
    Style: StyleDirective,
    Text: TextDirective,
  })

});

export default function (plugin, ...args) {
  if (installed.has(plugin)) {
    return Hu;
  }

  args.unshift(Hu, privateOptions);

  if (isFunction(plugin.install)) {
    apply(plugin.install, plugin, args);
  } else if (isFunction(plugin)) {
    apply(plugin, null, args);
  }

  installed.add(plugin);

  return Hu;
}
