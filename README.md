# vsvg ( virtual SVG ) [![Build Status](https://travis-ci.org/jcblw/vsvg.svg?branch=master)](https://travis-ci.org/jcblw/vsvg)

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/vsvg.svg)](https://greenkeeper.io/)

vsvg is a small lib that allow you to create svg's server side or client side. Its still in early devlopment so expect bug and file issues.

## Install

    $ npm install vsvg

You can also use it with your [Browserify](http://browserify.org) bundles.

## Usage

vsvg exports an singleton with methods that corresponds to svg tags.

```javascript
var vsvg = require( 'vsvg' ),
    svg = vsvg.svg({ // creating svg
        width: '130', // attributes
        height: '120',
        class: 'bar'
    }),
    style = vsvg.style(),
    line = vsvg.line({ // creating line
        x1: 0, // attributes
        y1: 0,
        x2: 100,
        y2: 100,
        class: 'my-class',
        style: { // style objects
            stroke: 'black'
        }
    });

style.innerText = '.my-class{ stoke-width: 5px; }'; // set inner text

style.setAttribute( 'type', 'text/css' );
conosle.log( style.getAttibute( 'type' ) ); // text/css

svg.appendChild( line ); // append node to another node
svg.insertBefore( style, line ); // append node before another node

console.log( svg.outerHTML ); /* <svg xmlns="http://www.w3.org/2000/svg" width="130" height="120" class="bar" ><style  type="text/css" >.my-class{ stoke-width: 5px; }</style><line  x1="0" y1="0" x2="100" y2="100" class="my-class" style="stroke:black;" ></line></svg> */

console.log( svg.innerHTML ); /* <style  type="text/css" >.my-class{ stoke-width: 5px; }</style><line  x1="0" y1="0" x2="100" y2="100" class="my-class" style="stroke:black;" ></line> */

svg.toHTML(); // alias of outerHTML

```

