var fs = require( 'fs' ),
    util = require( 'util' ),
    vsvg = require( '../src/' );

fs.readFile( __dirname + '/chart.svg', { encoding: 'utf8' }, function( err, file ) {
    if ( err ) throw err;

    var parserElems = vsvg.parse( file ),
        elem = parserElems[ 0 ];
    // console.log( util.inspect( parserELems, { depth: Infinity, colors: true } ) );

    styleElem( elem );
    elem.setAttribute( 'vsvg', 'true' );
    
    fs.writeFile( './examples/converted-chart.svg', elem.toHTML(), console.log.bind( console ) );

} );

var colorArray = [ '#b1b2b3', '#5babdd', '#33aa7b', '#2e76a4' ];

function styleElem( elem ) {

    if ( !elem.tagName ) {
        return;
    }

    elem.children.forEach( styleElem );

    if ( elem.tagName === 'svg' ) {
        var rect = vsvg.rect( {
            width: '981',
            height: '305',
            fill: 'white'
        } );
        elem.insertBefore( rect, elem.children[ 0 ] );
    }

    if ( elem.tagName === 'polygon' ) {
        elem.setAttribute( 'fill', '#b1b2b3' );
    }

    if ( elem.tagName === 'foreignObject' ) {
        var attributes = elem.attributes;
        attributes.style = {
            dx: '100',
            dy: '100',
            'font-family': 'sans',
            padding: '5px'
        };
        var text = vsvg.text( attributes );
        text.setAttribute( 'text-anchor', 'start' );
        text.innerText = elem.innerText;
        elem = text;
    }


    if ( elem.tagName === 'line' ) {
        if ( elem.attributes.class === 'ct-bar' ) {
            elem.setAttribute( 'stroke', colorArray.shift() );
            elem.setAttribute( 'stroke-width', '5%' );                
        }
        else {
            elem.setAttribute( 'stroke', 'rgba(0,0,0,0.2)' );
            elem.setAttribute( 'stroke-width', '1' );                
            elem.setAttribute( 'stroke-dasharray', '2' );
        }
    }
    

}


