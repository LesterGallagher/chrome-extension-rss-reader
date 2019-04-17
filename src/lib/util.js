
export const html2text = html => {
	return html.replace(/<style([\s\S]*?)<\/style>/gi, '')
		.replace(/<script([\s\S]*?)<\/script>/gi, '')
		.replace(/<\/div>/ig, '\n')
		.replace(/<\/li>/ig, '\n')
		.replace(/<li>/ig, '  *  ')
		.replace(/<\/ul>/ig, '\n')
		.replace(/<\/p>/ig, '\n')
		.replace(/<br\s*[\/]?>/gi, "\n")
		.replace(/<[^>]+>/ig, '');
};

export const debounce = (func, wait, immediate) => {
	var timeout;
	return function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export const excerpt = (str, maxlen) => {
	str = str || '';
	if (str.length > maxlen) return str.slice(0, maxlen).trimRight() + '...';
	else return str;
}

export const arrayEqual = (arr1, arr2) => {
	if (arr1.length !== arr2.length) return false;
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

export const getContent = (item, child) => {
	var elem = item.getElementsByTagName(child)[0];
	return (elem && elem.textContent || '').trim();
}

export const getContentAttr = (item, child, attr) => {
	var elem = item.getElementsByTagName(child)[0];
	return (elem && elem.getAttribute(attr) || '').trim();
}

export const clearChildren = parent => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	return parent;
}

export const cloneWithoutChildren = parent => {
	var cNode = parent.cloneNode(false);
	parent.parentNode.replaceChild(cNode, parent);
	return cNode;
}

export const byteSizeFormat = (bytes, size) => {
	var names = size === 'long'
		? ['bytes', 'kilo bytes', 'mega bytes', 'giga bytes', 'terra bytes']
		: ['bytes', 'kb', 'mb', 'gb', 'tb'];
	if (bytes <= 0) {
		return '0 ' + names[0];
	}
	var index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		names.length
	);
	var units = Math.round(bytes / Math.pow(1024, index));
	return units + ' ' + names[index];
}

export const strRepeat = (str, n) => {
	if (n === 0) return '';
	n = n || 1;
	return Array(n + 1).join(str);
}

export const quoteattr = (s, preserveCR) => {
	preserveCR = preserveCR ? '&#13;' : '\n';
	return ('' + s) /* Forces the conversion to string. */
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
        /*
        You may add other replacements here for HTML only 
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */
		.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
		.replace(/[\r\n]/g, preserveCR);
}

export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const throttle = (func, limit) => {
	let inThrottle;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
};
