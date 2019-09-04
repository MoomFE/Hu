describe( 'Hu.html.directive', () => {

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( input )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <input ref="input" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.input.value ).is.equals( '1' );

    hu.value = '2'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '2' );
      expect( hu.$refs.input.value ).is.equals( '2' );

      hu.$refs.input.value = '3';
      triggerEvent( hu.$refs.input, 'input' );

      expect( hu.value ).is.equals( '3' );
      expect( hu.$refs.input.value ).is.equals( '3' );

      custom.$remove();

      hu.value = '4';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '3' );

        hu.$refs.input.value = '5';
        triggerEvent( hu.$refs.input, 'input' );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '5' );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '4' );

        hu.value = '6';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '6' );
          expect( hu.$refs.input.value ).is.equals( '6' );

          hu.$refs.input.value = '7';
          triggerEvent( hu.$refs.input, 'input' );

          expect( hu.value ).is.equals( '7' );
          expect( hu.$refs.input.value ).is.equals( '7' );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( textarea )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <textarea ref="input" :model=${[ this, 'value' ]}></textarea>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.input.value ).is.equals( '1' );

    hu.value = '2'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '2' );
      expect( hu.$refs.input.value ).is.equals( '2' );

      hu.$refs.input.value = '3';
      triggerEvent( hu.$refs.input, 'input' );

      expect( hu.value ).is.equals( '3' );
      expect( hu.$refs.input.value ).is.equals( '3' );

      custom.$remove();

      hu.value = '4';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '3' );

        hu.$refs.input.value = '5';
        triggerEvent( hu.$refs.input, 'input' );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '5' );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( '4' );
        expect( hu.$refs.input.value ).is.equals( '4' );

        hu.value = '6';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '6' );
          expect( hu.$refs.input.value ).is.equals( '6' );

          hu.$refs.input.value = '7';
          triggerEvent( hu.$refs.input, 'input' );

          expect( hu.value ).is.equals( '7' );
          expect( hu.$refs.input.value ).is.equals( '7' );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( checkbox )', ( done ) => {
    const customName = window.customName;


    Hu.define( customName, {
      data: () => ({
        value: true
      }),
      render( html ){
        return html`
          <input ref="checkbox" type="checkbox" :model=${[ this, 'value' ]} />
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( true );
    expect( hu.$refs.checkbox.checked ).is.equals( true );

    hu.value = false
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( false );
      expect( hu.$refs.checkbox.checked ).is.equals( false );

      hu.$refs.checkbox.checked = true;
      triggerEvent( hu.$refs.checkbox, 'change' );

      expect( hu.value ).is.equals( true );
      expect( hu.$refs.checkbox.checked ).is.equals( true );

      custom.$remove();

      hu.value = false;
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( true );

        triggerEvent( hu.$refs.checkbox, 'change' );

        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( true );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( false );
        expect( hu.$refs.checkbox.checked ).is.equals( false );

        hu.value = true;
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( true );
          expect( hu.$refs.checkbox.checked ).is.equals( true );

          hu.$refs.checkbox.checked = false;
          triggerEvent( hu.$refs.checkbox, 'change' );

          expect( hu.value ).is.equals( false );
          expect( hu.$refs.checkbox.checked ).is.equals( false );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( radio )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <input ref="input" type="radio" value="1" :model=${[ this, 'value' ]}>
          <input ref="input" type="radio" value="12" :model=${[ this, 'value' ]}>
          <input ref="input" type="radio" value="123" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.input[0].checked ).is.equals( true );
    expect( hu.$refs.input[1].checked ).is.equals( false );
    expect( hu.$refs.input[2].checked ).is.equals( false );

    hu.value = '12'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '12' );
      expect( hu.$refs.input[0].checked ).is.equals( false );
      expect( hu.$refs.input[1].checked ).is.equals( true );
      expect( hu.$refs.input[2].checked ).is.equals( false );

      hu.$refs.input[2].checked = true;
      triggerEvent( hu.$refs.input[2], 'change' );

      expect( hu.value ).is.equals( '123' );
      expect( hu.$refs.input[0].checked ).is.equals( false );
      expect( hu.$refs.input[1].checked ).is.equals( true );
      expect( hu.$refs.input[2].checked ).is.equals( true );
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '123' );
        expect( hu.$refs.input[0].checked ).is.equals( false );
        expect( hu.$refs.input[1].checked ).is.equals( false );
        expect( hu.$refs.input[2].checked ).is.equals( true );

        custom.$remove();
  
        hu.value = '1';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '1' );
          expect( hu.$refs.input[0].checked ).is.equals( false );
          expect( hu.$refs.input[1].checked ).is.equals( false );
          expect( hu.$refs.input[2].checked ).is.equals( true );
  
          hu.$refs.input[1].checked = true;
          triggerEvent( hu.$refs.input[1], 'change' );
  
          expect( hu.value ).is.equals( '1' );
          expect( hu.$refs.input[0].checked ).is.equals( false );
          expect( hu.$refs.input[1].checked ).is.equals( true );
          expect( hu.$refs.input[2].checked ).is.equals( true );
          hu.$nextTick(() => {
            expect( hu.value ).is.equals( '1' );
            expect( hu.$refs.input[0].checked ).is.equals( false );
            expect( hu.$refs.input[1].checked ).is.equals( true );
            expect( hu.$refs.input[2].checked ).is.equals( true );
  
            custom.$appendTo( document.body );
    
            expect( hu.value ).is.equals( '1' );
            expect( hu.$refs.input[0].checked ).is.equals( true );
            expect( hu.$refs.input[1].checked ).is.equals( false );
            expect( hu.$refs.input[2].checked ).is.equals( false );
    
            hu.value = '12';
            hu.$nextTick(() => {
              expect( hu.value ).is.equals( '12' );
              expect( hu.$refs.input[0].checked ).is.equals( false );
              expect( hu.$refs.input[1].checked ).is.equals( true );
              expect( hu.$refs.input[2].checked ).is.equals( false );
    
              hu.$refs.input[2].checked = true;
              triggerEvent( hu.$refs.input[2], 'change' );
    
              expect( hu.value ).is.equals( '123' );
              expect( hu.$refs.input[0].checked ).is.equals( false );
              expect( hu.$refs.input[1].checked ).is.equals( true );
              expect( hu.$refs.input[2].checked ).is.equals( true );
              hu.$nextTick(() => {
                expect( hu.value ).is.equals( '123' );
                expect( hu.$refs.input[0].checked ).is.equals( false );
                expect( hu.$refs.input[1].checked ).is.equals( false );
                expect( hu.$refs.input[2].checked ).is.equals( true );
    
                custom.$remove();
      
                done();
              });
            });
          });
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后又被加回文档流, 指令的绑定的值应该立即更新', ( done ) => {
    const customName = window.customName;
    let index = 0;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        index++;
        return html`
          <input ref="input" :model=${[ this, 'value' ]}>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    hu.value = '2';
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( hu.value ).is.equals( '2' );
      expect( hu.$refs.input.value ).is.equals( '2' );

      custom.$remove();

      hu.value = '3';
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( hu.value ).is.equals( '3' );
        expect( hu.$refs.input.value ).is.equals( '2' );

        custom.$appendTo( document.body );

        expect( index ).is.equals( 2 );
        expect( hu.value ).is.equals( '3' );
        expect( hu.$refs.input.value ).is.equals( '3' );

        hu.value = '4';
        hu.$nextTick(() => {
          expect( index ).is.equals( 2 );
          expect( hu.value ).is.equals( '4' );
          expect( hu.$refs.input.value ).is.equals( '4' );

          custom.$remove();

          done();
        });
      });
    });
  });

  it( '使用 :model 指令的自定义元素实例中, 自定义元素被从文档流移除后, 指令的绑定会被解绑 ( Select )', ( done ) => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        value: '1'
      }),
      render( html ){
        return html`
          <select ref="select" :model=${[ this, 'value' ]}>
            <option value="1">11</option>
            <option value="12">1212</option>
            <option value="123">123123</option>
          </select>
        `;
      }
    });

    const custom = document.createElement( customName ).$appendTo( document.body );
    const hu = custom.$hu;

    expect( hu.value ).is.equals( '1' );
    expect( hu.$refs.select.value ).is.equals( '1' );

    hu.value = '12'
    hu.$nextTick(() => {
      expect( hu.value ).is.equals( '12' );
      expect( hu.$refs.select.value ).is.equals( '12' );

      hu.$refs.select.value = '123';
      triggerEvent( hu.$refs.select, 'change' );

      expect( hu.value ).is.equals( '123' );
      expect( hu.$refs.select.value ).is.equals( '123' );

      custom.$remove();

      hu.value = '1';
      hu.$nextTick(() => {
        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '123' );

        hu.$refs.select.value = '12';
        triggerEvent( hu.$refs.select, 'change' );

        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '12' );

        custom.$appendTo( document.body );

        expect( hu.value ).is.equals( '1' );
        expect( hu.$refs.select.value ).is.equals( '1' );

        hu.value = '12';
        hu.$nextTick(() => {
          expect( hu.value ).is.equals( '12' );
          expect( hu.$refs.select.value ).is.equals( '12' );

          hu.$refs.select.value = '123';
          triggerEvent( hu.$refs.select, 'change' );

          expect( hu.value ).is.equals( '123' );
          expect( hu.$refs.select.value ).is.equals( '123' );

          custom.$remove();

          done();
        });
      });
    });
  });


  it( '使用 :text 指令的方式, 对元素内容进行插入 ( textContent )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :text=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text.$replaceAll('<','&lt;')
          .$replaceAll('>','&gt;')
    );
  });

  it( '使用 :text 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :text=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :text=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :text 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :text=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :text 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :text=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :text 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :text=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :html 指令的方式, 对元素内容进行插入 ( innerHTML )', () => {
    const div = document.createElement('div');
    let text = '<span>123</span>'

    Hu.render( div )`
      <div :html=${ text }></div>
    `;

    expect( div.firstElementChild.innerHTML ).is.equals(
      text
    );
  });

  it( '使用 :html 指令插入 null 或 undefined 将会转为空字符串', () => {
    const div = document.createElement('div');

    Hu.render( div )`<div :html=${ null }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);

    Hu.render( div )`<div :html=${ undefined }></div>`;
    expect( div.innerHTML ).is.equals(`<!----><div></div><!---->`);
  });

  it( '使用 :html 指令插入 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${{ }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: 123 }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": 123\n}</div>
    `);

    Hu.render( div )`
      <div :html=${{ asd: [ 123 ] }}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>{\n  "asd": [\n    123\n  ]\n}</div>
    `);
  });

  it( '使用 :html 指令插入数组将会使用 JSON.stringify 进行格式化输出', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${[ ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, 2, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  2,\n  3\n]</div>
    `);

    Hu.render( div )`
      <div :html=${[ 1, { asd: 123 }, 3 ]}></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>[\n  1,\n  {\n    "asd": 123\n  },\n  3\n]</div>
    `);
  });

  it( '使用 :html 指令时, 首次传入的是 undefined, 元素的内容应该被清空', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :html=${ undefined }>123</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div></div>
    `);
  });


  it( '使用 :show 指令对元素进行显示和隐藏', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');

    Hu.render( div )`
      <div :show=${ true }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('');

    Hu.render( div )`
      <div :show=${ false }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });

  it( '使用 :show 指时, 首次传入的是 undefined, 元素的状态应该是隐藏的', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :show=${ undefined }></div>
    `;
    expect( div.firstElementChild.style.display ).is.equals('none');
  });


  it( '使用不存在的指令, 将会被当做普通属性处理', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <div :zhang-wei=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':zhang-wei') ).equals('666');

    Hu.render( div )`
      <div :toString=${ 666 }></div>
    `;
    expect( div.firstElementChild.getAttribute(':tostring') ).equals('666');
  });

});