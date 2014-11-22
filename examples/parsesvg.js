var fs = require( 'fs' ),
    parser = require( '../src/parser' ),
     util = require( 'util' ),
    vsvg = require( '../src/' );

fs.readFile( __dirname + '/chart.svg', { encoding: 'utf8' }, function( err, file ) {
    if ( err ) throw err;
    var parsed = parser.parse( file );
    // console.log( util.inspect( parsed, { depth: Infinity, colors: true } ) );

    var elem = eachTag( parsed[ 0 ] );
    elem.setAttribute( 'vsvg', 'true' );
    
    fs.writeFile( './examples/converted-chart.svg', elem.toHTML(), console.log.bind( console ) );

} );

var colorArray = [ '#b1b2b3', '#5babdd', '#33aa7b', '#2e76a4' ];

function eachTag( tag ) {
    
    var elem;
    if ( tag.tagName ) {
        elem = vsvg[ tag.tagName ]( tag.attributes );
        if ( elem.children ) {        
            for( var i = 0; i < tag.children.length; i += 1 ) {
                var _elem = eachTag( tag.children[ i ] );
                if ( typeof _elem === 'string' ) {
                    elem.innerText = _elem;
                } else {
                    elem.appendChild( _elem );
                }
            }
        }

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
            console.log( attributes );
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



        return elem;
    }

    return tag.text;

}


