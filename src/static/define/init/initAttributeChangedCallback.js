import isEqual from '../../../shared/util/isEqual';
import { observeProxyMap } from '../../observable/observe';
import { activeCustomElement } from '../const';


export default (propsMap) => function (name, oldValue, value) {
  if (value === oldValue) return;

  const { $props: propsTargetProxy } = activeCustomElement.get(this);
  const { target: propsTarget } = observeProxyMap.get(propsTargetProxy);
  const props = propsMap[name];

  // eslint-disable-next-line no-shadow
  for (const { name, from } of props) {
    const fromValue = from(value);

    isEqual(propsTarget[name], fromValue) || (
      propsTargetProxy[name] = fromValue
    );
  }
};
