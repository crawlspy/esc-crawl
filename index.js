const fs = require('fs');
const got = require('got');
const path = require('path');
const url = require('url');
const mkdirp = require('mkdirp');
const config = require('./config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


const arrayUniq = array => [...new Set(array)];


const projectRoot = path.join(__dirname, config.directory);


const getEncode = config.getEncode;

const parseChild = (body, realUrl, urls)=> {
    let finds = [];
    if(config.allowParseUrl(realUrl)) {
        config.sources.map((item)=> {
            let u = item.callback(body);
            if(u) {
                finds = finds.concat(u) 
            }
        })
    }
    if(finds.length) {
        // fix urls
        finds = finds.map(item => {
            // ../ ./
            if(item.startsWith('.')) {
                return url.resolve(realUrl, item)
            }
            if(item.startsWith('/')) {
                let pu = url.resolve(realUrl, config.root + item)
                return pu
            }
            if(/^[a-zA-Z0-9]/.test(item)) {
                return url.resolve(realUrl, item)
            }
            return item
        })
    }
    urls = finds.concat(urls);
    return arrayUniq(urls)
}

let writed = [];

const startCrawler = async function (urls) {
    if (urls && urls.length > 0) {
        const curl = urls.shift();
        let realUrl = url.resolve(config.start, curl);
        if(!writed.includes(realUrl)) {
            if(config.allowthirdDomain || realUrl.startsWith(config.base)) {
                let savePath = realUrl.replace(config.base, '');
                let dirname = path.dirname(savePath);
                let cdir = path.join(projectRoot, dirname);
                let body = ''
                try {
                    const response = await got(realUrl, { encoding: getEncode(realUrl)});
                    body = response.body;
                    if(getEncode(realUrl) == 'base64') {
                        body = Buffer.from(body, 'base64');
                    }
                } catch (error) {
                    console.log('Not Found: '+  realUrl);
                    //=> 'Internal server error ...'
                } finally {
                    if(body) {
                        mkdirp(cdir, function (err) {
                            if (err) console.error(err)
                            else {
                                fs.writeFileSync(path.join(projectRoot, savePath), body);
                                writed.push(realUrl);
                                urls = parseChild(body, realUrl, urls);
                                startCrawler(urls);
                            }
                        });
                    } else {
                        startCrawler(urls);
                    }
                }
            } else {
                startCrawler(urls);
            }
        } else {
            startCrawler(urls);
        }
    } else {
        try {
            if (config.captureSceenshot) {
                const captureWebsite = require('capture-website');
                await captureWebsite.file(config.base, path.join(projectRoot, 'screenshot.png'));
            }
            fs.writeFileSync(path.join(projectRoot, 'writedlog.log'), writed.join('\n'));
        } catch (error) {
            console.log('Can not find anything.')
        }
        
    }
}


startCrawler(config.urls)









