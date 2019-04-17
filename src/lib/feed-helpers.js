export const fetchXML = (url) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 15 * 1000; // 15 seconds
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (this.responseXML) resolve(this);
                    else reject({
                        type: 'network',
                        error: 'Feed is not returning valid xml.',
                        xhr: this
                    });
                } else reject({
                    type: 'network',
                    error: this.responseText || 'A network error occurred.',
                    xhr: this
                });
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/rss+xml,application/atom+xml,application/xml,text/xml");
        xhr.send();
    });
}

export const findFeedlyFeeds = q => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`https://feedly.com/v3/search/feeds?query=${encodeURIComponent(q)}&count=1`)
                .then(response => response.json())
                .then(json => {
                    if (json) {
                        resolve(json.results[0]);
                    } else {
                        reject('No json.');
                    }
                });
        } catch (err) {
            reject(err);
        }
    });

}


