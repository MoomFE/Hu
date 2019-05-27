import ClassDirective from '../directive/class';
import StyleDirective from '../directive/style';
import ModelDirective from '../directive/model';
import TextDirective from '../directive/text';
import HtmlDirective from '../directive/html';
import ShowDirective from '../directive/show';
import create from '../../shared/util/create';
import { random } from "../../shared/global/Math/index";


/**
 * 内置指令
 */
export const directives = create({
  class: ClassDirective,
  style: StyleDirective,
  model: ModelDirective,
  text: TextDirective,
  html: HtmlDirective,
  show: ShowDirective
});

/**
 * 用户定义指令
 */
export const userDirectives = create({

});

/**
 * 指令方法合集
 */
export const directiveFns = new WeakSet();

/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
export const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

export const boundAttributeSuffix = '$hu$';
export const boundAttributeSuffixLength = boundAttributeSuffix.length;

export const marker = `{{hu-${ String( random() ).slice(2) }}}`;
export const nodeMarker = `<!--${ marker }-->`;
export const markerRegex = new RegExp(`${ marker }|${ nodeMarker }`);

export const commentMarker = ` ${ marker } `;
export const commentMarkerRegex = new RegExp( commentMarker, 'g' );