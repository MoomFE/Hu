import { optionsMap } from '../initOptions/index';
import { apply } from '../../../shared/global/Reflect/index';


export default (
  targetProxy,
  lifecycle,
  options = optionsMap[targetProxy.$info.name],
  args = []
) => {
  const fns = options[lifecycle];

  if (fns) {
    for (const fn of fns) apply(fn, targetProxy, args);
  }

  targetProxy.$emit(`hook:${lifecycle}`, ...args);
};
