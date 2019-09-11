describe( 'Issues', () => {

  it( '#1', () => {
    const customName = window.customName;

    Hu.define( customName, {
      data: () => ({
        someDiv: [
          Hu.html`<div>1</div>`,
          Hu.html`<div>2</div>`
        ]
      }),
      render( html ){
        return html`<div>${ this.someDiv }</div>`
      }
    });

    document.createElement('div').$html(`<${ customName }></${ customName }>`).$appendTo( document.body ).$remove();
  });

  it( '#2', ( done ) => {
    const iframe = document.createElement('iframe').$appendTo( document.body );
    const iframeDocument = iframe.contentWindow.document;
    const guid = ZenJS.guid;

    window.addEventListener( 'message', function message({ data }){
      if( data.guid === guid ){
        iframe.$remove();
        window.removeEventListener( 'message', message );

        expect(`{}`).is.equals(
          stripExpressionMarkers( data.html ).trim()
        );

        done();
      }
    });

    iframeDocument.open().write(`
      <body>
        <div></div>

        <script src="./Lib/hu.js"></script>
        <script src="./Lib/bundles/webcomponents-sd-ce-pf.js"></script>
        <script>
          const div = document.body.firstElementChild;

          Hu.render( div )\`
            \${{}}
          \`;

          window.parent.postMessage({
            guid: ${ guid },
            html: div.innerHTML
          });
        </script>
      </body>
    `);
    iframeDocument.close();
  });

  it( '#3', () => {
    const div = document.createElement('div');

    Hu.render( div )`
      <!-- <img src=${ 123 }> -->
　　  <span>${ 456 }</span>
    `;

    expect( '456' ).is.equals(
      stripExpressionMarkers( div.firstElementChild.innerHTML )
    );
  });

  it( '#4', ( done ) => {
    Promise.all([
      // Vue
      new Promise(( resolve ) => {
        let result;
        let index = 0;
        const vm = new Vue({
          data: {
            a: {
              aa: 1,
              b: {
                bb: 2,
                c: {
                  cc: 3
                }
              }
            }
          },
          watch: {
            a: {
              deep: true,
              handler: value => {
                result = JSON.stringify( value );
                index++
              }
            }
          }
        });

        vm.a.aa = 2;
        vm.$nextTick(() => {
          expect( result ).is.equals(`{"aa":2,"b":{"bb":2,"c":{"cc":3}}}`);
          expect( index ).is.equals( 1 );

          vm.a.b.bb = 2;
          vm.$nextTick(() => {
            expect( result ).is.equals(`{"aa":2,"b":{"bb":2,"c":{"cc":3}}}`);
            expect( index ).is.equals( 1 );

            resolve();
          });
        });
      }),
      // Hu
      new Promise(( resolve ) => {
        let result;
        let index = 0;
        const hu = new Hu({
          data: {
            a: {
              aa: 1,
              b: {
                bb: 2,
                c: {
                  cc: 3
                }
              }
            }
          },
          watch: {
            a: {
              deep: true,
              handler: value => {
                result = JSON.stringify( value );
                index++
              }
            }
          }
        });

        hu.a.aa = 2;
        hu.$nextTick(() => {
          expect( result ).is.equals(`{"aa":2,"b":{"bb":2,"c":{"cc":3}}}`);
          expect( index ).is.equals( 1 );

          hu.a.b.bb = 2;
          hu.$nextTick(() => {
            expect( result ).is.equals(`{"aa":2,"b":{"bb":2,"c":{"cc":3}}}`);
            expect( index ).is.equals( 1 );

            resolve();
          });
        });
      })
    ]).then(() => done());
  });

  it( '#7', () => {
    const customName = window.customName;
    const div = document.createElement('div').$appendTo( document.body ).$prop({
      id: customName
    });

    new Hu({
      el: div,
      styles: `
        #${ customName }{
          color: #FFF
        }
      `
    });

    expect( true ).is.equals(
      [ '#FFF', '#fff', 'rgb(255, 255, 255)' ].$inArray(
        div.$css('color')
      )
    );

    div.$remove();
  });

  it( '#11', () => {
    const customName = window.customName;

    Hu.define( customName );

    const custom = document.createElement( customName );
    const hu = custom.$hu;

    expect( custom.addEventListener ).is.equals( hu.$on );
    expect( custom.removeEventListener ).is.equals( hu.$off );
  });

  it( '#16', () => {
    expect( Hu.util.isIterable( 'undefined' ) ).is.true;
    expect( Hu.util.isIterable( 'null' ) ).is.true;
    expect( Hu.util.isIterable( 'asd' ) ).is.true;
    expect( Hu.util.isIterable( '' ) ).is.true;
  });

  it( '#19', ( done ) => {
    const div = document.createElement('div');
    const {
      render, html, observable,
      nextTick,
      directive, directiveFn
    } = Hu;

    const data = observable({
      text: 1
    });

    const outputMap = new Map();
    const hu = new Hu();
    const output = directiveFn( class{
      constructor( part ){
        this.part = part;
      }
      commit( prefix ){
        if( outputMap.get( this.part ) && this.prefix !== prefix ){
          this.destroy();
        }

        outputMap.set(
          this.part,
          hu.$watch(
            () => data.text,
            {
              immediate: true,
              handler: ( value ) => this.part.commit( `${ prefix }: ${ value }` )
            }
          )
        );
      }
      destroy(){
        outputMap.get( this.part )();
      }
    });

    render( div )`${
      output('asd')
    }`;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`asd: 1`);

    data.text++;
    nextTick(() => {
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`asd: 2`);

      render( div )`${
        output('fgh')
      }`;
      expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`fgh: 2`);

      data.text++;
      nextTick(() => {
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`fgh: 3`);

        render( div )`${
          null
        }`;
        expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

        data.text++;
        nextTick(() => {
          expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(``);

          done();
        });
      });
    });
  });

});