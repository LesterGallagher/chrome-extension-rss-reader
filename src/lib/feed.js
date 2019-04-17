import FeedItem from "./feed-item";

export default class Feed {
    constructor() {
        this.type = null;
        this.url = null;
        this.date = null;
        this.site = null;
        this.title = null;
        this.description = null;
        this.summary = null;
        this.items = null;
        this.icon = null;
        this.should_update_token = null;
        this.category = null;
    }

    toJSON = () => {
        return {
            type: this.type,
            url: this.url,
            date: this.date,
            site: this.site,
            title: this.title,
            description: this.description,
            summary: this.summary,
            items: this.items.map(x => FeedItem.fromJSON(x)),
            icon: this.icon,
            should_update_token: this.should_update_token,
            category: this.category
        }

    }
}
