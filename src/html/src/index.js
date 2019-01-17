import { TemplateResult, defaultTemplateProcessor } from 'lit-html';


export const html = function( strings, ...values ){
  return new TemplateResult( strings, values, 'html', defaultTemplateProcessor );
}