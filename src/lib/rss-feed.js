import URL from './urls';
import RssFeedItem from './rss-feed-item';
import { getContent, excerpt, html2text } from './util';
import Feed from './feed';

export default class RssFeed extends Feed {
    constructor() {
        super();

        this.type = 'rss';
    }

    static fromJSON = obj => {
        const instance = new RssFeed();
        instance.url = obj.url;
        instance.date = obj.date;
        instance.site = obj.site;
        instance.title = obj.title;
        instance.description = obj.description;
        instance.summary = obj.summary;
        instance.items = obj.items.map(x => RssFeedItem.fromJSON(x));
        instance.icon = obj.icon;
        instance.should_update_token = obj.should_update_token;
        instance.category = obj.category;
        return instance;
    }

    static fromRssXmlFeed = (url, xml, text) => {
        var items = Array.prototype.slice.call(
            xml.getElementsByTagName('item'),
            0,
            10000
        ).map(item => RssFeedItem.fromRssXmlItem(url, item));

        var site = excerpt(getContent(xml, 'link'), 20000);
        if (!new URL(site).isBaseUrl(site)) site = new URL(url).normalizeUrl(site).string;

        var urlSplit = site.split('/');
        var icon = urlSplit[0].replace('http:', 'https:') + '//' + urlSplit[2] + '/favicon.ico';

        var feedSummary = getContent(xml, 'description').slice(0, 3000);
        var feedSummaryContainsHTMLChars = /<[a-z][\s\S]*>/i.test(feedSummary);

        var instance = new RssFeed();

        instance.url = url;
        instance.date = new Date(getContent(xml, 'lastBuildDate') || 0).getTime();
        instance.site = site;
        instance.title = excerpt(getContent(xml, 'title'), 2000);
        instance.description = excerpt(html2text(feedSummary), 2000);
        instance.summary = feedSummaryContainsHTMLChars ? feedSummary : undefined;
        instance.items = items;
        instance.icon = icon;
        instance.should_update_token = text.length;
        instance.category = [];

        return instance;
    }
}