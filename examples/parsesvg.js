var fs = require( 'fs' ),
    parser = require( '../src/parser' ),
    util = require( 'util' ),
    vsvg = require( '../src/' );

fs.readFile( __dirname + '/letter.svg', { encoding: 'utf8' }, function( err, file ) {
    if ( err ) throw err;
    var parsed = parser.parse( file );
    // console.log( util.inspect( parsed, { depth: Infinity, colors: true } ) );

    var elem = eachTag( parsed[ 0 ] );
    elem.setAttribute( 'vsvg', 'true' );
    
    fs.writeFile( './examples/converted-letter.svg', elem.toHTML(), console.log.bind( console ) );

} );

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

        if ( elem.tagName === 'path' && elem.getAttribute( 'fill' ) !== 'none' ) {
            elem.setAttribute( 'fill', 'tomato' );
        }

        return elem;
    }

    return tag.text;

}


