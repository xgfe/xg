/**
 * logo string for console to output
 *               ---______
 *              -XXXXXXXXXXXXXX-__
 *               -XXXXXXXXXXXXXXXXXXXX-___
 *                 -XXXXX-     _   ____
 *                         GGGGG  GGGGGGGGGGG
 *                   - GGGGGGGG  GGGGGGGGG     G 
 *                GGGG  GGGGGG	GGGGGG     GGGGGGG  \
 *             GGGGGGGG  GGGG  GGG     GGGGGGGGGGGG  |
 *          GGGGGGGGGGGG  G  G    GGGGGGGGGGGGGGGGG  X
 *        --------    _      ---------------------   XX
 *      GGGGGGGGGGG    G  G  GGGGGGGGGGGGGGGGGGGG    XXX
 *     GGGGGGGG    GGGG  GGG  GGGGGGGGGGGGGGGGGG    XXXX
 *    GGGG     GGGGGGG  GGGGG   GGGGGGGGGGGGGGG    XXXXX
 *   GG    GGGGGGGGG   GGGGGGG   GGGGGGGGGGGG     XXXXXX
 *     GGGGGGGGGGG   GGGGGGGGGGG  GGGGGGGG       XXXXXXX
 *   GGGGGGGGGGGG   GGGGGGGGGGGGG   GGG        XXXXXXXXX
 *     GGGGGGGG   GGGGGGGGGGGGGGGG          XXXXXXXXXXX
 *        GGG   GGGGGGGGGGGGG            XXXXXXXXXXXXX
 *      \       GGGGGGG              XXXXXXXXXXXXXXX
 *        \X\                   XXXXXXXXXXXXXXXXXX
 *           XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *              XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *                   XXXXXXXXXXXXXXXXXXXX
 *                         XXXXXXX  
 */

var x256 = require('x256');
var green = '\x1b[38;5;' + x256(138, 205, 37) + 'm';
var orange = '\x1b[38;5;' + x256(250, 199, 46) + 'm';
var rOrange = '\x1b[38;5;' + x256(253, 134, 40) + 'm';

console.log(''
	+ green   + '               ---______' + '\n'
	+ green   + '              -XXXXXXXXXXXXXX-__' + '\n'
	+ green   + '               -XXXXXXXXXXXXXXXXXXXX-___' + '\n'
	+ green   + '                 -XXXXX-' + orange + '     _   ____' + '\n'
	+ orange  + '                         GGGGG  GGGGGGGGGGG' + '\n'
	+ orange  + '                   - GGGGGGGG  GGGGGGGGG     G' + '\n'
	+ orange  + '                GGGG  GGGGGG	GGGGGG     GGGGGGG' + rOrange + ' \\' + '\n'
	+ orange  + '             GGGGGGGG  GGGG  GGG     GGGGGGGGGGGG' + rOrange + '  |' + '\n'
	+ orange  + '          GGGGGGGGGGGG  G  G    GGGGGGGGGGGGGGGGG' + rOrange + '  X' + '\n'
	+ orange  + '        --------    _      ---------------------' + rOrange + '   XX' + '\n'
	+ orange  + '      GGGGGGGGGGG    G  G  GGGGGGGGGGGGGGGGGGGG' + rOrange + '    XXX' + '\n'
	+ orange  + '     GGGGGGGG    GGGG  GGG  GGGGGGGGGGGGGGGGGG' + rOrange + '    XXXX' + '\n'
	+ orange  + '    GGGG     GGGGGGG  GGGGG   GGGGGGGGGGGGGGG' + rOrange + '    XXXXX' + '\n'
	+ orange  + '   GG    GGGGGGGGG   GGGGGGG   GGGGGGGGGGGG' + rOrange + '     XXXXXX' + '\n'
	+ orange  + '     GGGGGGGGGGG   GGGGGGGGGGG  GGGGGGGG' + rOrange + '       XXXXXXX' + '\n'
	+ orange  + '   GGGGGGGGGGGG   GGGGGGGGGGGGG   GGG' + rOrange + '        XXXXXXXXX' + '\n'
	+ orange  + '     GGGGGGGG   GGGGGGGGGGGGGGGG' + rOrange + '          XXXXXXXXXXX' + '\n'
	+ orange  + '        GGG   GGGGGGGGGGGGG' + rOrange + '            XXXXXXXXXXXXX' + '\n'
	+ rOrange + '      \\' + orange + '       GGGGGGG' + rOrange + '              XXXXXXXXXXXXXXX' + '\n'
	+ rOrange + '        \\X\\                   XXXXXXXXXXXXXXXXXX' + '\n'
	+ rOrange + '           XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + '\n'
	+ rOrange + '              XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + '\n'
	+ rOrange + '                   XXXXXXXXXXXXXXXXXXXX' + '\n'
	+ rOrange + '                         XXXXXXX' + '\n' 
	+ '\x1b[0m'
);