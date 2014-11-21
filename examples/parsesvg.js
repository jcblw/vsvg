var fs = require( 'fs' ),
    parser = require( '../src/parser' ),
    util = require( 'util' );

fs.readFile( __dirname + '/letter.svg', { encoding: 'utf8' }, function( err, file ) {
    if ( err ) throw err;
    console.log( util.inspect( parser.parse( file ), { depth: Infinity, colors: true } ) );
} );
