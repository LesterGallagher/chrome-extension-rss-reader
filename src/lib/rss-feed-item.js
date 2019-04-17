import URL from './urls';
import { getContent, excerpt, html2text } from './util';
import FeedItem from './feed-item';

export default class RssFeedItem extends FeedItem {
    constructor() {
        super();
        this.type = 'rss'
    }

    static fromRssXmlItem = (url, xmlItem) => {
        var description = excerpt(getContent(xmlItem, 'description'), 300000);
        var enclosures = Array.prototype.slice.call(xmlItem.getElementsByTagName('enclosure')).slice(0, 100);
        var containsHTMLChars = /<[a-z][\s\S]*>/i.test(description);
        let image, video, audio;
        enclosures.forEach(function (enclosure) {
            var type = enclosure.getAttribute('type');
            var type5 = type.slice(0, 5);
            if (type5 === 'image' && image === undefined) {
                image = {
                    url: new URL(url).normalizeUrl(enclosure.getAttribute('url')).string,
                    type: type
                };
            } else if (type5 === 'video' && video === undefined) {
                video = {
                    url: new URL(url).normalizeUrl(enclosure.getAttribute('url')).string,
                    type: type,
                    length: enclosure.getAttribute('length')
                };
            } else if (type5 === 'audio' && audio === undefined) {
                audio = {
                    url: new URL(url).normalizeUrl(enclosure.getAttribute('url')).string,
                    type: type,
                    length: enclosure.getAttribute('length')
                };
            }
        });

        const rssFeedItem = new RssFeedItem();

        rssFeedItem.title = excerpt(getContent(xmlItem, 'title'), 500);
        rssFeedItem.link = excerpt(getContent(xmlItem, 'link'), 20000);
        rssFeedItem.description = html2text(description); // description is a short description without html
        rssFeedItem.summary = containsHTMLChars ? description : undefined; // summary is long description with unsanitized html
        rssFeedItem.image = image || null;
        rssFeedItem.video = video || null;
        rssFeedItem.audio = audio || null;
        rssFeedItem.author = excerpt(getContent(xmlItem, 'author'), 500);
        rssFeedItem.category = excerpt(getContent(xmlItem, 'category'), 500);
        rssFeedItem.date = new Date(getContent(xmlItem, 'pubDate') || new Date()).getTime();
        rssFeedItem.should_update_token = description.length;

        return rssFeedItem;
    }
}
