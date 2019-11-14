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
    // match rules
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