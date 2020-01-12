const config = {
    root: 'https://www.google.com',
    base: 'https://www.google.com/',
    start: 'https://www.google.com/static/',
    // the urls you known
    urls: [
        'index.htm'
    ],
    // outputs 
    directory: './dist/googl',
    allowthirdDomain: false,
    captureSceenshot: true, // capture screenshot for website
    // parse url recursive
    allowParseUrl: (url)=> { return /\.(htm|css)$/.test(url)},
    // buffer type 
    getEncode: (url)=> {
        return /png|cur|jpe?g|gif|eot|woff2?|ttf/.test(url) ? 'base64' : 'utf8'
    },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    // match rules
    bodyReplace: {
        '/template/default/' : /__PUBLIC__\//g
    },

    plugins: [
        'bodyParse',
        'cssUrlParse'
    ],
    sources: [
        { callback:(body)=> {
            let u = [];
            // match the body to return urls

            return u
          }
        },
        // example
        { callback:(body)=> {
            let u = [];
            let r = /url\(([\"\'])?(\S+?)\1\)/g
            let matchd = body.match(r);
            if(matchd) {
                u = matchd.map((item)=> {
                    return item.match(/url\(([\"\'])?(\S+?)\1\)/)[2].replace(/(eot|woff2?|ttf|svg)(\S+)/, '$1')
                })
            }
            // fiilter data base64
            u = u.filter(item => !~item.indexOf('data:'))
            return u
          }
        }

    ]
}

module.exports = config;