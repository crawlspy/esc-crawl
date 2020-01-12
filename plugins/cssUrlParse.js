module.exports = (body) => {
    let u = [];
    let r = /url\(([\"\'])?(\S+?)\1\)/g
    let matchd = body.match(r);
    if (matchd) {
        u = matchd.map((item) => {
            return item.match(/url\(([\"\'])?(\S+?)\1\)/)[2].replace(/(eot|woff2?|ttf|svg|css)(\S+)/, '$1')
        })
    }
    // filter data base64
    u = u.filter(item => !~item.indexOf('data:'))
    return u
}