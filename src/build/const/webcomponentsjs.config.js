import { inBrowser } from "../../shared/const/env";


if( inBrowser ){
  window.WebComponents = Object.assign(
    {
      root: 'https://unpkg.com/@webcomponents/webcomponentsjs@%5E2/'
    },
    window.WebComponents
  );
}