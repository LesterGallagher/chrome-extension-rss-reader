import FeedItem from "./feed-item";
import { getContent, excerpt, getContentAttr, html2text } from './util';

export default class AtomFeedItem extends FeedItem {
    constructor() {
        super();
    }

    static fromAtomXmlItem = (url, xmlItem) => {
        var title = excerpt(getContent(xmlItem, 'title'), 200);
        var titleType = getContentAttr(xmlItem, 'title', 'type');
        if (titleType === 'text/html' || titleType === 'html') title = html2text(title);
        var link = excerpt(getContent(xmlItem, 'link') || getContentAttr(xmlItem, 'link', 'href'), 20000);
        var summaryType = excerpt(getContentAttr(xmlItem, 'summary', 'type'), 20000);
        var summary = excerpt(getContent(xmlItem, 'summary'), 300000);
        var content = excerpt(getContent(xmlItem, 'content'), 1000000);
        var contentType = excerpt(getContentAttr(xmlItem, 'content', 'type'), 20000);
        if (contentType === 'text/html') contentType = 'html';
        else contentType = 'text';
        var description = !summary
            ? html2text(content.slice(0, 300)).slice(0, 200)
            : html2text(summary.slice(0, 3000)).slice(0, 2000);

        const instance = new AtomFeedItem();

        instance.title = title;
        instance.link = link;
        instance.description = description; // description is a short description without html
        instance.summary = summary; // summary is long description with unsanitized html
        instance.descIsExcerpt = !summary;
        instance.contentType = contentType;
        instance.author = excerpt(getContent(xmlItem, 'author'), 200);
        instance.content = content; // the article with html
        instance.contentType = contentType;
        instance.contentBase = excerpt(getContentAttr(xmlItem, 'content', 'xml:base'), 2000);
        instance.category = excerpt(getContent(xmlItem, 'category') || getContentAttr(xmlItem, 'category', 'term'), 4000);
        instance.date = new Date((getContent(xmlItem, 'published') || getContent(xmlItem, 'updated')) || 0).getTime();
        instance.should_update_token = description.length;

        return instance;
    }

    
}