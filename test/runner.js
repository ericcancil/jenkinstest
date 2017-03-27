var expect = require("chai").expect;
var parserRunner = require("../build/parse/ParserRunner");


describe("Test Parser Runner", function() {
    describe("Test gender parsing", function() {
        var maleWords = ['man', 'male', 'guy', 'he'];
        for(var i = 0; i < maleWords.length; i ++){
            var mword = maleWords[i];
            it("finds male for " + mword, function() {
                return parserRunner.genderParser('test text test text ' + mword, {}).then(function(data){
                    expect(data.gender).to.equal('malea');
                })
            });
        }
 
        var femaleWords = ['woman', 'female', 'girl', 'she'];
        for(var i = 0; i < femaleWords.length; i ++){
            var fword = femaleWords[i];
            it("finds female for " + fword, function() {
                return parserRunner.genderParser('test text test text ' + fword, {}).then(function(data){
                    expect(data.gender).to.equal('female');
                })
            });
        }

        for(var i = 0; i < femaleWords.length; i ++){
            var fword2 = femaleWords[i];
            var mword2 = maleWords[i];
            it("is ambguous for 1 male and one female ", function() {
                return parserRunner.genderParser(mword2 + ' test text test text ' + fword2, {}).then(function(data){
                    expect(data.gender).to.equal('unkown');
                })
            });
        }
    });

    describe("Test date parsing", function() {
        var t1 = "John downloaded the Pokemon Go app on 07/15/2016. By 07/22/2016, he was on level 24. Initially, he was very happy with the app. However, he soon became very disappointed with the app because it was crashing very often. As soon as he reached level 24, he uninstalled the app.";
        var t2 = "Hua Min liked playing tennis. She first started playing on her 8th birthday - 07/07/1996. Playing tennis always made her happy. She won her first tournament on 08/12/2010. However, on 04/15/2015 when she was playing at the Flushing Meadows, she had a serious injury and had to retire from her tennis career.";


        it("is 7 days long", function(){
            return parserRunner.dateParser(t1, {}).then(function(data){
                expect(data.timeDuration.totalDuration).to.equal(7);
            })
        });

        it("is 6856 days long", function(){
            return parserRunner.dateParser(t2, {}).then(function(data){
                expect(data.timeDuration.totalDuration).to.equal(6856);
            })
        });

    });

    describe("Test sentiment parsing", function() {
        var t1 = "Can I give it less than 1-Star?? Grrr. A trick brought me here so at least I didn't pay but BLEH!! The kind of magic he did is the kind where you just put a huge sheet up and go obviously do stuff and the magic is that like, apparently cloth is opaque? I dunno. Then there is this ridiculous backstory about his dad and stuff that would be *tolerable* if you like knew and were friends with this prick. As I was there to see magic and a hot douche bag doing it, the backstory was just pathetic. Oh, also ballet with rabbits. Couldn't make up it's mind if it was a ballet (which would have been cool), Magic (which would have been cool if it was like.. magic not illusions), or a diary of dips**t (which I guess could be considered comedy?). It fails miserably at all three. You suck if you go to see this and i hate your stupid face. trans friendly- Ugh.";
        var t2 = "i really love this place. i have been going since it opened. i had the hugest crush on the daughter of the owner and i would come in after class when i was in jr high and try and talk to her. but the skate store next door opened up and all the skaters got to her and one of them got her pregnant. i never saw her again. oh yeah, the donuts and good and they will usually hook you up with a free donut to try.";
        var t3 = "good great terrible awful";
        var t4 = "no words either way";

        it("it is a negative sentiment text", function(){
            return parserRunner.sentimentParser(t1, {}).then(function(data){
                expect(data.sentiment.overallSentiment).to.equal('negative');
            })
        });

        it("it is a positive sentiment text", function(){
            return parserRunner.sentimentParser(t2, {}).then(function(data){
                expect(data.sentiment.overallSentiment).to.equal('positive');
            })
        });

        it("it is a negative mixed text", function(){
            return parserRunner.sentimentParser(t3, {}).then(function(data){
                expect(data.sentiment.overallSentiment).to.equal('mixed');
            })
        });

        it("it is an unkown sentiment text", function(){
            return parserRunner.sentimentParser(t4, {}).then(function(data){
                expect(data.sentiment.overallSentiment).to.equal('unkown');
            })
        });
    });

    describe("Test the runner itself", function() {
        var t1 = "Hua Min liked playing tennis. She first started playing on her 8th birthday - 07/07/1996. Playing tennis always made her happy. She won her first tournament on 08/12/2010. However, on 04/15/2015 when she was playing at the Flushing Meadows, she had a serious injury and had to retire from her tennis career.";

        it("days are correct", function(){
            return parserRunner.run(t1, [parserRunner.dateParser, parserRunner.genderParser, parserRunner.sentimentParser]).then(function(data){
                expect(data.timeDuration.totalDuration).to.equal(6856);
                expect(data.gender).to.equal('female');
                expect(data.sentiment.overallSentiment).to.equal('positive');
            })
        });
        it("gender is correct", function(){
            return parserRunner.run(t1, [parserRunner.dateParser, parserRunner.genderParser, parserRunner.sentimentParser]).then(function(data){
                expect(data.gender).to.equal('female');
            })
        });
        it("sentiment is correct", function(){
            return parserRunner.run(t1, [parserRunner.dateParser, parserRunner.genderParser, parserRunner.sentimentParser]).then(function(data){
                expect(data.sentiment.overallSentiment).to.equal('positive');
            })
        });
    });


});