

const concatAndResolveUrl = (url, concat) => {
    var url1 = url.split('/').slice(0, -1);
    var url2 = concat.split('/');
    var url3 = [];
    if (concat.trim() === '/') {
        url = url1[0] + '//' + url1[2];
    } else {
        for (var i = 0, l = url1.length; i < l; i++) {
            if (url1[i] === '..') {
                url3.pop();
            } else if (url1[i] === '.' || url1[i] === '') {
                continue;
            } else {
                url3.push(url1[i]);
            }
        }
        for (var i = 0, l = url2.length; i < l; i++) {
            if (url2[i] === '..') {
                url3.pop();
            } else if (url2[i] === '.' || url2[i] === '') {
                continue;
            } else {
                url3.push(url2[i]);
            }
        }
        url = url3.join('/');
    }
    return url;
}


export default class URL {
    constructor(string) {
        this.string = string;
    }

    normalizeUrl = (foreignUrl) => {
        this.cleanURL();
        foreignUrl = new URL(foreignUrl).cleanURL().string;
        if (foreignUrl.indexOf('http://') === 0 || foreignUrl.indexOf('https://') === 0) {
            // absolute
            this.string = foreignUrl;
        } else if (foreignUrl[0] === '/') {
            var urlSplit = this.string.split('/');
            this.string = urlSplit[0] + '//' + urlSplit[2] + foreignUrl;
        } else {
            // relative
            this.string = concatAndResolveUrl(this.string, foreignUrl);
        }
        return this;
    }

    isBaseUrl = () => {
        return this.string.indexOf('http://') === 0 || this.string.indexOf('https://') === 0;
    }

    cleanURL = () => {
        this.string = this.string.trim();
        if (this.string.length !== 1 || this.string[0] !== '/') {
            this.string = this.string.replace(/\/$/, '');
        }
        return this;
    }
        
}
