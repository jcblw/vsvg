var vsvg = require( '../index' ),
    svg = vsvg.svg({ // creating svg
        width: '130', // attributes
        height: '120',
        class: 'bar'
    }),
    style = vsvg.style({
        type: 'text/css'
    }),
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

style.innerText = '.my-class{ stoke-width: 5px; }';

svg.appendChild( line ); // append node to another node
svg.insertBefore( style, line ); // append node before another node

console.log( svg.innerHTML );
console.log( svg.outerHTML ); //<svg xmlns="http://www.w3.org/2000/svg" width="130" height="120" class="bar" ><style  type="text/css" >.my-class{ stoke-width: 5px; }</style><line  x1="0" y1="0" x2="100" y2="100" class="my-class" style="stroke:black;" ></line></svg>