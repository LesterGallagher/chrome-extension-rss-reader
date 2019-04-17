
export default class FeedItem {
    constructor() {
        this.title = null;
        this.link = null;
        this.description = null; // description is a short description without html
        this.summary = null; // summary is long description with unsanitized html
        this.image = null;
        this.video = null;
        this.audio = null;
        this.author = null;
        this.contentType = null;
        this.content = null;
        this.contentBase = null;
        this.category = null;
        this.date = null;
        this.should_update_token = null;
    }

    static fromJSON = obj => {
        const instance = new FeedItem();
        instance.title = obj.title;
        instance.link = obj.link;
        instance.description = obj.description; // description is a short description without html
        instance.summary = obj.summary; // summary is long description with unsanitized html
        instance.image = obj.image;
        instance.video = obj.video;
        instance.audio = obj.audio;
        instance.author = obj.author;
        instance.contentType = obj.contentType;
        instance.content = obj.content;
        instance.contentBase = obj.contentBase;
        instance.category = obj.category;
        instance.date = obj.date;
        instance.should_update_token = obj.should_update_token;
        return instance;
    }

    toJSON = () => {
        return {
            title: this.title,
            link: this.link,
            description: this.description, // description is a short description without html
            summary: this.summary, // summary is long description with unsanitized html
            image: this.image,
            video: this.video,
            audio: this.audio,
            author: this.author,
            contentType: this.contentType,
            content: this.content,
            contentBase: this.contentBase,
            category: this.category,
            date: this.date,
            should_update_token: this.should_update_token,
        }
    }
}