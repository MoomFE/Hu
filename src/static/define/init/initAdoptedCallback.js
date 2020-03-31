import callLifecycle from '../util/callLifecycle';
import { activeCustomElement } from '../const';


export default (options) => function (oldDocument, newDocument) {
  callLifecycle(activeCustomElement.get(this), 'adopted', options, [
    newDocument, oldDocument
  ]);
};
