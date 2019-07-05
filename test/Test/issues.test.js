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

  it( '#5', ( done ) => {
    Promise.all([
      // Vue
      new Promise(( resolve ) => {
        let result;
        const vm = new Vue({
          data: {
            a: []
          },
          watch: {
            a: ([ first ]) => result = first
          }
        });

        vm.a.unshift( 1 );
        vm.$nextTick(() => {
          expect( result ).is.equals( 1 );

          vm.a.unshift( 2 );
          vm.$nextTick(() => {
            expect( result ).is.equals( 2 );

            vm.a.unshift( 3 );
            vm.$nextTick(() => {
              expect( result ).is.equals( 3 );

              resolve();
            });
          });
        });
      }),
      // Hu
      new Promise(( resolve ) => {
        let result;
        const hu = new Hu({
          data: {
            a: []
          },
          watch: {
            a: ([ first ]) => result = first
          }
        });

        hu.a.unshift( 1 );
        hu.$nextTick(() => {
          expect( result ).is.equals( 1 );

          hu.a.unshift( 2 );
          hu.$nextTick(() => {
            expect( result ).is.equals( 2 );

            hu.a.unshift( 3 );
            hu.$nextTick(() => {
              expect( result ).is.equals( 3 );

              resolve();
            });
          });
        });
      })
    ]).then(() => done());
  });

});