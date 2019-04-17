

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'META') {
        const node = document.querySelector('meta[name=theme-color]');
        const value = node && node.getAttribute('content');
        const descNode = document.querySelector('meta[name=description]');
        const desc = descNode && descNode.getAttribute('content');
        sendResponse({
            themeColor: value,
            title: document.title,
            description: desc
        });
    }
});

