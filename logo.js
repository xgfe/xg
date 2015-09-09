/**
 * @file logo string for console to output
 * @authors yuebin (yuebin@meituan.com)
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

var os = require('os');

var colors = require('colors');
var x256 = require('x256');

var green = '\x1b[38;5;' + x256(138, 205, 37) + 'm';
var orange = '\x1b[38;5;' + x256(250, 199, 46) + 'm';
var rOrange = '\x1b[38;5;' + x256(253, 134, 40) + 'm';

var logoStr = '';
if (os.platform() === 'win32') {
	logoStr = ''
		+ '               ---______'.green + '\n'
		+ '              -XXXXXXXXXXXXXX-__'.green + '\n'
		+ '               -XXXXXXXXXXXXXXXXXXXX-___'.green + '\n'
		+ '                 -XXXXX-'.green + '     _   ____'.yellow + '\n'
		+ '                         GGGGG  GGGGGGGGGGG'.yellow + '\n'
		+ '                   - GGGGGGGG  GGGGGGGGG     G'.yellow + '\n'
		+ '                GGGG  GGGGGG	GGGGGG     GGGGGGG'.yellow + ' \\'.red + '\n'
		+ '             GGGGGGGG  GGGG  GGG     GGGGGGGGGGGG'.yellow + '  |'.red + '\n'
		+ '          GGGGGGGGGGGG  G  G    GGGGGGGGGGGGGGGGG'.yellow + '  X'.red + '\n'
		+ '        --------    _      ---------------------'.yellow + '   XX'.red + '\n'
		+ '      GGGGGGGGGGG    G  G  GGGGGGGGGGGGGGGGGGGG'.yellow + '    XXX'.red + '\n'
		+ '     GGGGGGGG    GGGG  GGG  GGGGGGGGGGGGGGGGGG'.yellow + '    XXXX'.red + '\n'
		+ '    GGGG     GGGGGGG  GGGGG   GGGGGGGGGGGGGGG'.yellow + '    XXXXX'.red + '\n'
		+ '   GG    GGGGGGGGG   GGGGGGG   GGGGGGGGGGGG'.yellow + '     XXXXXX'.red + '\n'
		+ '     GGGGGGGGGGG   GGGGGGGGGGG  GGGGGGGG'.yellow + '       XXXXXXX'.red + '\n'
		+ '   GGGGGGGGGGGG   GGGGGGGGGGGGG   GGG'.yellow + '        XXXXXXXXX'.red + '\n'
		+ '     GGGGGGGG   GGGGGGGGGGGGGGGG'.yellow + '          XXXXXXXXXXX'.red + '\n'
		+ '        GGG   GGGGGGGGGGGGG'.yellow + '            XXXXXXXXXXXXX'.red + '\n'
		+ '      \\'.red + '       GGGGGGG'.yellow + '              XXXXXXXXXXXXXXX'.red + '\n'
		+ '        \\X\\                   XXXXXXXXXXXXXXXXXX'.red + '\n'
		+ '           XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.red + '\n'
		+ '              XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'.red + '\n'
		+ '                   XXXXXXXXXXXXXXXXXXXX'.red + '\n'
		+ '                         XXXXXXX'.red + '\n'
} else {
	logoStr = ''
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
}

console.log(logoStr);