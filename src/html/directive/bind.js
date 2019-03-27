import { directive } from 'lit-html';


export default directive(( obj, name ) => part => {
  const {
    committer: { element }
  } = part;

  console.log( element, part )
});