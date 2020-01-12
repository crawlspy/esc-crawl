
module.exports = (body) => {
    let u = []
    let r = /(src|href)=([\"\'])(\w[^"']{2,})\2/g
    // filter #hash
    let matchd = body.match(r);
    if (matchd) {
        u = matchd.map((item) => {
            let url = item.match(/(src|href)=([\"\'])([^"']+?)\2/)[3]
            if (/^http/.test(url)) {
                return url
            }
            return url.match(/^(.*\.[^?#]*)((\?.*)?(\#.*)?)$/)[1]
        })
    }
    return u
}