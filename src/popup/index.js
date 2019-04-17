import createEntry from './template.html';
import renderNewsfeederButton from 'open-with-newsfeeder-btn';
import { html2text, clearChildren } from '../lib/util';

import { findFeedlyFeeds, fetchXML } from '../lib/feed-helpers'
import AtomFeed from '../lib/atom-feed';
import RSSFeed from '../lib/rss-feed';

const getText = item => {
    const stripped = (html2text(item.description) || html2text(item.content)).replace().slice(0, 200);
    const div = document.createElement('div');
    div.innerHTML = stripped;
    return div.innerText;
};

const parseFeed = (xhr) => {
    console.log(xhr);
    try {
        switch (xhr.responseXML.documentElement.tagName.toUpperCase()) {
            case 'FEED':
                return AtomFeed.fromAtomXmlFeed(
                    xhr.responseURL,
                    xhr.responseXML,
                    xhr.responseText
                );
            case 'RSS':
                return RSSFeed.fromRssXmlFeed(
                    xhr.responseURL,
                    xhr.responseXML,
                    xhr.responseText
                );
            default: return null;
        }
    } catch (err) {
        return null;
    }
}

const items = document.getElementById('items');

const setNoFeed = () => {
    clearChildren(items);
    items.appendChild(document.createTextNode('No feed...'));
    items.classList.add('loaded');
    document.querySelector('#items').style.paddingLeft = '100px';
    document.querySelector('#items').style.paddingTop = '30px';
    document.querySelector('#items').style.fontSize = '20px';
};

const createItem = (item, i, self) => createEntry({
    title: item.title,
    link: item.link,
    text: getText(item),
    longdate: new Date(item.date).toLocaleDateString(),
    date: new Date(item.date).getDate()
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0]; // there will be only one in this array
    const { url, id } = currentTab;
    const promise = findFeedlyFeeds(url)
        .then(feed => {
            const url = feed && feed.feedId && feed.feedId.replace(/^feed\//, '') || null
            if (url) {
                return fetchXML(url)
                    .then(parseFeed)
                    .then(feed => {
                        if (!feed || feed.items.length === 0) {
                            setNoFeed();
                        } else {
                            clearChildren(items);
                            feed.items.map(createItem).forEach(item => {
                                items.appendChild(item);
                            });
                            console.log(url);
                            renderNewsfeederButton({
                                container: items,
                                href: url
                            });
                            items.classList.add('loaded');
                        }
                    });
            } else {
                setNoFeed();
            }
        });
    document.querySelector('.meta a').setAttribute('href', url);
    chrome.tabs.sendMessage(id, { action: "META" }, function ({ themeColor, title, description } = {}) {
        document.querySelector('.feed .meta .hr').style.borderBottomColor = themeColor;
        document.querySelector('.feed .after').style.backgroundColor = themeColor;
        document.querySelector('.feed .before').style.borderLeftColor = themeColor;
        promise.then(() => {
            document.querySelectorAll('.feed .entry .before')
                .forEach(before => before.style.backgroundColor = themeColor);
            document.querySelectorAll('.feed .entry .timestamp')
                .forEach(timestamp => timestamp.style.backgroundColor = themeColor);
        });
        document.querySelector('.meta-title').textContent = title;
        document.title = title;
        document.querySelector('.meta-title').setAttribute('title', description);
    });
});

