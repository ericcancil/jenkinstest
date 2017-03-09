/**
 * Created by ecancil on 2/2/17.
 */

var t1 = "John downloaded the Pokemon Go app on 07/15/2016. By 07/22/2016, he was on level 24. Initially, he was very happy with the app. However, he soon became very disappointed with the app because it was crashing very often. As soon as he reached level 24, he uninstalled the app.";
var t2 = "Can I give it less than 1-Star?? Grrr. A trick brought me here so at least I didn't pay but BLEH!! The kind of magic he did is the kind where you just put a huge sheet up and go obviously do stuff and the magic is that like, apparently cloth is opaque? I dunno. Then there is this ridiculous backstory about his dad and stuff that would be *tolerable* if you like knew and were friends with this prick. As I was there to see magic and a hot douche bag doing it, the backstory was just pathetic. Oh, also ballet with rabbits. Couldn't make up it's mind if it was a ballet (which would have been cool), Magic (which would have been cool if it was like.. magic not illusions), or a diary of dips**t (which I guess could be considered comedy?). It fails miserably at all three. You suck if you go to see this and i hate your stupid face. trans friendly- Ugh.";
var t3 = "My Dear Patois, We had SUCH a good first date. I will fondly remember that night of passion forever...and the morning? OH GOSH, waking up to you was awesome! The oral sensation just blew me away -- especially your french toast....ohhhhh your french toast. But lately things have taken a turn for the worst. It seems you've grown complacent, my dear, and you've started to let yourself slip...";
var t4 = "i really love this place. i have been going since it opened. i had the hugest crush on the daughter of the owner and i would come in after class when i was in jr high and try and talk to her. but the skate store next door opened up and all the skaters got to her and one of them got her pregnant. i never saw her again. oh yeah, the donuts and good and they will usually hook you up with a free donut to try.";
var t5 = "Hua Min liked playing tennis. She first started playing on her 8th birthday - 07/07/1996. Playing tennis always made her happy. She won her first tournament on 08/12/2010. However, on 04/15/2015 when she was playing at the Flushing Meadows, she had a serious injury and had to retire from her tennis career.";

var texts = [t1, t2, t3, t4, t5];

for(var i = 0; i < texts.length; i ++){
    var Runner = require('./build/parse/ParserRunner');

    Runner.run(texts[i], [Runner.genderParser, Runner.dateParser, Runner.sentimentParser]).then(
        function(data){
            console.log(data);
        },
        function(error){
            //handle any errors that may happen here and reject
        }
    );
}