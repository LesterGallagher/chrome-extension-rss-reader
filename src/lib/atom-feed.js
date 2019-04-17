import Feed from './feed';
import URL from '../lib/urls';
import { getContent, excerpt, getContentAttr, html2text } from './util';
import AtomFeedItem from './atom-feed-item';

export default class AtomFeed extends Feed {
    constructor() {
        super();

        this.type = 'atom';
    }

    static fromJSON = obj => {
        const instance = new AtomFeed();
        instance.url = obj.url;
        instance.date = obj.date;
        instance.site = obj.site;
        instance.title = obj.title;
        instance.description = obj.description;
        instance.summary = obj.summary;
        instance.items = obj.items.map(x => AtomFeedItem.fromJSON(x));
        instance.icon = obj.icon;
        instance.should_update_token = obj.should_update_token;
        instance.category = obj.category;
        return instance;
    }

    static fromAtomXmlFeed = (url, xml, text) => {
        var items = Array.prototype.slice.call(
            xml.getElementsByTagName('entry'),
            0,
            10000)
            .map(item => AtomFeedItem.fromAtomXmlItem(url, item));

        var site = excerpt(getContent(xml, 'link') || getContentAttr(xml, 'link') || new URL(url).normalizeUrl('/').string, 4000);
        if (!new URL(url).isBaseUrl()) site = new URL(url).normalizeUrl(site).string;

        var urlSplit = site.split('/');
        var icon = urlSplit[0].replace('http:', 'https:') + '//' + urlSplit[2] + '/favicon.ico';

        const instance = new AtomFeed();
        
        instance.type = 'atom';
        instance.url = url;
        instance.date = new Date(getContent(xml, 'updated') || 0).getTime();
        instance.site = site;
        instance.title = excerpt(getContent(xml, 'title'), 500);
        instance.description = excerpt(getContent(xml, 'subtitle'), 4000);
        instance.items = items;
        instance.icon = icon;
        instance.category = [];
        instance.should_update_token = text.length;

        return instance;
    }
}