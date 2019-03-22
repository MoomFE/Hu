import { observeProtoHooks } from "./index";


/**
 * 修复某些内置对象使用了内部插槽而引起的问题
 */
export default function observeProto( constructor, options ){
  observeProtoHooks.set( constructor, options );
}

observeProto.hooks = observeProtoHooks;


observeProto( Map, {
  internalSlots: true
});

observeProto( Set, {
  internalSlots: true
});

observeProto( WeakMap, {
  internalSlots: true
});

observeProto( WeakSet, {
  internalSlots: true
});

observeProto( Date, {
  internalSlots: true
});