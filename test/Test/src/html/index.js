/* global stripExpressionMarkers, templateMarker */
/* eslint-disable no-unused-expressions */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';


describe('html', () => {
  const render = Hu.render;

  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo(document.body);
  });
  afterEach(() => {
    div && div.$remove();
  });


  it('渲染文本节点', () => {
    render(div)`测试`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('测试');

    render(div)`
      测试
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      测试
    `);

    render(div)`
      测试`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      测试`);

    render(div)`测试
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`测试
    `);
  });

  it('渲染元素节点', () => {
    render(div)`
      <div></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div></div>
    `);

    render(div)`
      <div>123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>123</div>
    `);

    render(div)`
      <div class="asd"></div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div class="asd"></div>
    `);

    render(div)`
      <div class="asd">123</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div class="asd">123</div>
    `);

    render(div)`
      1<div>2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div>2</div>3
    `);

    render(div)`
      1<div class="asd">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">2</div>3
    `);
  });

  it('渲染注释节点', () => {
    render(div)`
      <!---->
    `;
    expect(div.innerHTML).is.equals(`<!---->
      <!---->
    <!---->`);

    render(div)`
      <!-- -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- -->
    `);

    render(div)`
      <!-- comment -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- comment -->
    `);

    render(div)`
      1<!-- 2 -->3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<!-- 2 -->3
    `);

    render(div)`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>1</div>2<div>3</div><!-- 4 --><div>5</div>6<div>7</div>
    `);

    render(div)`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>1</div>2<div>3</div><!-- <div>4</div> --><div>5</div>6<div>7</div>
    `);
  });

  it('渲染文本节点 - 使用插值绑定', () => {
    render(div)`${'123'}测试`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('123测试');

    render(div)`测试${'123'}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('测试123');

    // ------

    render(div)`${'123'}
      测试
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      测试
    `);

    render(div)`
      ${'123'}测试
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123测试
    `);

    render(div)`
      测试${'123'}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      测试123
    `);

    render(div)`
      测试
    ${'123'}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      测试
    123`);

    // ------

    render(div)`${'123'}
      测试`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      测试`);

    render(div)`
      ${'123'}测试`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123测试`);

    render(div)`
      测试${'123'}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      测试123`);

    // ------

    render(div)`${123}测试
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123测试
    `);

    render(div)`测试${123}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`测试123
    `);

    render(div)`测试
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`测试
    123`);
  });

  it('渲染元素节点 - 使用插值绑定', () => {
    render(div)`${123}
      1<div class="asd">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      1<div class="asd">2</div>3
    `);

    render(div)`
      ${123}1<div class="asd">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1231<div class="asd">2</div>3
    `);

    render(div)`
      1${123}<div class="asd">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1123<div class="asd">2</div>3
    `);

    render(div)`
      1<div class="${123}asd">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="123asd">2</div>3
    `);

    render(div)`
      1<div class="asd${123}">2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd123">2</div>3
    `);

    render(div)`
      1<div class="asd">${123}2</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">1232</div>3
    `);

    render(div)`
      1<div class="asd">2${123}</div>3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">2123</div>3
    `);

    render(div)`
      1<div class="asd">2</div>${123}3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">2</div>1233
    `);

    render(div)`
      1<div class="asd">2</div>3${123}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">2</div>3123
    `);

    render(div)`
      1<div class="asd">2</div>3
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1<div class="asd">2</div>3
    123`);
  });

  it('渲染注释节点 - 使用插值绑定', () => {
    render(div)`<!--${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}-->`);

    render(div)`
      <!--${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}-->
    `);

    render(div)`
      <!--${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}-->`);

    render(div)`<!--${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}-->
    `);

    // ------

    render(div)`<!-- ${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker} -->`);

    render(div)`
      <!-- ${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker} -->
    `);

    render(div)`
      <!-- ${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker} -->`);

    render(div)`<!-- ${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker} -->
    `);

    // ------

    render(div)`<!-- ${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}-->`);

    render(div)`
      <!-- ${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}-->
    `);

    render(div)`
      <!-- ${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}-->`);

    render(div)`<!-- ${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}-->
    `);

    // ------

    render(div)`<!--${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker} -->`);

    render(div)`
      <!--${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker} -->
    `);

    render(div)`
      <!--${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker} -->`);

    render(div)`<!--${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker} -->
    `);
  });

  it('渲染文本节点 - 使用多个插值绑定', () => {
    render(div)`${123}测试${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('123测试123');

    render(div)` ${123}测试${123} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(' 123测试123 ');

    render(div)`${123} 测试 ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('123 测试 123');

    // ------

    render(div)`${123}
      测试
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      测试
    123`);

    render(div)` ${123}
      测试
    ${123} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` 123
      测试
    123 `);

    render(div)`${123}
      ${123}测试${123}
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      123测试123
    123`);

    render(div)`${123}
      ${123} 测试 ${123}
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      123 测试 123
    123`);

    // ------

    render(div)`${123}
      测试${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      测试123`);

    render(div)` ${123}
      测试 ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` 123
      测试 123`);

    render(div)` ${123}
      测试 ${123} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` 123
      测试 123 `);

    render(div)`${123}
      ${123}测试${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      123测试123`);

    render(div)`${123}
      ${123} 测试 ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      123 测试 123`);

    // ------

    render(div)`${123}测试
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123测试
    123`);

    render(div)` ${123}测试
    ${123} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` 123测试
    123 `);

    render(div)`${123} 测试
     ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123 测试
     123`);

    render(div)`${123}测试${123}
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123测试123
    123`);

    render(div)`${123} 测试 ${123}
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123 测试 123
    123`);
  });

  it('渲染元素节点 - 使用多个插值绑定', () => {
    render(div)`
      1${123}<div class="asd">2</div>${123}3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1123<div class="asd">2</div>1233
    `);

    render(div)`
      1 ${123} <div class="asd">2</div> ${123} 3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1 123 <div class="asd">2</div> 123 3
    `);

    // ------

    render(div)`
      1${123}<div class="${123}asd${123}">2</div>${123}3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1123<div class="123asd123">2</div>1233
    `);

    render(div)`
      1 ${123} <div class=" ${123} asd ${123} ">2</div> ${123} 3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1 123 <div class=" 123 asd 123 ">2</div> 123 3
    `);

    // ------

    render(div)`
      1${123}<div class="${123}asd${123}">${123}2${123}</div>${123}3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1123<div class="123asd123">1232123</div>1233
    `);

    render(div)`
      1 ${123} <div class=" ${123} asd ${123} "> ${123} 2 ${123} </div> ${123} 3
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3
    `);

    // ------

    render(div)`
      ${123}1${123}<div class="${123}asd${123}">${123}2${123}</div>${123}3${123}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      1231123<div class="123asd123">1232123</div>1233123
    `);

    render(div)`
       ${123} 1 ${123} <div class=" ${123} asd ${123} "> ${123} 2 ${123} </div> ${123} 3 ${123}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
       123 1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3 123
    `);

    // ------

    render(div)`${123}
      ${123}1${123}<div class="${123}asd${123}">${123}2${123}</div>${123}3${123}
    ${123}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123
      1231123<div class="123asd123">1232123</div>1233123
    123`);

    render(div)` ${123}
       ${123} 1 ${123} <div class=" ${123} asd ${123} "> ${123} 2 ${123} </div> ${123} 3 ${123}
     ${123} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` 123
       123 1 123 <div class=" 123 asd 123 "> 123 2 123 </div> 123 3 123
     123 `);
  });

  it('渲染注释节点 - 使用多个插值绑定', () => {
    render(div)`<!--${123}${123}${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}${templateMarker}${templateMarker}-->`);

    render(div)`
      <!--${123}${123}${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}${templateMarker}${templateMarker}-->
    `);

    render(div)`
      <!--${123}${123}${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}${templateMarker}${templateMarker}-->`);

    render(div)`<!--${123}${123}${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}${templateMarker}${templateMarker}-->
    `);

    // ------

    render(div)`<!-- ${123}${123}${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}${templateMarker}${templateMarker} -->`);

    render(div)`
      <!-- ${123}${123}${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}${templateMarker}${templateMarker} -->
    `);

    render(div)`
      <!-- ${123}${123}${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}${templateMarker}${templateMarker} -->`);

    render(div)`<!-- ${123}${123}${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}${templateMarker}${templateMarker} -->
    `);

    // ------

    render(div)`<!--${123}${123}${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}${templateMarker}${templateMarker} -->`);

    render(div)`
      <!--${123}${123}${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}${templateMarker}${templateMarker} -->
    `);

    render(div)`
      <!--${123}${123}${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}${templateMarker}${templateMarker} -->`);

    render(div)`<!--${123}${123}${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}${templateMarker}${templateMarker} -->
    `);

    // ------

    render(div)`<!-- ${123}${123}${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}${templateMarker}${templateMarker}-->`);

    render(div)`
      <!-- ${123}${123}${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}${templateMarker}${templateMarker}-->
    `);

    render(div)`
      <!-- ${123}${123}${123}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker}${templateMarker}${templateMarker}-->`);

    render(div)`<!-- ${123}${123}${123}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker}${templateMarker}${templateMarker}-->
    `);

    // ------

    render(div)`<!-- ${123} ${123} ${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker} ${templateMarker} ${templateMarker} -->`);

    render(div)`
      <!-- ${123} ${123} ${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker} ${templateMarker} ${templateMarker} -->
    `);

    render(div)`
      <!-- ${123} ${123} ${123} -->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- ${templateMarker} ${templateMarker} ${templateMarker} -->`);

    render(div)`<!-- ${123} ${123} ${123} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!-- ${templateMarker} ${templateMarker} ${templateMarker} -->
    `);
  });

  it('渲染文本节点 - 类似属性绑定的文本节点', () => {
    render(div)`attr=${1}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('attr=1');

    render(div)` attr=${1} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(' attr=1 ');

    render(div)`
      attr=${1}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr=1
    `);

    render(div)`attr=${1}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`attr=1
    `);

    render(div)` attr=${1}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` attr=1
    `);

    render(div)`
      attr=${1}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr=1`);

    render(div)`
      attr=${1} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr=1 `);

    // ------

    render(div)`attr1=${1} attr2=${2} attr3=${3}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('attr1=1 attr2=2 attr3=3');

    render(div)` attr1=${1} attr2=${2} attr3=${3} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(' attr1=1 attr2=2 attr3=3 ');

    render(div)`
      attr1=${1} attr2=${2} attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1 attr2=2 attr3=3
    `);

    render(div)`attr1=${1} attr2=${2} attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`attr1=1 attr2=2 attr3=3
    `);

    render(div)` attr1=${1} attr2=${2} attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` attr1=1 attr2=2 attr3=3
    `);

    render(div)`
      attr1=${1} attr2=${2} attr3=${3}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1 attr2=2 attr3=3`);

    render(div)`
      attr1=${1} attr2=${2} attr3=${3} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1 attr2=2 attr3=3 `);

    // ------

    render(div)`attr1=${1}attr2=${2}attr3=${3}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('attr1=1attr2=2attr3=3');

    render(div)` attr1=${1}attr2=${2}attr3=${3} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(' attr1=1attr2=2attr3=3 ');

    render(div)`
      attr1=${1}attr2=${2}attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1attr2=2attr3=3
    `);

    render(div)`attr1=${1}attr2=${2}attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`attr1=1attr2=2attr3=3
    `);

    render(div)` attr1=${1}attr2=${2}attr3=${3}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(` attr1=1attr2=2attr3=3
    `);

    render(div)`
      attr1=${1}attr2=${2}attr3=${3}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1attr2=2attr3=3`);

    render(div)`
      attr1=${1}attr2=${2}attr3=${3} `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      attr1=1attr2=2attr3=3 `);
  });

  it('渲染注释节点 - 类似属性绑定的注释节点', () => {
    render(div)`
      <!--attr=${1}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--attr=${templateMarker}-->
    `);

    render(div)`
      <!-- attr=${1} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- attr=${templateMarker} -->
    `);

    // ------

    render(div)`
      <!--attr1=${1} attr2=${1} attr3=${1}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--attr1=${templateMarker} attr2=${templateMarker} attr3=${templateMarker}-->
    `);

    render(div)`
      <!-- attr1=${1} attr2=${1} attr3=${1} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- attr1=${templateMarker} attr2=${templateMarker} attr3=${templateMarker} -->
    `);

    // ------

    render(div)`
      <!--attr1=${1}attr2=${1}attr3=${1}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--attr1=${templateMarker}attr2=${templateMarker}attr3=${templateMarker}-->
    `);

    render(div)`
      <!-- attr1=${1}attr2=${1}attr3=${1} -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- attr1=${templateMarker}attr2=${templateMarker}attr3=${templateMarker} -->
    `);
  });

  it('同时渲染文本节点及元素节点', () => {
    render(div)`${1}2${3}<div>${4}5${6}</div>${7}8${9}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('123<div>456</div>789');

    render(div)`
      ${1}2${3}<div>${4}5${6}</div>${7}8${9}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123<div>456</div>789
    `);

    // ------

    render(div)`1${2}3<div>4${5}6</div>7${8}9`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('123<div>456</div>789');

    render(div)`
      1${2}3<div>4${5}6</div>7${8}9
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123<div>456</div>789
    `);

    // ------

    render(div)`<div>${4}5${6}</div>`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('<div>456</div>');

    render(div)`
      <div>${4}5${6}</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>456</div>
    `);

    // ------

    render(div)`<div>4${5}6</div>`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals('<div>456</div>');

    render(div)`
      <div>4${5}6</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>456</div>
    `);
  });

  it('同时渲染文本节点及注释节点', () => {
    render(div)`${1}2${3}<!--${4}5${6}-->${7}8${9}`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123<!--${templateMarker}5${templateMarker}-->789`);

    render(div)`
      ${1}2${3}<!--${4}5${6}-->${7}8${9}
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123<!--${templateMarker}5${templateMarker}-->789
    `);

    // ------

    render(div)`1${2}3<!--4${5}6-->7${8}9`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`123<!--4${templateMarker}6-->789`);

    render(div)`
      1${2}3<!--4${5}6-->7${8}9
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      123<!--4${templateMarker}6-->789
    `);

    // ------

    render(div)`<!--${4}5${6}-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--${templateMarker}5${templateMarker}-->`);

    render(div)`
      <!--${4}5${6}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}5${templateMarker}-->
    `);

    // ------

    render(div)`<!--4${5}6-->`;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`<!--4${templateMarker}6-->`);

    render(div)`
      <!--4${5}6-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--4${templateMarker}6-->
    `);
  });

  it('同时渲染元素节点与注释节点', () => {
    render(div)`
      <!--${1}--><div class=${2}>${3}</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!--${templateMarker}--><div class="2">3</div>
    `);

    render(div)`
      <!-- <div class=${1}>${2}</div> --><div class=${3}>${4}<!-- ${5} -->${6}</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <!-- <div class=${templateMarker}>${templateMarker}</div> --><div class="3">4<!-- ${templateMarker} -->6</div>
    `);

    // ------

    render(div)`
      <div class=${2}>${3}</div><!--${1}-->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div class="2">3</div><!--${templateMarker}-->
    `);

    render(div)`
      <div class=${3}>${4}<!-- ${5} -->${6}</div><!-- <div class=${1}>${2}</div> -->
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div class="3">4<!-- ${templateMarker} -->6</div><!-- <div class=${templateMarker}>${templateMarker}</div> -->
    `);
  });

  it('同时渲染文本节点及元素节点及注释节点', () => {
    render(div)`
      <div>1${2}3<!--${4}-->5${6}7</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>123<!--${templateMarker}-->567</div>
    `);

    render(div)`
      <div>1${2}3<!-- ${4} ${5} -->6${7}8</div>
    `;
    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>123<!-- ${templateMarker} ${templateMarker} -->678</div>
    `);
  });

  it('渲染 template 元素节点内的内容', () => {
    render(div)`
      <div>'123'</div>
      <template>
        <div>${123}-${456}-${789}</div>
      </template>
      <div>'123'</div>
    `;

    expect(stripExpressionMarkers(div.innerHTML)).is.equals(`
      <div>'123'</div>
      <template>
        <div>123-456-789</div>
      </template>
      <div>'123'</div>
    `);
  });

  it('在插值绑定中使用 null 或 undefined 将会转为空字符串', () => {
    render(div)`${null}`;
    expect(div.innerHTML).is.equals('<!----><!----><!----><!---->');

    render(div)`${undefined}`;
    expect(div.innerHTML).is.equals('<!----><!----><!----><!---->');

    render(div)` ${null} `;
    expect(div.innerHTML).is.equals('<!---->  <!---->');

    render(div)` ${undefined} `;
    expect(div.innerHTML).is.equals('<!---->  <!---->');

    render(div)`<div class=${null}>${null}</div>`;
    expect(div.innerHTML).is.equals('<!----><div class=""><!----><!----></div><!---->');

    render(div)`<div class=${undefined}>${undefined}</div>`;
    expect(div.innerHTML).is.equals('<!----><div class=""><!----><!----></div><!---->');
  });

  it('在插值绑定中使用 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    render(div)`${
      {}
    }`;
    expect(div.innerHTML).is.equals('<!----><!---->{}<!----><!---->');

    render(div)`${
      { asd: 123 }
    }`;
    expect(div.innerHTML).is.equals('<!----><!---->{\n  "asd": 123\n}<!----><!---->');

    render(div)`${
      { asd: [123] }
    }`;
    expect(div.innerHTML).is.equals('<!----><!---->{\n  "asd": [\n    123\n  ]\n}<!----><!---->');
  });
});
