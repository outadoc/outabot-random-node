/* My Next Tweet. Copyright (C) 2011 Monokai. 
   NodeJS port (C) 2012 outa[dev].
*/

(function() {	
    function urlEncode(a) {
        a = encodeURIComponent(a);
        return a.replace(/[*+\/@]|%20/g, function (b) {
            switch (b) {
                case "*":
                    b = "%2A";
                    break;
                case "+":
                    b = "%2B";
                    break;
                case "/":
                    b = "%2F";
                    break;
                case "@":
                    b = "%40";
                    break;
                case "%20":
                    b = "+";
            }
            return b;
        });
    }
    
    function removeSpecialChars(a) {
        return a = a.replace(/[\u2018\u2019\u201c\u201d\u2018\u2019"\u201c\u201d\u2039\u203a\u00ab\u00bb\[\]\(\)]/, "");
    }
    
    function log(a) {
        console.log(a);
    }
    
    function getRandomTweet() {
        var a;
        var b = k[Math.floor(Math.random() * k.length)];
        
        if (b == undefined) a = "error.";
        else {
            for (a = b + " ";;) {
                b: {
                    b = i[w ? b : b.toUpperCase()];
                    var c = Math.random(),
                        g = 0,
                        e = void 0;
                    for (e in b) {
                        g += Number(b[e]);
                        if (c <= g) {
                            b = e;
                            break b;
                        }
                    }
                    b = i[Math.floor(Math.random() * i.length)]
                }
                if (!b) break;
                if (a.length + b.length >= s) break;
                a += b + " ";
            }
            a = a.substr(0, a.length - 1);
            a = a;
            a = a.substr(0, 1).toUpperCase() + a.substr(1);
            b = /[\.\!\?]/gm;
            
            for (c = 0; g = b.exec(a);) c = g.index;
            if (c >= z) a = a.substr(0, c + 1);
            else {
                if (!a.charAt(a.length - 1).match(b)) {
                    if (a.length == s) a = a.substr(0,
                 	a.lastIndexOf(" "));
                    if (a.charAt(a.length - 1).match(/[,:;]/)) a = a.substr(0, a.length - 1);
                    a += [".", "?", "!"][Math.floor(Math.random() * 3)]
                }
                a = a;
            }
        }
       	exports.callback(a);
    }
    
    var s = 106,
        z = s * 2 / 3,
        w = true,
        l, t = {}, i, x = {}, k, user, q, r;
        
    module.exports = {
        getNewTweet: function (username, twitterObj, callback) {
            user = username;
            exports.callback = callback;
            
            if (t[user]) {
                i = t[user];
                k = x[user];
                getRandomTweet();
            } else try {
                i = {};
                k = [];
                
                twitterObj.get('/statuses/user_timeline.json', {screen_name: urlEncode(user), count: 200}, function(data) {
                    module.exports.onTwitterStatusesLoaded(data);
                });

            } catch (c) {
                log("error. " + c);
            }
        },
        
        onTwitterStatusesLoaded: function (a) {
            if (!a || a.length === 0) log("error.");
            else {
                for (var b, c = {}, g = 0; g < a.length; g++) {
                    var e;
                    e = a[g].text.split(/ /);
                    
                    for (var h = [], f = 0; f < e.length; f++) {
                        var d = e[f];
                        d != undefined && !d.match(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/i) && !d.match(/^@.+/) && !d.match(/^#.+/) && !d.match(/^rt$/i) && !d.match(/^\/?via$/i) && !d.match(/^\/?cc$/i) && h.push(removeSpecialChars(d));
                    }
                    
                    h.length > 0 && k.push(h[0]);
                    e = h;
                    for (h = 0; h < e.length; h++) {
                        f = e[h];
                        d = w ? f : f.toUpperCase();
                        c[d] || (c[d] = {});
                        if (f && b) if (isNaN(c[b][f])) c[b][f] = 1;
                        else c[b][f]++;
                        b = d;
                    }
                }
                
                a = {};
                var j, m;
                
                for (j in c) {
                    a[j] = {};
                    b = 0;
                    for (m in c[j]) b += c[j][m];
                    for (m in c[j]) a[j][m] = c[j][m] / b
                }
                
                i = a;
                x[user] = k;
                t[user] = i;
                
                getRandomTweet();
            }
        }
    }
})();