var fs = require('fs')
exports.run = function(text, parsers){
    var result = {};

    var job = function(resolve, reject){
        runSingle(parsers, 0, text, result, function(){
            //done
            resolve(result);

            //handle any errors that may happen here and reject
        })
    }

    return getPromise(job);
}

exports.dateParser = function(text, resultObject){
    var job = function(resolve, reject){

        function Pair(){
            this.datePair = [];
            this.wordIndex = [];
        }

        var s = text.split(" ");

        var pair = new Pair();

        var pairs = [];

        var earliestDate;
        var latestDate;

        for(i = 0; i < s.length; i ++){
            var regexp = /((?=\d{4})\d{4}|(?=[a-zA-Z]{3})[a-zA-Z]{3}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3})/;
            var w = s[i].replace(/\.|\,/gi, '');
            var test = regexp.test(w);

            if(test){
                pair.datePair.push(w);
                pair.wordIndex.push(i);

                if(!earliestDate){
                    earliestDate = new Date(w);
                }else{
                    var d = new Date(w);
                    if(d < earliestDate)earliestDate = d;
                }
                if(!latestDate){
                    latestDate = new Date(w);
                }else{
                    var d = new Date(w);
                    if(d > earliestDate)earliestDate = d;
                }

                if(pair.datePair.length == 2){
                    pairs.push(pair);
                    pair = new Pair();
                }
            }

        }

        var timeDiff, days;

        if(earliestDate && latestDate){
            timeDiff = Math.abs(latestDate.getTime() - earliestDate.getTime());
            days = Math.ceil(timeDiff / (1000 * 3600 * 24));

        }

        resultObject.timeDuration = {pairs : pairs, totalDuration : timeDiff && days ? days : 'n/a'};

        resolve(resultObject);

        //handle any errors that may happen here and reject
    }
    return getPromise(job);
}

exports.sentimentParser = function(text, resultObject){
    //simple basic idea of sentiment parsing
    var job = function(resolve, reject){
        var positiveSentimentMap;
        var negativeSentimentMap;

        //asynchronous data load - here is where promises in the parsers help
        fs.readFile('./data/negativeSentiments.txt', 'utf8', function(err, data){
            negativeSentimentMap = data.split('\n');
            fs.readFile('./data/positiveSentiments.txt', 'utf8', function(err, data){
                positiveSentimentMap = data.split('\n');
                calc();
            });
        })

        function calc(){
            function SentimentVO(){
                this.negativeWords = [];
                this.positiveWords = [];
                this.overallSentiment;
            }

            var vo = new SentimentVO();

            var negativeSentimentScore = 0;
            var positiveSentimentScore = 0;
            var s = text.replace(/\.|\,/gi, '').split(' ');
            for(var i = 0; i < s.length; i ++){
                if(positiveSentimentMap.includes(s[i]) && !vo.positiveWords.includes(s[i])){
                    vo.positiveWords.push(s[i]);
                    positiveSentimentScore ++;
                }
                if(negativeSentimentMap.includes(s[i])  && !vo.negativeWords.includes(s[i])){
                    vo.negativeWords.push(s[i]);
                    negativeSentimentScore ++;
                }
            }
            var sentiment;
            if(negativeSentimentScore > 0 && positiveSentimentScore > 0 && negativeSentimentScore == positiveSentimentScore){
                sentiment = 'mixed';
            }else
            if(negativeSentimentScore == 0 &&  positiveSentimentScore == 0){
                sentiment = 'unkown'
            }else
            if(negativeSentimentScore > positiveSentimentScore){
                sentiment = 'negative';
            }else
            if(positiveSentimentScore > negativeSentimentScore){
                sentiment = 'positive';
            }


            vo.overallSentiment = sentiment;

            resultObject.sentiment = vo;

            resolve(resultObject);

            //handle any errors that may happen here and reject
        }

    }
    return getPromise(job);
}

exports.genderParser = function(text, resultObject){
    var job = function(resolve, reject){
        var maleWords = ['man', 'male', 'guy', 'he'];
        var femaleWords = ['woman', 'female', 'girl', 'she'];

        var maleResult = occurenceParser(maleWords, text);
        var femaleResult = occurenceParser(femaleWords, text)

        if(maleResult == femaleResult){
            resultObject.gender = 'unkown';
        }else
        if(maleResult){
            resultObject.gender = 'male';
        }else
        if(femaleResult){
            resultObject.gender = 'female';
        }

        resolve(resultObject);

        //handle any errors that may happen here and reject
    }
    return getPromise(job);
}


//internal

function runSingle(parsers, index, text, result, cb){
    var parser = parsers[index];
    parser(text, result).then(function(object){
        if(index == parsers.length - 1){
            cb();
        }else{
            runSingle(parsers, index + 1, text, result, cb);
        }
    }, function(error){
        cb();
    })
}


//util
function getPromise(job){
    var promise = new Promise(function(resolve, reject){
        job(function(object){
            resolve(object);
        }, function(err){
            reject(err)
        });
    });
    return promise;
}

function occurenceParser(terms, text){
    return new RegExp(terms.map(function(w){ return '\\b'+w+'\\b' }).join('|'),'g').test(text);
}