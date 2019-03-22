
export const observeProtoHooks = new Map();

/**
 * 
 */
export default ( constructor, options ) => {
  observeProtoHooks.set( constructor, options );
}