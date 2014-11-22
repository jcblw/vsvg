
// export out src svg
var vsvg = require( './src/' );

module.exports = vsvg;

if ( typeof window === 'object' ) {
    window.vsvg = vsvg;
}