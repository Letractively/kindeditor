/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
* @version 4.0 (2011-07-09)
*******************************************************************************/
(function (window, undefined) {
var _VERSION = '4.0 (2011-07-09)',
	_ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_V = _matches ? _matches[1] : '0';
function _isArray(val) {
	if (!val) {
		return false;
	}
	return Object.prototype.toString.call(val) === '[object Array]';
}
function _isFunction(val) {
	if (!val) {
		return false;
	}
	return Object.prototype.toString.call(val) === '[object Function]';
}
function _inArray(val, arr) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (val === arr[i]) {
			return i;
		}
	}
	return -1;
}
function _each(obj, fn) {
	if (_isArray(obj)) {
		for (var i = 0, len = obj.length; i < len; i++) {
			if (fn.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn.call(obj[key], key, obj[key]) === false) {
					break;
				}
			}
		}
	}
}
function _trim(str) {
	return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');
}
function _inString(val, str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0;
}
function _addUnit(val, unit) {
	unit = unit || 'px';
	return val && /^\d+$/.test(val) ? val + 'px' : val;
}
function _removeUnit(val) {
	var match;
	return val && (match = /(\d+)/.exec(val)) ? parseInt(match[1], 10) : 0;
}
function _escape(val) {
	return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function _unescape(val) {
	return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}
function _toHex(val) {
	function hex(d) {
		var s = parseInt(d, 10).toString(16).toUpperCase();
		return s.length > 1 ? s : '0' + s;
	}
	return val.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
		function($0, $1, $2, $3) {
			return '#' + hex($1) + hex($2) + hex($3);
		}
	);
}
function _toMap(val, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	var map = {}, arr = _isArray(val) ? val : val.split(delimiter), match;
	_each(arr, function(key, val) {
		if ((match = /^(\d+)\.\.(\d+)$/.exec(val))) {
			for (var i = parseInt(match[1], 10); i <= parseInt(match[2], 10); i++) {
				map[i.toString()] = true;
			}
		} else {
			map[val] = true;
		}
	});
	return map;
}
function _toArray(obj, offset) {
	return Array.prototype.slice.call(obj, offset || 0);
}
function _undef(val, defaultVal) {
	return val === undefined ? defaultVal : val;
}
function _json(text) {
	var match;
	if ((match = /\{[\s\S]*\}|\[[\s\S]*\]/.exec(text))) {
		text = match[0];
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	cx.lastIndex = 0;
	if (cx.test(text)) {
		text = text.replace(cx, function (a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}
	if (/^[\],:{}\s]*$/.
	test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
	replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
	replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
		return eval('(' + text + ')');
	}
	throw 'JSON parse error';
}
var _round = Math.round;
var K = {
	VERSION : _VERSION,
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	V : _V,
	each : _each,
	isArray : _isArray,
	isFunction : _isFunction,
	inArray : _inArray,
	inString : _inString,
	trim : _trim,
	addUnit : _addUnit,
	removeUnit : _removeUnit,
	escape : _escape,
	unescape : _unescape,
	toHex : _toHex,
	toMap : _toMap,
	toArray : _toArray,
	undef : _undef,
	json : _json
};
var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	_STYLE_TAG_MAP = _toMap('b,basefont,big,del,em,font,i,s,small,span,strike,strong,sub,sup,u'),
	_CONTROL_TAG_MAP = _toMap('img,table'),
	_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	_VALUE_TAG_MAP = _toMap('input,button,textarea,select');
function _getScriptPath() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (/kindeditor[\w\-\.]*\.js/.test(src)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
}
var _options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : false,
	shadowMode : true,
	scriptPath : _getScriptPath(),
	langType : 'zh_CN',
	urlType : '',
	newlineType : 'p',
	resizeType : 2,
	dialogAlignType : 'page',
	bodyClass : 'ke-content',
	cssPath : '',
	cssData : '',
	minWidth : 550,
	minHeight : 100,
	minChangeLength : 5,
	shortcutKeys : {
		undo : 'Z', redo : 'Y', bold : 'B', italic : 'I',
		underline : 'U', selectall : 'A', print : 'P'
	},
	items : [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'table', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	],
	noDisableItems : 'source,fullscreen'.split(','),
	preloadPlugins : 'image,media,link,table'.split(','),
	colors : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	htmlTags : {
		font : ['color', 'size', 'face', '.background-color'],
		span : [
			'.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align'
		],
		div : [
			'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height'
		],
		'td,th': [
			'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background'
		],
		a : ['href', 'target', 'name'],
		embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess', '/'],
		img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height', '/'],
		hr : ['/'],
		br : ['/'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
	}
};
_options.themesPath = _options.scriptPath + 'themes/';
_options.langPath = _options.scriptPath + 'lang/';
_options.pluginsPath = _options.scriptPath + 'plugins/';
var _useCapture = false;
function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, _useCapture);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}
function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, _useCapture);
	} else if (el.detachEvent){
		el.detachEvent('on' + type, fn);
	}
}
var _EVENT_PROPS = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');
function _event(el, event) {
	if (!event) {
		return;
	}
	var e = {},
		doc = el.ownerDocument || el.document || el;
	_each(_EVENT_PROPS, function(key, val) {
		e[val] = event[val];
	});
	if (!e.target) {
		e.target = e.srcElement || doc;
	}
	if (e.target.nodeType === 3) {
		e.target = e.target.parentNode;
	}
	if (!e.relatedTarget && e.fromElement) {
		e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
	}
	if (e.pageX == null && e.clientX != null) {
		var d = doc.documentElement, body = doc.body;
		e.pageX = e.clientX + (d && d.scrollLeft || body && body.scrollLeft || 0) - (d && d.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (d && d.scrollTop  || body && body.scrollTop  || 0) - (d && d.clientTop  || body && body.clientTop  || 0);
	}
	if (!e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode)) {
		e.which = e.charCode || e.keyCode;
	}
	if (!e.metaKey && e.ctrlKey) {
		e.metaKey = e.ctrlKey;
	}
	if (!e.which && e.button !== undefined) {
		e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
	}
	switch (e.which) {
	case 186 :
		e.which = 59;
		break;
	case 187 :
	case 107 :
	case 43 :
		e.which = 61;
		break;
	case 189 :
	case 45 :
		e.which = 109;
		break;
	case 42 :
		e.which = 106;
		break;
	case 47 :
		e.which = 111;
		break;
	case 78 :
		e.which = 110;
		break;
	}
	if (e.which >= 96 && e.which <= 105) {
		e.which -= 48;
	}
	e.preventDefault = function() {
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.returnValue = false;
	};
	e.stopPropagation = function() {
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		event.cancelBubble = true;
	};
	e.stop = function() {
		this.preventDefault();
		this.stopPropagation();
	};
	return e;
}
function _now() {
	return new Date().getTime();
}
var _expendo = 'kindeditor' + _now(), _id = 0, _data = {};
function _getId(el) {
	return el[_expendo] || null;
}
function _setId(el) {
	var id = ++_id;
	el[_expendo] = id;
	return id;
}
function _removeId(el) {
	try {
		delete el[_expendo];
	} catch(e) {}
}
function _bind(el, type, fn) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_bind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (!id) {
		id = _setId(el);
	}
	if (_data[id] === undefined) {
		_data[id] = {};
	}
	var events = _data[id][type];
	if (events && events.length > 0) {
		_unbindEvent(el, type, events[0]);
	} else {
		_data[id][type] = [];
		_data[id].el = el;
	}
	events = _data[id][type];
	if (events.length === 0) {
		events[0] = function(e) {
			_each(events, function(i, event) {
				if (i > 0 && event) {
					event.call(el, _event(el, e));
				}
			});
		};
	}
	if (_inArray(fn, events) < 0) {
		events.push(fn);
	}
	_bindEvent(el, type, events[0]);
}
function _unbind(el, type, fn) {
	if (type && type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_unbind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (!id) {
		return;
	}
	if (type === undefined) {
		if (id in _data) {
			_each(_data[id], function(key, events) {
				if (key != 'el' && events.length > 0) {
					_unbindEvent(el, key, events[0]);
				}
			});
			delete _data[id];
			_removeId(el);
		}
		return;
	}
	var events = _data[id][type];
	if (events && events.length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, events[0]);
			delete _data[id][type];
		} else {
			_each(events, function(i, event) {
				if (i > 0 && event === fn) {
					events.splice(i, 1);
				}
			});
			if (events.length == 1) {
				_unbindEvent(el, type, events[0]);
				delete _data[id][type];
			}
		}
		var count = 0;
		_each(_data[id], function() {
			count++;
		});
		if (count < 2) {
			delete _data[id];
			_removeId(el);
		}
	}
}
function _fire(el, type) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_fire(el, this);
		});
		return;
	}
	var id = _getId(el);
	if (!id) {
		return;
	}
	var events = _data[id][type];
	if (_data[id] && events && events.length > 0) {
		events[0]();
	}
}
function _ctrl(el, key, fn) {
	var self = this;
	key = /^\d{2,}$/.test(key) ? key : key.toUpperCase().charCodeAt(0);
	_bind(el, 'keydown', function(e) {
		if (e.ctrlKey && e.which == key && !e.shiftKey && !e.altKey) {
			fn.call(el);
			e.stop();
		}
	});
}
function _ready(fn) {
	var loaded = false;
	function readyFunc() {
		if (!loaded) {
			loaded = true;
			fn(KindEditor);
			if (document.addEventListener) {
				_unbind(document, 'DOMContentLoaded', readyFunc);
			} else if (document.attachEvent) {
				_unbind(document, 'readystatechange', ieReadyStateFunc);
			}
			_unbind(window, 'load', readyFunc);
		}
	}
	function ieReadyFunc() {
		if (!loaded) {
			try {
				document.documentElement.doScroll('left');
			} catch(e) {
				setTimeout(ieReadyFunc, 0);
				return;
			}
			readyFunc();
		}
	}
	function ieReadyStateFunc() {
		if (document.readyState === 'complete') {
			readyFunc();
		}
	}
	if (document.addEventListener) {
		_bind(document, 'DOMContentLoaded', readyFunc);
	} else if (document.attachEvent) {
		_bind(document, 'readystatechange', ieReadyStateFunc);
		if (document.documentElement.doScroll && window.frameElement === undefined) {
			ieReadyFunc();
		}
	}
	_bind(window, 'load', readyFunc);
}
if (_IE) {
	window.attachEvent('onunload', function() {
		_each(_data, function(key, events) {
			if (events.el) {
				_unbind(events.el);
			}
		});
	});
}
K.ctrl = _ctrl;
K.ready = _ready;
function _getCssList(css) {
	var list = {},
		reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g,
		match;
	while ((match = reg.exec(css))) {
		var key = _trim(match[1].toLowerCase()),
			val = _trim(_toHex(match[2]));
		list[key] = val;
	}
	return list;
}
function _getAttrList(tag) {
	var list = {},
		reg = /\s+(?:([\w-:]+)|(?:([\w-:]+)=([^\s"'<>]+))|(?:([\w-:]+)="([^"]*)")|(?:([\w-:]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
		match;
	while ((match = reg.exec(tag))) {
		var key = match[1] || match[2] || match[4] || match[6],
			val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || '';
		list[key] = val;
	}
	return list;
}
function _formatCss(css) {
	var str = '';
	_each(_getCssList(css), function(key, val) {
		str += key + ':' + val + ';';
	});
	return str;
}
function _formatUrl(url, mode, host, pathname) {
	if (!mode) {
		return url;
	}
	mode = mode.toLowerCase();
	if (_inArray(mode, ['absolute', 'relative', 'domain']) < 0) {
		return url;
	}
	host = host || location.protocol + '//' + location.host;
	if (pathname === undefined) {
		var m = location.pathname.match(/^(\/.*)\//);
		pathname = m ? m[1] : '';
	}
	var match;
	if ((match = /^(\w+:\/\/[^\/]*)/.exec(url))) {
		if (match[1] !== host) {
			return url;
		}
	} else if (/^\w+:/.test(url)) {
		return url;
	}
	function getRealPath(path) {
		var parts = path.split('/'), paths = [];
		for (var i = 0, len = parts.length; i < len; i++) {
			var part = parts[i];
			if (part == '..') {
				if (paths.length > 0) {
					paths.pop();
				}
			} else if (part !== '' && part != '.') {
				paths.push(part);
			}
		}
		return '/' + paths.join('/');
	}
	if (/^\//.test(url)) {
		url = host + getRealPath(url.substr(1));
	} else if (!/^\w+:\/\//.test(url)) {
		url = host + getRealPath(pathname + '/' + url);
	}
	function getRelativePath(path, depth) {
		if (url.substr(0, path.length) === path) {
			var arr = [];
			for (var i = 0; i < depth; i++) {
				arr.push('..');
			}
			var prefix = '.';
			if (arr.length > 0) {
				prefix += '/' + arr.join('/');
			}
			if (pathname == '/') {
				prefix += '/';
			}
			return prefix + url.substr(path.length);
		} else {
			if ((match = /^(.*)\//.exec(path))) {
				return getRelativePath(match[1], ++depth);
			}
		}
	}
	if (mode === 'relative') {
		url = getRelativePath(host + pathname, 0).substr(2);
	} else if (mode === 'absolute') {
		if (url.substr(0, host.length) === host) {
			url = url.substr(host.length);
		}
	}
	return url;
}
function _formatHtml(html, htmlTags, urlType, wellFormatted) {
	urlType = urlType || '';
	wellFormatted = (wellFormatted === undefined) ? true : wellFormatted;
	var isFilter = htmlTags ? true : false;
	html = html.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3){
		return $1 + $2.replace(/<br[^>]*>/ig, '\n') + $3;
	});
	var htmlTagHash = {};
	var fontSizeHash = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
	if (isFilter) {
		_each(htmlTags, function(key, val) {
			var arr = key.split(',');
			for (var i = 0, len = arr.length; i < len; i++) {
				htmlTagHash[arr[i]] = _toMap(val);
			}
		});
	}
	var re = /((?:\r\n|\n|\r)*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:]+="[^"]*")|(?:\s+[\w\-:]+='[^']*'))*)(\/)?>((?:\r\n|\n|\r)*)/g;
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (!wellFormatted) {
			startNewline = '';
			endNewline = '';
		}
		if (isFilter && !htmlTagHash[tagName]) {
			return '';
		}
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
			endSlash = ' /';
		}
		if (_BLOCK_TAG_MAP[tagName]) {
			if (wellFormatted && (startSlash || endSlash)) {
				endNewline = '\n';
			}
		} else {
			if (endNewline) {
				endNewline = ' ';
			}
		}
		if (tagName !== 'script' && tagName !== 'style') {
			startNewline = '';
		}
		if (tagName === 'font') {
			var style = {}, styleStr = '';
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase(), val = $2 || '';
				val = val.replace(/^["']|["']$/g, '');
				if (key === 'color') {
					style.color = val;
					return ' ';
				}
				if (key === 'size') {
					style['font-size'] = fontSizeHash[parseInt(val, 10) - 1] || '';
					return ' ';
				}
				if (key === 'face') {
					style['font-family'] = val;
					return ' ';
				}
				if (key === 'style') {
					styleStr = val;
					return ' ';
				}
				return $0;
			});
			if (styleStr && !/;$/.test(styleStr)) {
				styleStr += ';';
			}
			_each(style, function(key, val) {
				if (val !== '') {
					if (/\s/.test(val)) {
						val = "'" + val + "'";
					}
					styleStr += key + ':' + val + ';';
				}
			});
			if (styleStr) {
				attr += ' style="' + styleStr + '"';
			}
			tagName = 'span';
		}
		if (attr !== '') {
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase();
				var val = $2 || '';
				if (isFilter) {
					if (key.charAt(0) === "." || (key !== "style" && !htmlTagHash[tagName][key])) {
						return ' ';
					}
				}
				if (val === '') {
					val = '""';
				} else {
					if (key === "style") {
						val = val.substr(1, val.length - 2);
						val = val.replace(/\s*([^\s]+?)\s*:(.*?)(;|$)/g, function($0, $1, $2) {
							var k = $1.toLowerCase();
							if (isFilter) {
								if (!htmlTagHash[tagName].style && !htmlTagHash[tagName]['.' + k]) {
									return '';
								}
							}
							var v = _trim($2);
							v = _toHex(v);
							return k + ':' + v + ';';
						});
						val = _trim(val);
						if (val === '') {
							return '';
						}
						val = '"' + val + '"';
					}
					if (_inArray(key, ['src', 'href']) >= 0) {
						if (val.charAt(0) === '"') {
							val = val.substr(1, val.length - 2);
						}
						val = _formatUrl(val, urlType);
					}
					if (val.charAt(0) !== '"') {
						val = '"' + val + '"';
					}
				}
				return ' ' + key + '=' + val + ' ';
			});
			attr = attr.replace(/\s+(checked|selected|disabled|readonly)(\s+|$)/ig, function($0, $1) {
				var key = $1.toLowerCase();
				if (isFilter) {
					if (key.charAt(0) === "." || !htmlTagHash[tagName][key]) {
						return ' ';
					}
				}
				return ' ' + key + '="' + key + '"' + ' ';
			});
			attr = _trim(attr);
			attr = attr.replace(/\s+/g, ' ');
			if (attr) {
				attr = ' ' + attr;
			}
			return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
		} else {
			return startNewline + '<' + startSlash + tagName + endSlash + '>' + endNewline;
		}
	});
	if (!_IE) {
		html = html.replace(/<p><br\s+\/>\n<\/p>/ig, '<p>&nbsp;</p>');
		html = html.replace(/<br\s+\/>\n<\/p>/ig, '</p>');
	}
	if (_WEBKIT) {
		html = html.replace(/\u200B/g, '');
	}
	return _trim(html);
}
function _mediaType(src) {
	if (/\.(rm|rmvb)(\?|$)/i.test(src)) {
		return 'audio/x-pn-realaudio-plugin';
	}
	if (/\.(swf|flv)(\?|$)/i.test(src)) {
		return 'application/x-shockwave-flash';
	}
	return 'video/x-ms-asf-plugin';
}
function _mediaClass(type) {
	if (/realaudio/i.test(type)) {
		return 'ke-rm';
	}
	if (/flash/i.test(type)) {
		return 'ke-flash';
	}
	return 'ke-media';
}
function _mediaAttrs(srcTag) {
	return _getAttrList(unescape(srcTag));
}
function _mediaEmbed(attrs) {
	var html = '<embed ';
	_each(attrs, function(key, val) {
		html += key + '="' + val + '" ';
	});
	html += '/>';
	return html;
}
function _mediaImg(blankPath, attrs) {
	var width = attrs.width,
		height = attrs.height,
		type = attrs.type || _mediaType(attrs.src),
		srcTag = _mediaEmbed(attrs),
		style = '';
	if (width > 0) {
		style += 'width:' + width + 'px;';
	}
	if (height > 0) {
		style += 'height:' + height + 'px;';
	}
	var html = '<img class="' + _mediaClass(type) + '" src="' + blankPath + '" ';
	if (style !== '') {
		html += 'style="' + style + '" ';
	}
	html += 'kesrctag="' + escape(srcTag) + '" alt="" />';
	return html;
}
K.formatUrl = _formatUrl;
K.formatHtml = _formatHtml;
K.mediaType = _mediaType;
K.mediaAttrs = _mediaAttrs;
K.mediaEmbed = _mediaEmbed;
K.mediaImg = _mediaImg;
function _contains(nodeA, nodeB) {
	if (nodeA.nodeType == 9 && nodeB.nodeType != 9) {
		return true;
	}
	while ((nodeB = nodeB.parentNode)) {
		if (nodeB == nodeA) {
			return true;
		}
	}
	return false;
}
function _getAttr(el, key) {
	key = key.toLowerCase();
	var val = null;
	if (_IE && _V < 8) {
		var div = el.ownerDocument.createElement('div');
		div.appendChild(el.cloneNode(false));
		var list = _getAttrList(div.innerHTML.toLowerCase());
		if (key in list) {
			val = list[key];
		}
	} else {
		val = el.getAttribute(key, 2);
	}
	if (key === 'style' && val !== null) {
		val = _formatCss(val);
	}
	return val;
}
function _queryAll(expr, root) {
	root = root || document;
	function escape(str) {
		if (typeof str != 'string') {
			return str;
		}
		return str.replace(/([^\w\-])/g, '\\$1');
	}
	function stripslashes(str) {
		return str.replace(/\\/g, '');
	}
	function cmpTag(tagA, tagB) {
		return tagA === '*' || tagA.toLowerCase() === escape(tagB.toLowerCase());
	}
	function byId(id, tag, root) {
		var arr = [],
			doc = root.ownerDocument || root,
			el = doc.getElementById(stripslashes(id));
		if (el) {
			if (cmpTag(tag, el.nodeName) && _contains(root, el)) {
				arr.push(el);
			}
		}
		return arr;
	}
	function byClass(className, tag, root) {
		var doc = root.ownerDocument || root, arr = [], els, i, len, el;
		if (root.getElementsByClassName) {
			els = root.getElementsByClassName(stripslashes(className));
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (cmpTag(tag, el.nodeName)) {
					arr.push(el);
				}
			}
		} else if (doc.querySelectorAll) {
			els = doc.querySelectorAll((root.nodeName !== '#document' ? root.nodeName + ' ' : '') + tag + '.' + className);
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (_contains(root, el)) {
					arr.push(el);
				}
			}
		} else {
			els = root.getElementsByTagName(tag);
			className = ' ' + className + ' ';
			for (i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					var cls = el.className;
					if (cls && (' ' + cls + ' ').indexOf(className) > -1) {
						arr.push(el);
					}
				}
			}
		}
		return arr;
	}
	function byName(name, tag, root) {
		var arr = [], doc = root.ownerDocument || root,
			els = doc.getElementsByName(stripslashes(name)), el;
		for (var i = 0, len = els.length; i < len; i++) {
			el = els[i];
			if (cmpTag(tag, el.nodeName) && _contains(root, el)) {
				if (el.getAttributeNode('name')) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	function byAttr(key, val, tag, root) {
		var arr = [], els = root.getElementsByTagName(tag), el;
		for (var i = 0, len = els.length; i < len; i++) {
			el = els[i];
			if (el.nodeType == 1) {
				if (val === null) {
					if (_getAttr(el, key) !== null) {
						arr.push(el);
					}
				} else {
					if (val === escape(_getAttr(el, key))) {
						arr.push(el);
					}
				}
			}
		}
		return arr;
	}
	function select(expr, root) {
		var arr = [], matches;
		matches = /^((?:\\.|[^.#\s\[<>])+)/.exec(expr);
		var tag = matches ? matches[1] : '*';
		if ((matches = /#((?:[\w\-]|\\.)+)$/.exec(expr))) {
			arr = byId(matches[1], tag, root);
		} else if ((matches = /\.((?:[\w\-]|\\.)+)$/.exec(expr))) {
			arr = byClass(matches[1], tag, root);
		} else if ((matches = /\[((?:[\w\-]|\\.)+)\]/.exec(expr))) {
			arr = byAttr(matches[1].toLowerCase(), null, tag, root);
		} else if ((matches = /\[((?:[\w\-]|\\.)+)\s*=\s*['"]?((?:\\.|[^'"]+)+)['"]?\]/.exec(expr))) {
			var key = matches[1].toLowerCase(), val = matches[2];
			if (key === 'id') {
				arr = byId(val, tag, root);
			} else if (key === 'class') {
				arr = byClass(val, tag, root);
			} else if (key === 'name') {
				arr = byName(val, tag, root);
			} else {
				arr = byAttr(key, val, tag, root);
			}
		} else {
			var els = root.getElementsByTagName(tag), el;
			for (var i = 0, len = els.length; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	var parts = [], arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
	while ((arr = re.exec(expr))) {
		if (arr[1] !== ' ') {
			parts.push(arr[1]);
		}
	}
	var results = [];
	if (parts.length == 1) {
		return select(parts[0], root);
	}
	var isChild = false, part, els, subResults, val, v, i, j, k, length, len, l;
	for (i = 0, lenth = parts.length; i < lenth; i++) {
		part = parts[i];
		if (part === '>') {
			isChild = true;
			continue;
		}
		if (i > 0) {
			els = [];
			for (j = 0, len = results.length; j < len; j++) {
				val = results[j];
				subResults = select(part, val);
				for (k = 0, l = subResults.length; k < l; k++) {
					v = subResults[k];
					if (isChild) {
						if (val === v.parentNode) {
							els.push(v);
						}
					} else {
						els.push(v);
					}
				}
			}
			results = els;
		} else {
			results = select(part, root);
		}
		if (results.length === 0) {
			return [];
		}
	}
	return results;
}
function _query(expr, root) {
	var arr = _queryAll(expr, root);
	return arr.length > 0 ? arr[0] : null;
}
K.query = _query;
K.queryAll = _queryAll;
function _get(val) {
	return K(val)[0];
}
function _toCamel(str) {
	var arr = str.split('-');
	str = '';
	_each(arr, function(key, val) {
		str += (key > 0) ? val.charAt(0).toUpperCase() + val.substr(1) : val;
	});
	return str;
}
function _setHtml(el, html) {
	if (el.nodeType != 1) {
		return;
	}
	el.innerHTML = '' + html;
}
function _hasClass(el, cls) {
	return _inString(cls, el.className, ' ');
}
function _setAttr(el, key, val) {
	if (_IE && _V < 8 && key.toLowerCase() == 'class') {
		key = 'className';
	}
	el.setAttribute(key, '' + val);
}
function _removeAttr(el, key) {
	if (_IE && _V < 8 && key.toLowerCase() == 'class') {
		key = 'className';
	}
	_setAttr(el, key, '');
	el.removeAttribute(key);
}
function _getDoc(node) {
	if (!node) {
		return document;
	}
	return node.ownerDocument || node.document || node;
}
function _getWin(node) {
	if (!node) {
		return window;
	}
	var doc = _getDoc(node);
	return doc.parentWindow || doc.defaultView;
}
function _getNodeName(node) {
	if (!node || !node.nodeName) {
		return '';
	}
	return node.nodeName.toLowerCase();
}
function _computedCss(el, key) {
	var self = this, win = _getWin(el), camelKey = _toCamel(key), val = '';
	if (win.getComputedStyle) {
		var style = win.getComputedStyle(el, null);
		val = style[camelKey] || style.getPropertyValue(key) || el.style[camelKey];
	} else if (el.currentStyle) {
		val = el.currentStyle[camelKey] || el.style[camelKey];
	}
	return val;
}
function _hasVal(node) {
	return !!_VALUE_TAG_MAP[_getNodeName(node)];
}
function _docElement(doc) {
	doc = doc || document;
	return (doc.compatMode != 'CSS1Compat') ? doc.body : doc.documentElement;
}
function _docHeight(doc) {
	var el = _docElement(doc);
	return Math.max(el.scrollHeight, el.clientHeight);
}
function _docWidth(doc) {
	var el = _docElement(doc);
	return Math.max(el.scrollWidth, el.clientWidth);
}
function _getScrollPos() {
	var x, y;
	if (_IE || _OPERA) {
		x = _docElement().scrollLeft;
		y = _docElement().scrollTop;
	} else {
		x = window.scrollX;
		y = window.scrollY;
	}
	return {x : x, y : y};
}
function KNode(node) {
	var self = this;
	for (var i = 0, len = node.length; i < len; i++) {
		self[i] = node[i];
	}
	self.length = node.length;
	self.doc = _getDoc(self[0]);
	self.name = _getNodeName(self[0]);
	self.type = self.length > 0 ? self[0].nodeType : null;
	self.win = _getWin(self[0]);
	self._data = {};
}
KNode.prototype = {
	each : function(fn) {
		var self = this;
		for (var i = 0; i < self.length; i++) {
			if (fn.call(self[i], i, self[i]) === false) {
				return self;
			}
		}
		return self;
	},
	bind : function(type, fn) {
		this.each(function() {
			_bind(this, type, fn);
		});
		return this;
	},
	unbind : function(type, fn) {
		this.each(function() {
			_unbind(this, type, fn);
		});
		return this;
	},
	fire : function(type) {
		if (this.length < 1) {
			return this;
		}
		_fire(this[0], type);
		return this;
	},
	hasAttr : function(key) {
		if (this.length < 1) {
			return null;
		}
		return _getAttr(this[0], key);
	},
	attr : function(key, val) {
		var self = this;
		if (key === undefined) {
			return _getAttrList(self.outer());
		}
		if (typeof key === 'object') {
			_each(key, function(k, v) {
				self.attr(k, v);
			});
			return self;
		}
		if (val === undefined) {
			val = self.length < 1 ? null : _getAttr(self[0], key);
			return val === null ? '' : val;
		}
		self.each(function() {
			_setAttr(this, key, val);
		});
		return self;
	},
	removeAttr : function(key) {
		this.each(function() {
			_removeAttr(this, key);
		});
		return this;
	},
	get : function(i) {
		if (this.length < 1) {
			return null;
		}
		return this[i || 0];
	},
	hasClass : function(cls) {
		if (this.length < 1) {
			return false;
		}
		return _hasClass(this[0], cls);
	},
	addClass : function(cls) {
		this.each(function() {
			if (!_hasClass(this, cls)) {
				this.className = _trim(this.className + ' ' + cls);
			}
		});
		return this;
	},
	removeClass : function(cls) {
		this.each(function() {
			if (_hasClass(this, cls)) {
				this.className = _trim(this.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
		});
		return this;
	},
	html : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return '';
			}
			return _formatHtml(self[0].innerHTML);
		}
		self.each(function() {
			_setHtml(this, val);
		});
		return self;
	},
	hasVal : function() {
		if (this.length < 1) {
			return false;
		}
		return _hasVal(this[0]);
	},
	val : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return '';
			}
			return self.hasVal() ? self[0].value : self.attr('value');
		} else {
			self.each(function() {
				if (_hasVal(this)) {
					this.value = val;
				} else {
					_setAttr(this, 'value' , val);
				}
			});
			return self;
		}
	},
	css : function(key, val) {
		var self = this;
		if (key === undefined) {
			return _getCssList(self.attr('style'));
		}
		if (typeof key === 'object') {
			_each(key, function(k, v) {
				self.css(k, v);
			});
			return self;
		}
		if (val === undefined) {
			if (self.length < 1) {
				return '';
			}
			return self[0].style[_toCamel(key)] || _computedCss(self[0], key) || '';
		}
		self.each(function() {
			this.style[_toCamel(key)] = val;
		});
		return self;
	},
	width : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return 0;
			}
			return self[0].offsetWidth;
		}
		return self.css('width', _addUnit(val));
	},
	height : function(val) {
		var self = this;
		if (val === undefined) {
			if (self.length < 1) {
				return 0;
			}
			return self[0].offsetHeight;
		}
		return self.css('height', _addUnit(val));
	},
	opacity : function(val) {
		this.each(function() {
			if (this.style.opacity === undefined) {
				this.style.filter = val == 1 ? '' : 'alpha(opacity=' + (val * 100) + ')';
			} else {
				this.style.opacity = val == 1 ? '' : val;
			}
		});
		return this;
	},
	data : function(key, val) {
		var self = this;
		if (val === undefined) {
			return self._data[key];
		}
		self._data[key] = val;
		return self;
	},
	pos : function() {
		var self = this, node = self[0], x = 0, y = 0;
		if (node) {
			if (node.getBoundingClientRect) {
				var box = node.getBoundingClientRect(),
					pos = _getScrollPos();
				x = box.left + pos.x;
				y = box.top + pos.y;
			} else {
				while (node) {
					x += node.offsetLeft;
					y += node.offsetTop;
					node = node.offsetParent;
				}
			}
		}
		return {x : _round(x), y : _round(y)};
	},
	clone : function(bool) {
		if (this.length < 1) {
			return new KNode([]);
		}
		return new KNode([this[0].cloneNode(bool)]);
	},
	append : function(expr) {
		this.each(function() {
			if (this.appendChild) {
				this.appendChild(_get(expr));
			}
		});
		return this;
	},
	before : function(expr) {
		this.each(function() {
			this.parentNode.insertBefore(_get(expr), this);
		});
		return this;
	},
	after : function(expr) {
		this.each(function() {
			if (this.nextSibling) {
				this.parentNode.insertBefore(_get(expr), this.nextSibling);
			} else {
				this.parentNode.appendChild(_get(expr));
			}
		});
		return this;
	},
	replaceWith : function(expr) {
		var nodes = [];
		this.each(function(i, node) {
			_unbind(node);
			var newNode = _get(expr);
			node.parentNode.replaceChild(newNode, node);
			nodes.push(newNode);
		});
		return K(nodes);
	},
	remove : function(keepChilds) {
		var self = this;
		self.each(function(i, node) {
			_unbind(node);
			if (keepChilds) {
				new KNode(node.childNodes).each(function() {
					new KNode([node]).after(this);
				});
			}
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			delete self[i];
		});
		self.length = 0;
		return self;
	},
	show : function(val) {
		return this.css('display', val === undefined ? 'block' : val);
	},
	hide : function() {
		return this.css('display', 'none');
	},
	outer : function() {
		var self = this;
		if (self.length < 1) {
			return '';
		}
		var div = self.doc.createElement('div'), html;
		div.appendChild(self[0].cloneNode(true));
		html = _formatHtml(div.innerHTML);
		div = null;
		return html;
	},
	isSingle : function() {
		return !!_SINGLE_TAG_MAP[this.name];
	},
	isInline : function() {
		return !!_INLINE_TAG_MAP[this.name];
	},
	isBlock : function() {
		return !!_BLOCK_TAG_MAP[this.name];
	},
	isStyle : function() {
		return !!_STYLE_TAG_MAP[this.name];
	},
	isControl : function() {
		return !!_CONTROL_TAG_MAP[this.name];
	},
	contains : function(otherNode) {
		if (this.length < 1) {
			return false;
		}
		return _contains(this[0], _get(otherNode));
	},
	parent : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].parentNode;
		return node ? new KNode([node]) : null;
	},
	children : function() {
		if (this.length < 1) {
			return [];
		}
		var list = [], child = this[0].firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(new KNode([child]));
			}
			child = child.nextSibling;
		}
		return list;
	},
	first : function() {
		var list = this.children();
		return list.length > 0 ? list[0] : null;
	},
	last : function() {
		var list = this.children();
		return list.length > 0 ? list[list.length - 1] : null;
	},
	index : function() {
		if (this.length < 1) {
			return -1;
		}
		var i = -1, sibling = this[0];
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		return i;
	},
	prev : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].previousSibling;
		return node ? new KNode([node]) : null;
	},
	next : function() {
		if (this.length < 1) {
			return null;
		}
		var node = this[0].nextSibling;
		return node ? new KNode([node]) : null;
	},
	scan : function(fn, order) {
		if (this.length < 1) {
			return;
		}
		order = (order === undefined) ? true : order;
		function walk(node) {
			var n = order ? node.firstChild : node.lastChild;
			while (n) {
				var next = order ? n.nextSibling : n.previousSibling;
				if (fn(n) === false) {
					return false;
				}
				if (walk(n) === false) {
					return false;
				}
				n = next;
			}
		}
		walk(this[0]);
		return this;
	}
};
_each(('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,' +
	'mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,' +
	'change,select,submit,keydown,keypress,keyup,error,contextmenu').split(','), function(i, type) {
	KNode.prototype[type] = function(fn) {
		return fn ? this.bind(type, fn) : this.fire(type);
	};
});
var _K = K;
K = function(expr, root) {
	function newNode(node) {
		if (!node[0]) {
			node = [];
		}
		return new KNode(node);
	}
	if (typeof expr === 'string') {
		if (root) {
			root = _get(root);
		}
		var length = expr.length;
		if (expr.charAt(0) === '@') {
			expr = expr.substr(1);
		}
		if (expr.length !== length || /<.+>/.test(expr)) {
			var doc = root ? root.ownerDocument || root : document,
				div = doc.createElement('div'), list = [];
			_setHtml(div, expr);
			for (var i = 0, len = div.childNodes.length; i < len; i++) {
				list.push(div.childNodes[i]);
			}
			return newNode(list);
		}
		return newNode(_queryAll(expr, root));
	}
	if (expr && expr.get) {
		return expr;
	}
	if (_isArray(expr)) {
		return newNode(expr);
	}
	return newNode(_toArray(arguments));
};
_each(_K, function(key, val) {
	K[key] = val;
});
if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;
var _START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;
function _updateCollapsed(range) {
	range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
	return range;
}
function _nodeToPath(node) {
	var list = [], knode = K(node);
	while (knode && knode.name != 'body') {
		list.push(knode.index());
		knode = knode.parent();
	}
	return list.join(',');
}
function _pathToNode(path, doc) {
	if (path === '') {
		return doc.body;
	}
	var list = path.split(','), node = doc.body;
	for (var i = list.length - 1; i >= 0; i--) {
		var child = node.childNodes[list[i]];
		if (!child) {
			break;
		}
		node = child;
	}
	return node;
}
function _downRange(range) {
	function downPos(node, pos, isStart) {
		if (node.nodeType != 1) {
			return;
		}
		var children = K(node).children();
		if (children.length === 0) {
			return;
		}
		var left, right, child, offset;
		if (pos > 0) {
			left = children[pos - 1];
		}
		if (pos < children.length) {
			right = children[pos];
		}
		if (left && left.type == 3) {
			child = left[0];
			offset = child.nodeValue.length;
		}
		if (right && right.type == 3) {
			child = right[0];
			offset = 0;
		}
		if (!child) {
			return;
		}
		if (isStart) {
			range.setStart(child, offset);
		} else {
			range.setEnd(child, offset);
		}
	}
	downPos(range.startContainer, range.startOffset, true);
	downPos(range.endContainer, range.endOffset, false);
}
function _upRange(range) {
	function upPos(node, pos, isStart) {
		if (node.nodeType != 3) {
			return;
		}
		if (pos === 0) {
			if (isStart) {
				range.setStartBefore(node);
			} else {
				range.setEndBefore(node);
			}
		} else if (pos == node.nodeValue.length) {
			if (isStart) {
				range.setStartAfter(node);
			} else {
				range.setEndAfter(node);
			}
		}
	}
	upPos(range.startContainer, range.startOffset, true);
	upPos(range.endContainer, range.endOffset, false);
}
function _copyAndDelete(range, isCopy, isDelete) {
	var doc = range.doc, nodeList = [];
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length, centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true);
			if (startOffset > 0) {
				centerNode = cloneNode.splitText(startOffset);
			} else {
				centerNode = cloneNode;
			}
			if (endOffset < length) {
				centerNode.splitText(endOffset - startOffset);
			}
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) {
				center = node.splitText(startOffset);
				range.setStart(node, startOffset);
			}
			if (endOffset < length) {
				var right = center.splitText(endOffset - startOffset);
				range.setEnd(right, 0);
			}
			nodeList.push(center);
		}
		return centerNode;
	}
	function removeNodes() {
		if (isDelete) {
			_upRange(range);
			range.collapse(true);
		}
		for (var i = 0, len = nodeList.length; i < len; i++) {
			var node = nodeList[i];
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	}
	var copyRange = range.cloneRange();
	_downRange(copyRange);
	var start = -1, incStart = -1, incEnd = -1, end = -1,
		ancestor = range.commonAncestor(), frag = doc.createDocumentFragment();
	if (ancestor.nodeType == 3) {
		var textNode = splitTextNode(ancestor, range.startOffset, range.endOffset);
		if (isCopy) {
			frag.appendChild(textNode);
		}
		removeNodes();
		return isCopy ? frag : range;
	}
	function extractNodes(parent, frag) {
		var node = parent.firstChild, nextNode;
		while (node) {
			var testRange = new KRange(doc).selectNode(node);
			if (start <= 0) {
				start = testRange.compareBoundaryPoints(_START_TO_END, range);
			}
			if (start >= 0 && incStart <= 0) {
				incStart = testRange.compareBoundaryPoints(_START_TO_START, range);
			}
			if (incStart >= 0 && incEnd <= 0) {
				incEnd = testRange.compareBoundaryPoints(_END_TO_END, range);
			}
			if (incEnd >= 0 && end <= 0) {
				end = testRange.compareBoundaryPoints(_END_TO_START, range);
			}
			if (end >= 0) {
				return false;
			}
			nextNode = node.nextSibling;
			if (start > 0) {
				if (node.nodeType == 1) {
					if (incStart >= 0 && incEnd <= 0) {
						if (isCopy) {
							frag.appendChild(node.cloneNode(true));
						}
						if (isDelete) {
							nodeList.push(node);
						}
					} else {
						var childFlag;
						if (isCopy) {
							childFlag = node.cloneNode(false);
							frag.appendChild(childFlag);
						}
						if (extractNodes(node, childFlag) === false) {
							return false;
						}
					}
				} else if (node.nodeType == 3) {
					var textNode;
					if (node == copyRange.startContainer) {
						textNode = splitTextNode(node, copyRange.startOffset, node.nodeValue.length);
					} else if (node == copyRange.endContainer) {
						textNode = splitTextNode(node, 0, copyRange.endOffset);
					} else {
						textNode = splitTextNode(node, 0, node.nodeValue.length);
					}
					if (isCopy) {
						try {
							frag.appendChild(textNode);
						} catch(e) {}
					}
				}
			}
			node = nextNode;
		}
	}
	extractNodes(ancestor, frag);
	if (isDelete) {
		_upRange(range);
		range.collapse(true);
	}
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}
	return isCopy ? frag : range;
}
function _moveToElementText(range, el) {
	var node = el;
	while (node) {
		var knode = K(node);
		if (knode.name == 'marquee' || knode.name == 'select') {
			return;
		}
		node = node.parentNode;
	}
	try {
		range.moveToElementText(el);
	} catch(e) {}
}
function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument,
		pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement(),
		nodes = parent.childNodes;
	if (nodes.length === 0) {
		return {node: parent.parentNode, offset: K(parent).index()};
	}
	var startNode = doc, startPos = 0, cmp = -1;
	var testRange = rng.duplicate();
	_moveToElementText(testRange, parent);
	for (var i = 0, len = nodes.length; i < len; i++) {
		var node = nodes[i];
		cmp = testRange.compareEndPoints('StartToStart', pointRange);
		if (cmp === 0) {
			return {node: node.parentNode, offset: i};
		}
		if (node.nodeType == 1) {
			var nodeRange = rng.duplicate(), dummy, knode = K(node);
			if (knode.isControl()) {
				dummy = doc.createElement('span');
				knode.after(dummy);
				node = dummy;
			}
			_moveToElementText(nodeRange, node);
			testRange.setEndPoint('StartToEnd', nodeRange);
			if (cmp > 0) {
				startPos += nodeRange.text.replace(/\r\n|\n|\r/g, '').length;
			} else {
				startPos = 0;
			}
			if (dummy) {
				K(dummy).remove();
			}
		} else if (node.nodeType == 3) {
			testRange.moveStart('character', node.nodeValue.length);
			startPos += node.nodeValue.length;
		}
		if (cmp < 0) {
			startNode = node;
		}
	}
	if (cmp < 0 && startNode.nodeType == 1) {
		return {node: parent, offset: K(parent.lastChild).index() + 1};
	}
	if (cmp > 0) {
		while (startNode.nodeType == 1) {
			startNode = startNode.nextSibling;
		}
	}
	testRange = rng.duplicate();
	_moveToElementText(testRange, parent);
	testRange.setEndPoint('StartToEnd', pointRange);
	startPos -= testRange.text.replace(/\r\n|\n|\r/g, '').length;
	return {node: startNode, offset: startPos};
}
function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1 && node.childNodes.length > 0) {
		var children = node.childNodes, isStart, child;
		if (offset === 0) {
			child = children[0];
			isStart = true;
		} else {
			child = children[offset - 1];
			isStart = false;
		}
		if (K(child).name === 'head') {
			if (offset === 1) {
				isStart = true;
			}
			if (offset === 2) {
				isStart = false;
			}
			range.collapse(isStart);
			return range;
		}
		if (child.nodeType == 1) {
			var kchild = K(child), span;
			if (kchild.isControl()) {
				span = doc.createElement('span');
				if (isStart) {
					kchild.before(span);
				} else {
					kchild.after(span);
				}
				child = span;
			}
			_moveToElementText(range, child);
			range.collapse(isStart);
			if (span) {
				K(span).remove();
			}
			return range;
		}
		node = child;
		offset = isStart ? 0 : child.nodeValue.length;
	}
	var dummy = doc.createElement('span');
	K(node).before(dummy);
	_moveToElementText(range, dummy);
	range.moveStart('character', offset);
	K(dummy).remove();
	return range;
}
function _toRange(rng) {
	var doc, range;
	if (_IE) {
		if (rng.item) {
			doc = _getDoc(rng.item(0));
			range = new KRange(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		doc = rng.parentElement().ownerDocument;
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false);
		range = new KRange(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	}
	var startContainer = rng.startContainer;
	doc = startContainer.ownerDocument || startContainer;
	range = new KRange(doc);
	range.setStart(startContainer, rng.startOffset);
	range.setEnd(rng.endContainer, rng.endOffset);
	return range;
}
function KRange(doc) {
	var self = this;
	self.startContainer = doc;
	self.startOffset = 0;
	self.endContainer = doc;
	self.endOffset = 0;
	self.collapsed = true;
	self.doc = doc;
}
KRange.prototype = {
	commonAncestor : function() {
		function getParents(node) {
			var parents = [];
			while (node) {
				parents.push(node);
				node = node.parentNode;
			}
			return parents;
		}
		var parentsA = getParents(this.startContainer),
			parentsB = getParents(this.endContainer),
			i = 0, lenA = parentsA.length, lenB = parentsB.length, parentA, parentB;
		while (++i) {
			parentA = parentsA[lenA - i];
			parentB = parentsB[lenB - i];
			if (!parentA || !parentB || parentA !== parentB) {
				break;
			}
		}
		return parentsA[lenA - i + 1];
	},
	setStart : function(node, offset) {
		var self = this, doc = self.doc;
		self.startContainer = node;
		self.startOffset = offset;
		if (self.endContainer === doc) {
			self.endContainer = node;
			self.endOffset = offset;
		}
		return _updateCollapsed(this);
	},
	setEnd : function(node, offset) {
		var self = this, doc = self.doc;
		self.endContainer = node;
		self.endOffset = offset;
		if (self.startContainer === doc) {
			self.startContainer = node;
			self.startOffset = offset;
		}
		return _updateCollapsed(this);
	},
	setStartBefore : function(node) {
		return this.setStart(node.parentNode || this.doc, K(node).index());
	},
	setStartAfter : function(node) {
		return this.setStart(node.parentNode || this.doc, K(node).index() + 1);
	},
	setEndBefore : function(node) {
		return this.setEnd(node.parentNode || this.doc, K(node).index());
	},
	setEndAfter : function(node) {
		return this.setEnd(node.parentNode || this.doc, K(node).index() + 1);
	},
	selectNode : function(node) {
		return this.setStartBefore(node).setEndAfter(node);
	},
	selectNodeContents : function(node) {
		var knode = K(node);
		if (knode.type == 3 || knode.isSingle()) {
			return this.selectNode(node);
		}
		var children = knode.children();
		if (children.length > 0) {
			return this.setStartBefore(children[0][0]).setEndAfter(children[children.length - 1][0]);
		}
		return this.setStart(node, 0).setEnd(node, 0);
	},
	collapse : function(toStart) {
		if (toStart) {
			return this.setEnd(this.startContainer, this.startOffset);
		}
		return this.setStart(this.endContainer, this.endOffset);
	},
	compareBoundaryPoints : function(how, range) {
		var rangeA = this.get(), rangeB = range.get();
		if (_IE) {
			var arr = {};
			arr[_START_TO_START] = 'StartToStart';
			arr[_START_TO_END] = 'EndToStart';
			arr[_END_TO_END] = 'EndToEnd';
			arr[_END_TO_START] = 'StartToEnd';
			var cmp = rangeA.compareEndPoints(arr[how], rangeB);
			if (cmp !== 0) {
				return cmp;
			}
			var nodeA, nodeB, nodeC, posA, posB;
			if (how === _START_TO_START || how === _END_TO_START) {
				nodeA = this.startContainer;
				posA = this.startOffset;
			}
			if (how === _START_TO_END || how === _END_TO_END) {
				nodeA = this.endContainer;
				posA = this.endOffset;
			}
			if (how === _START_TO_START || how === _START_TO_END) {
				nodeB = range.startContainer;
				posB = range.startOffset;
			}
			if (how === _END_TO_END || how === _END_TO_START) {
				nodeB = range.endContainer;
				posB = range.endOffset;
			}
			if (nodeA === nodeB) {
				var diff = posA - posB;
				return diff > 0 ? 1 : (diff < 0 ? -1 : 0);
			}
			nodeC = nodeB;
			while (nodeC && nodeC.parentNode !== nodeA) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return K(nodeC).index() >= posA ? -1 : 1;
			}
			nodeC = nodeA;
			while (nodeC && nodeC.parentNode !== nodeB) {
				nodeC = nodeC.parentNode;
			}
			if (nodeC) {
				return K(nodeC).index() >= posB ? 1 : -1;
			}
			nodeC = K(nodeB).next();
			if (nodeC && nodeC.contains(nodeA)) {
				return 1;
			}
			nodeC = K(nodeA).next();
			if (nodeC && nodeC.contains(nodeB)) {
				return -1;
			}
		} else {
			return rangeA.compareBoundaryPoints(how, rangeB);
		}
	},
	cloneRange : function() {
		return new KRange(this.doc).setStart(this.startContainer, this.startOffset).setEnd(this.endContainer, this.endOffset);
	},
	toString : function() {
		var rng = this.get(),
			str = _IE ? rng.text : rng.toString();
		return str.replace(/\r\n|\n|\r/g, '');
	},
	cloneContents : function() {
		return _copyAndDelete(this, true, false);
	},
	deleteContents : function() {
		return _copyAndDelete(this, false, true);
	},
	extractContents : function() {
		return _copyAndDelete(this, true, true);
	},
	insertNode : function(node) {
		var self = this,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset,
			firstChild, lastChild, c, nodeCount = 1;
		if (node.nodeName.toLowerCase() === '#document-fragment') {
			firstChild = node.firstChild;
			lastChild = node.lastChild;
			nodeCount = node.childNodes.length;
		}
		if (sc.nodeType == 1) {
			c = sc.childNodes[so];
			if (c) {
				sc.insertBefore(node, c);
				if (sc === ec) {
					eo += nodeCount;
				}
			} else {
				sc.appendChild(node);
			}
		} else if (sc.nodeType == 3) {
			if (so === 0) {
				sc.parentNode.insertBefore(node, sc);
				if (sc.parentNode === ec) {
					eo += nodeCount;
				}
			} else if (so >= sc.nodeValue.length) {
				if (sc.nextSibling) {
					sc.parentNode.insertBefore(node, sc.nextSibling);
				} else {
					sc.parentNode.appendChild(node);
				}
			} else {
				if (so > 0) {
					c = sc.splitText(so);
				} else {
					c = sc;
				}
				sc.parentNode.insertBefore(node, c);
				if (sc === ec) {
					ec = c;
					eo -= so;
				}
			}
		}
		if (firstChild) {
			self.setStartBefore(firstChild).setEndAfter(lastChild);
		} else {
			self.selectNode(node);
		}
		if (self.compareBoundaryPoints(_END_TO_END, self.cloneRange().setEnd(ec, eo)) >= 1) {
			return self;
		}
		return self.setEnd(ec, eo);
	},
	surroundContents : function(node) {
		node.appendChild(this.extractContents());
		return this.insertNode(node).selectNode(node);
	},
	isControl : function() {
		var self = this,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset, rng;
		return sc.nodeType == 1 && sc === ec && so + 1 === eo && K(sc.childNodes[so]).isControl();
	},
	get : function(hasControlRange) {
		var self = this, doc = self.doc, node, rng;
		if (!_IE) {
			rng = doc.createRange();
			try {
				rng.setStart(self.startContainer, self.startOffset);
				rng.setEnd(self.endContainer, self.endOffset);
			} catch (e) {}
			return rng;
		}
		if (hasControlRange && self.isControl()) {
			rng = doc.body.createControlRange();
			rng.addElement(self.startContainer.childNodes[self.startOffset]);
			return rng;
		}
		var range = self.cloneRange();
		_downRange(range);
		rng = doc.body.createTextRange();
		rng.setEndPoint('StartToStart', _getEndRange(range.startContainer, range.startOffset));
		rng.setEndPoint('EndToStart', _getEndRange(range.endContainer, range.endOffset));
		return rng;
	},
	html : function() {
		return K(this.cloneContents()).outer();
	},
	getBookmark : function() {
		var self = this;
		return {
			startPath : _nodeToPath(self.startContainer),
			startOffset : self.startOffset,
			endPath : _nodeToPath(self.endContainer),
			endOffset : self.endOffset
		};
	},
	moveToBookmark : function(bookmark) {
		var self = this;
		return self.setStart(_pathToNode(bookmark.startPath, self.doc), bookmark.startOffset).
			setEnd(_pathToNode(bookmark.endPath, self.doc), bookmark.endOffset);
	},
	dump : function() {
		console.log('--------------------');
		console.log(this.startContainer.nodeType == 3 ? this.startContainer.nodeValue : this.startContainer, this.startOffset);
		console.log(this.endContainer.nodeType == 3 ? this.endContainer.nodeValue : this.endContainer, this.endOffset);
	}
};
function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	return new KRange(mixed);
}
K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;
var _INPUT_KEY_MAP = _toMap('9,32,48..57,59,61,65..90,106,109..111,188,190..192,219..222');
var _CURSORMOVE_KEY_MAP = _toMap('8,13,33..40,46');
var _CHANGE_KEY_MAP = {};
_each(_INPUT_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});
_each(_CURSORMOVE_KEY_MAP, function(key, val) {
	_CHANGE_KEY_MAP[key] = val;
});
function _nativeCommand(doc, key, val) {
	try {
		doc.execCommand(key, false, val);
	} catch(e) {}
}
function _nativeCommandValue(doc, key) {
	var val = '';
	try {
		val = doc.queryCommandValue(key);
	} catch (e) {}
	if (typeof val !== 'string') {
		val = '';
	}
	return val;
}
function _getSel(doc) {
	var win = _getWin(doc);
	return doc.selection || win.getSelection();
}
function _getRng(doc) {
	var sel = _getSel(doc), rng;
	try {
		if (sel.rangeCount > 0) {
			rng = sel.getRangeAt(0);
		} else {
			rng = sel.createRange();
		}
	} catch(e) {}
	if (_IE && (!rng || (!rng.item && rng.parentElement().ownerDocument !== doc))) {
		return null;
	}
	return rng;
}
function _singleKeyMap(map) {
	var newMap = {}, arr, v;
	_each(map, function(key, val) {
		arr = key.split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			v = arr[i];
			newMap[v] = val;
		}
	});
	return newMap;
}
function _hasAttrOrCss(knode, map) {
	return _hasAttrOrCssByKey(knode, map, '*') || _hasAttrOrCssByKey(knode, map);
}
function _hasAttrOrCssByKey(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	var newMap = _singleKeyMap(map);
	if (!newMap[mapKey]) {
		return false;
	}
	var arr = newMap[mapKey].split(',');
	for (var i = 0, len = arr.length; i < len; i++) {
		var key = arr[i];
		if (key === '*') {
			return true;
		}
		var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
		var method = match[1] ? 'css' : 'attr';
		key = match[2];
		var val = match[3] || '';
		if (val === '' && knode[method](key) !== '') {
			return true;
		}
		if (val !== '' && knode[method](key) === val) {
			return true;
		}
	}
	return false;
}
function _removeAttrOrCss(knode, map) {
	_removeAttrOrCssByKey(knode, map, '*');
	_removeAttrOrCssByKey(knode, map);
}
function _removeAttrOrCssByKey(knode, map, mapKey) {
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return;
	}
	var newMap = _singleKeyMap(map);
	if (!newMap[mapKey]) {
		return;
	}
	var arr = newMap[mapKey].split(','), allFlag = false;
	for (var i = 0, len = arr.length; i < len; i++) {
		var key = arr[i];
		if (key === '*') {
			allFlag = true;
			break;
		}
		var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
		key = match[2];
		if (match[1]) {
			key = _toCamel(key);
			if (knode[0].style[key]) {
				knode[0].style[key] = '';
			}
		} else {
			knode.removeAttr(key);
		}
	}
	if (allFlag) {
		knode.remove(true);
	}
}
function _getInnerNode(knode) {
	var inner = knode;
	while (inner.first()) {
		inner = inner.first();
	}
	return inner;
}
function _isEmptyNode(knode) {
	return _getInnerNode(knode).isStyle();
}
function _mergeWrapper(a, b) {
	a = a.clone(true);
	var lastA = _getInnerNode(a), childA = a, merged = false;
	while (b) {
		while (childA) {
			if (childA.name === b.name) {
				_mergeAttrs(childA, b.attr(), b.css());
				merged = true;
			}
			childA = childA.first();
		}
		if (!merged) {
			lastA.append(b.clone(false));
		}
		merged = false;
		b = b.first();
	}
	return a;
}
function _wrapNode(knode, wrapper) {
	wrapper = wrapper.clone(true);
	if (knode.type == 3) {
		_getInnerNode(wrapper).append(knode.clone(false));
		knode.replaceWith(wrapper);
		return wrapper;
	}
	var nodeWrapper = knode, child;
	while ((child = knode.first()) && child.children().length == 1) {
		knode = child;
	}
	child = knode.first();
	var frag = knode.doc.createDocumentFragment();
	while (child) {
		frag.appendChild(child[0]);
		child = child.next();
	}
	wrapper = _mergeWrapper(nodeWrapper, wrapper);
	if (frag.firstChild) {
		_getInnerNode(wrapper).append(frag);
	}
	nodeWrapper.replaceWith(wrapper);
	return wrapper;
}
function _mergeAttrs(knode, attrs, styles) {
	_each(attrs, function(key, val) {
		if (key !== 'style') {
			knode.attr(key, val);
		}
	});
	_each(styles, function(key, val) {
		knode.css(key, val);
	});
}
function KCmd(range) {
	var self = this, doc = range.doc;
	self.doc = doc;
	self.win = _getWin(doc);
	self.sel = _getSel(doc);
	self.range = range;
}
KCmd.prototype = {
	selection : function() {
		var self = this, doc = self.doc, rng = _getRng(doc);
		if (rng) {
			self.range = _range(rng);
			if (K(self.range.startContainer).name == 'html') {
				self.range.selectNodeContents(doc.body).collapse(false);
			}
		}
		return self;
	},
	select : function() {
		var self = this, sel = self.sel, range = self.range.cloneRange(),
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			doc = sc.ownerDocument || sc, win = self.win, rng;
		if (sc.nodeType == 1 && range.collapsed) {
			if (_IE) {
				var dummy = K('<span>&nbsp;</span>', doc);
				range.insertNode(dummy[0]);
				rng = doc.body.createTextRange();
				rng.moveToElementText(dummy[0]);
				rng.collapse(false);
				rng.select();
				dummy.remove();
				win.focus();
				return self;
			}
			if (_WEBKIT) {
				range.insertNode(doc.createTextNode('\u200B'));
			}
		}
		rng = range.get(true);
		if (_IE) {
			try {
				rng.select();
			} catch(e) {}
		} else {
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		win.focus();
		return self;
	},
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range, wrapper;
		wrapper = K(val, doc);
		if (range.collapsed) {
			range.insertNode(wrapper[0]).selectNodeContents(wrapper[0]);
			return self;
		}
		if (wrapper.isBlock()) {
			var copyWrapper = wrapper.clone(true), child = copyWrapper;
			while (child.first()) {
				child = child.first();
			}
			child.append(range.extractContents());
			range.insertNode(copyWrapper[0]).selectNode(copyWrapper[0]);
			return self;
		}
		function wrapTextNode(node, startOffset, endOffset) {
			var length = node.nodeValue.length, center = node;
			if (endOffset <= startOffset) {
				return;
			}
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			var parent, knode = K(center);
			while ((parent = knode.parent()) && parent.isStyle() && parent.children().length == 1) {
				knode = parent;
			}
			var el = _wrapNode(knode, wrapper)[0];
			if (range.startContainer == node || range.startContainer == knode[0]) {
				range.setStartBefore(el);
			}
			if (range.endContainer == node || range.endContainer == knode[0]) {
				range.setEndAfter(el);
			}
		}
		var ancestor = range.commonAncestor();
		if (ancestor.nodeType == 3) {
			wrapTextNode(ancestor, range.startOffset, range.endOffset);
			return self;
		}
		var start = -1, end = -1, testRange,
			cmpStart = (ancestor == range.startContainer),
			cmpEnd = (ancestor == range.endContainer);
		K(ancestor).scan(function(node) {
			if (!cmpStart && node == range.startContainer) {
				cmpStart = true;
			}
			if (!cmpEnd && node == range.endContainer) {
				cmpEnd = true;
			}
			if (cmpStart && start <= 0) {
				testRange = _range(doc).selectNode(node);
				start = testRange.compareBoundaryPoints(_START_TO_END, range);
			}
			if (cmpEnd && start >= 0 && end <= 0) {
				testRange = _range(doc).selectNode(node);
				end = testRange.compareBoundaryPoints(_END_TO_START, range);
			}
			if (end >= 0) {
				return false;
			}
			if (start > 0 && node.nodeType == 3 && _trim(node.nodeValue).length > 0) {
				if (node == range.startContainer) {
					wrapTextNode(node, range.startOffset, node.nodeValue.length);
				} else if (node == range.endContainer) {
					wrapTextNode(node, 0, range.endOffset);
				} else {
					wrapTextNode(node, 0, node.nodeValue.length);
				}
			}
		});
		return self;
	},
	split : function(isStart, map) {
		var range = this.range, doc = range.doc;
		var tempRange = range.cloneRange().collapse(isStart);
		var node = tempRange.startContainer, pos = tempRange.startOffset,
			parent = node.nodeType == 3 ? node.parentNode : node,
			needSplit = false, knode;
		while (parent && parent.parentNode) {
			knode = K(parent);
			if (!knode.isStyle()) {
				break;
			}
			if (!_hasAttrOrCss(knode, map)) {
				break;
			}
			needSplit = true;
			parent = parent.parentNode;
		}
		if (needSplit) {
			var dummy = doc.createElement('span');
			range.cloneRange().collapse(!isStart).insertNode(dummy);
			if (isStart) {
				tempRange.setStartBefore(parent.firstChild).setEnd(node, pos);
			} else {
				tempRange.setStart(node, pos).setEndAfter(parent.lastChild);
			}
			var frag = tempRange.extractContents(),
				first = frag.firstChild, last = frag.lastChild;
			if (isStart) {
				tempRange.insertNode(frag);
				range.setStartAfter(last).setEndBefore(dummy);
			} else {
				parent.appendChild(frag);
				range.setStartBefore(dummy).setEndBefore(first);
			}
			var dummyParent = dummy.parentNode;
			if (dummyParent == range.endContainer) {
				var prev = K(dummy).prev(), next = K(dummy).next();
				if (prev && next && prev.type == 3 && next.type == 3) {
					range.setEnd(prev[0], prev[0].nodeValue.length);
				} else if (!isStart) {
					range.setEnd(range.endContainer, range.endOffset - 1);
				}
			}
			dummyParent.removeChild(dummy);
		}
		return this;
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;
		if (range.collapsed) {
			self.split(true, map);
			range.collapse(true);
			return self;
		}
		if (range.startOffset === 0) {
			var ksc = K(range.startContainer), parent;
			while ((parent = ksc.parent()) && parent.isStyle() && parent.children().length == 1) {
				ksc = parent;
			}
			range.setStart(ksc[0], 0);
			ksc = K(range.startContainer);
			if (ksc.isBlock()) {
				_removeAttrOrCss(ksc, map);
			}
			var kscp = ksc.parent();
			if (kscp && kscp.isBlock()) {
				_removeAttrOrCss(kscp, map);
			}
		}
		self.split(true, map);
		self.split(false, map);
		var startDummy = doc.createElement('span'), endDummy = doc.createElement('span');
		range.cloneRange().collapse(false).insertNode(endDummy);
		range.cloneRange().collapse(true).insertNode(startDummy);
		var nodeList = [], cmpStart = false;
		K(range.commonAncestor()).scan(function(node) {
			if (!cmpStart && node == startDummy) {
				cmpStart = true;
				return;
			}
			if (node == endDummy) {
				return false;
			}
			if (cmpStart) {
				nodeList.push(node);
			}
		});
		K(startDummy).remove();
		K(endDummy).remove();
		var sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (so > 0) {
			var startBefore = K(sc.childNodes[so - 1]);
			if (startBefore && _isEmptyNode(startBefore)) {
				startBefore.remove();
				range.setStart(sc, so - 1);
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
			var startAfter = K(sc.childNodes[so]);
			if (startAfter && _isEmptyNode(startAfter)) {
				startAfter.remove();
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
		}
		var endAfter = K(ec.childNodes[range.endOffset]);
		if (endAfter && _isEmptyNode(endAfter)) {
			endAfter.remove();
		}
		var startNode = sc.nodeType == 3 ? sc : sc.childNodes[so],
			endNode =  ec.nodeType == 3 || ec === 0 ? ec : ec.childNodes[eo - 1];
		_each(nodeList, function(i, node) {
			var knode = K(node);
			_removeAttrOrCss(knode, map);
		});
		return self;
	},
	commonNode : function(map) {
		var range = this.range,
			ec = range.endContainer, eo = range.endOffset,
			node = (ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1],
			child = node, parent = node;
		while (child && (child = child.firstChild) && child.childNodes.length == 1) {
			if (_hasAttrOrCss(K(child), map)) {
				return K(child);
			}
		}
		while (parent) {
			if (_hasAttrOrCss(K(parent), map)) {
				return K(parent);
			}
			parent = parent.parentNode;
		}
		if (node.nodeType == 1 || (ec.nodeType == 3 && eo === 0)) {
			var prev = K(node).prev();
			if (prev && _hasAttrOrCss(prev, map)) {
				return prev;
			}
		}
		return null;
	},
	state : function(key) {
		var self = this, doc = self.doc, bool = false;
		try {
			bool = doc.queryCommandState(key);
		} catch (e) {}
		return bool;
	},
	val : function(key) {
		var self = this, doc = self.doc, range = self.range;
		function lc(val) {
			return val.toLowerCase();
		}
		key = lc(key);
		var val = '', knode;
		if (key === 'fontfamily' || key === 'fontname') {
			val = _nativeCommandValue(doc, 'fontname');
			val = val.replace(/['"]/g, '');
			return lc(val);
		}
		if (key === 'formatblock') {
			val = _nativeCommandValue(doc, key);
			if (val === '') {
				knode = self.commonNode({'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
				if (knode) {
					val = knode.name;
				}
			}
			if (val === 'Normal') {
				val = 'p';
			}
			return lc(val);
		}
		if (key === 'fontsize') {
			knode = self.commonNode({'*' : '.font-size'});
			if (knode) {
				val = knode.css('font-size');
			}
			return lc(val);
		}
		if (key === 'forecolor') {
			knode = self.commonNode({'*' : '.color'});
			if (knode) {
				val = knode.css('color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		if (key === 'hilitecolor') {
			knode = self.commonNode({'*' : '.background-color'});
			if (knode) {
				val = knode.css('background-color');
			}
			val = _toHex(val);
			if (val === '') {
				val = 'default';
			}
			return lc(val);
		}
		return val;
	},
	toggle : function(wrapper, map) {
		var self = this;
		if (self.commonNode(map)) {
			self.remove(map);
		} else {
			self.wrap(wrapper);
		}
		return self.select();
	},
	bold : function() {
		return this.toggle('<strong></strong>', {
			span : '.font-weight=bold',
			strong : '*',
			b : '*'
		});
	},
	italic : function() {
		return this.toggle('<em></em>', {
			span : '.font-style=italic',
			em : '*',
			i : '*'
		});
	},
	underline : function() {
		return this.toggle('<u></u>', {
			span : '.text-decoration=underline',
			u : '*'
		});
	},
	strikethrough : function() {
		return this.toggle('<s></s>', {
			span : '.text-decoration=line-through',
			s : '*'
		});
	},
	forecolor : function(val) {
		return this.toggle('<span style="color:' + val + ';"></span>', {
			span : '.color=' + val,
			font : 'color'
		});
	},
	hilitecolor : function(val) {
		return this.toggle('<span style="background-color:' + val + ';"></span>', {
			span : '.background-color=' + val
		});
	},
	fontsize : function(val) {
		return this.toggle('<span style="font-size:' + val + ';"></span>', {
			span : '.font-size=' + val,
			font : 'size'
		});
	},
	fontname : function(val) {
		return this.fontfamily(val);
	},
	fontfamily : function(val) {
		return this.toggle('<span style="font-family:' + val + ';"></span>', {
			span : '.font-family=' + val,
			font : 'face'
		});
	},
	removeformat : function() {
		var map = {
			'*' : '.font-weight,.font-style,.text-decoration,.color,.background-color,.font-size,.font-family'
		},
		tags = _STYLE_TAG_MAP;
		_each(tags, function(key, val) {
			map[key] = '*';
		});
		this.remove(map);
		return this.select();
	},
	inserthtml : function(val) {
		var self = this, doc = self.doc, range = self.range,
			frag = doc.createDocumentFragment();
		K('@' + val, doc).each(function() {
			frag.appendChild(this);
		});
		range.deleteContents();
		range.insertNode(frag);
		range.collapse(false);
		return self.select();
	},
	hr : function() {
		return this.inserthtml('<hr />');
	},
	print : function() {
		this.win.print();
		return this;
	},
	insertimage : function(url, title, width, height, border, align) {
		title = _undef(title, '');
		border = _undef(border, 0);
		var html = '<img src="' + url + '" ';
		if (width) {
			html += 'width="' + width + '" ';
		}
		if (height) {
			html += 'height="' + height + '" ';
		}
		if (title) {
			html += 'title="' + title + '" ';
		}
		if (align) {
			html += 'align="' + align + '" ';
		}
		html += 'alt="' + title + '" ';
		html += 'border="' + border + '" />';
		return this.inserthtml(html);
	},
	createlink : function(url, type) {
		var self = this, doc = self.doc, range = self.range;
		self.select();
		var a = self.commonNode({ a : '*' });
		if (a && !range.isControl()) {
			range.selectNode(a.get());
			self.select();
		}
		if (range.collapsed) {
			var html = '<a href="' + url + '"';
			if (type) {
				html += ' target="' + type + '"';
			}
			html += '>' + url + '</a>';
			self.inserthtml(html);
		} else {
			_nativeCommand(doc, 'createlink', '__ke_temp_url__');
			a = self.commonNode({ a : '*' });
			K('a[href="__ke_temp_url__"]', a ? a.parent() : doc).each(function() {
				K(this).attr('href', url);
				if (type) {
					K(this).attr('target', type);
				} else {
					K(this).removeAttr('target');
				}
			});
		}
		return self;
	},
	unlink : function() {
		var self = this, doc = self.doc, range = self.range;
		self.select();
		if (range.collapsed) {
			var a = self.commonNode({ a : '*' });
			if (a) {
				range.selectNode(a.get());
				self.select();
			}
			_nativeCommand(doc, 'unlink', null);
			if (_WEBKIT && K(range.startContainer).name === 'img') {
				var parent = K(range.startContainer).parent();
				if (parent.name === 'a') {
					parent.remove(true);
				}
			}
		} else {
			_nativeCommand(doc, 'unlink', null);
		}
		return self;
	},
	oninput : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
				fn(e);
			}
		});
		return self;
	},
	oncursormove : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CURSORMOVE_KEY_MAP[e.which]) {
				fn(e);
			}
		});
		K(doc).mouseup(fn);
		return self;
	},
	onchange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
			}
		});
		K(doc).mouseup(fn).contextmenu(fn);
		if (doc !== document) {
			K(document).mousedown(fn);
		}
		function timeoutHandler(e) {
			setTimeout(function() {
				fn(e);
			}, 1);
		}
		K(body).bind('paste', timeoutHandler);
		K(body).bind('cut', timeoutHandler);
		return self;
	}
};
_each(('formatblock,selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript').split(','), function(i, name) {
	KCmd.prototype[name] = function(val) {
		var self = this;
		_nativeCommand(self.doc, name, val);
		return self;
	};
});
_each('cut,copy,paste'.split(','), function(i, name) {
	KCmd.prototype[name] = function() {
		var self = this;
		if (!self.doc.queryCommandSupported(name)) {
			throw 'not supported';
		}
		_nativeCommand(self.doc, name, null);
		return self;
	};
});
function _cmd(mixed) {
	if (mixed.nodeName) {
		var doc = _getDoc(mixed),
			range = _range(doc).selectNodeContents(doc.body).collapse(false),
			cmd = new KCmd(range);
		cmd.onchange(function(e) {
			cmd.selection();
		});
		if (_WEBKIT) {
			K(doc).click(function(e) {
				if (K(e.target).name === 'img') {
					var rng = _getRng(doc);
					if (rng) {
						cmd.range = _range(rng);
					}
					cmd.range.selectNode(e.target);
					cmd.select();
				}
			});
		}
		return cmd;
	}
	return new KCmd(mixed);
}
K.cmd = _cmd;
function _drag(options) {
	var moveEl = options.moveEl,
		moveFn = options.moveFn,
		clickEl = options.clickEl || moveEl,
		beforeDrag = options.beforeDrag,
		iframeFix = options.iframeFix === undefined ? true : options.iframeFix;
	var docs = [document],
		poss = [{ x : 0, y : 0}],
		listeners = [];
	if (iframeFix) {
		K('iframe').each(function() {
			try {
				docs.push(_iframeDoc(this));
			} catch (e) {}
			poss.push(K(this).pos());
		});
	}
	clickEl.mousedown(function(e) {
		var self = clickEl.get(),
			x = _removeUnit(moveEl.css('left')),
			y = _removeUnit(moveEl.css('top')),
			width = moveEl.width(),
			height = moveEl.height(),
			pageX = e.pageX,
			pageY = e.pageY,
			dragging = true;
		if (beforeDrag) {
			beforeDrag();
		}
		_each(docs, function(i, doc) {
			function moveListener(e) {
				if (dragging) {
					var diffX = _round(poss[i].x + e.pageX - pageX),
						diffY = _round(poss[i].y + e.pageY - pageY);
					moveFn.call(clickEl, x, y, width, height, diffX, diffY);
				}
				e.stop();
			}
			function selectListener(e) {
				e.stop();
			}
			function upListener(e) {
				dragging = false;
				if (self.releaseCapture) {
					self.releaseCapture();
				}
				_each(listeners, function() {
					K(this.doc).unbind('mousemove', this.move)
						.unbind('mouseup', this.up)
						.unbind('selectstart', this.select);
				});
				e.stop();
			}
			K(doc).mousemove(moveListener)
				.mouseup(upListener)
				.bind('selectstart', selectListener);
			listeners.push({
				doc : doc,
				move : moveListener,
				up : upListener,
				select : selectListener
			});
		});
		if (self.setCapture) {
			self.setCapture();
		}
		e.stop();
	});
}
function _widget(options) {
	var name = options.name || '',
		x = _addUnit(options.x),
		y = _addUnit(options.y),
		z = options.z,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		cls = options.cls,
		css = options.css,
		html = options.html,
		doc = options.doc || document,
		parent = options.parent || doc.body,
		div = K('<div style="display:block;"></div>');
	function resetPos(width, height) {
		if (z && (options.x === undefined || options.y === undefined)) {
			var w = _removeUnit(width) || 0,
				h = _removeUnit(height) || 0;
			if (options.alignEl) {
				var el = options.alignEl,
					pos = K(el).pos(),
					diffX = _round(el.clientWidth / 2 - w / 2),
					diffY = _round(el.clientHeight / 2 - h / 2);
				x = diffX < 0 ? pos.x : pos.x + diffX;
				y = diffY < 0 ? pos.y : pos.y + diffY;
			} else {
				var docEl = _docElement(doc),
					scrollPos = _getScrollPos();
				x = _round(scrollPos.x + (docEl.clientWidth - w) / 2);
				y = _round(scrollPos.y + (docEl.clientHeight - h) / 2);
			}
			x = x < 0 ? 0 : _addUnit(x);
			y = y < 0 ? 0 : _addUnit(y);
			div.css({
				left : x,
				top : y
			});
		}
	}
	if (width) {
		div.css('width', width);
	}
	if (height) {
		div.css('height', height);
	}
	if (z) {
		div.css({
			position : 'absolute',
			left : x,
			top : y,
			'z-index' : z
		});
	}
	resetPos(width, height);
	if (cls) {
		div.addClass(cls);
	}
	if (css) {
		div.css(css);
	}
	if (html) {
		div.html(html);
	}
	K(parent).append(div);
	return {
		name : name,
		doc : doc,
		div : function() {
			return div;
		},
		remove : function() {
			div.remove();
			return this;
		},
		show : function() {
			div.show();
			return this;
		},
		hide : function() {
			div.hide();
			return this;
		},
		draggable : function(options) {
			options = options || {};
			options.moveEl = div;
			options.moveFn = function(x, y, width, height, diffX, diffY) {
				if ((x = x + diffX) < 0) {
					x = 0;
				}
				if ((y = y + diffY) < 0) {
					y = 0;
				}
				div.css('left', _addUnit(x)).css('top', _addUnit(y));
			};
			_drag(options);
			return this;
		},
		resetPos : resetPos
	};
}
K.widget = _widget;
function _iframeDoc(iframe) {
	iframe = _get(iframe);
	return iframe.contentDocument || iframe.contentWindow.document;
}
function _getInitHtml(themesPath, bodyClass, cssPath, cssData) {
	var arr = [
		'<html><head><meta charset="utf-8" /><title>KindEditor</title>',
		'<style>',
		'html {margin:0;padding:0;}',
		'body {margin:0;padding:5px;}',
		'body, td {font:12px/1.5 "sans serif",tahoma,verdana,helvetica;}',
		'p {margin:5px 0;}',
		'table {border-collapse:collapse;}',
		'table.ke-zeroborder td {border:1px dotted #AAAAAA;}',
		'.ke-flash {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/flash.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'.ke-rm {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/rm.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'.ke-media {',
		'	border:1px solid #AAAAAA;',
		'	background-image:url(' + themesPath + 'common/media.gif);',
		'	background-position:center center;',
		'	background-repeat:no-repeat;',
		'	width:100px;',
		'	height:100px;',
		'}',
		'</style>'
	];
	if (_isArray(cssPath)) {
		_each(cssPath, function(i, path) {
			if (path !== '') {
				arr.push('<link href="' + path + '" rel="stylesheet" />');
			}
		});
	} else {
		if (cssPath) {
			arr.push('<link href="' + cssPath + '" rel="stylesheet" />');
		}
	}
	if (cssData) {
		arr.push('<style>' + cssData + '</style>');
	}
	arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
	return arr.join('');
}
function _elementVal(knode, val) {
	return knode.hasVal() ? knode.val(val) : knode.html(val);
}
function _edit(options) {
	var self = _widget(options),
		remove = self.remove,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		srcElement = K(options.srcElement),
		designMode = _undef(options.designMode, true),
		themesPath = _undef(options.themesPath, ''),
		bodyClass = options.bodyClass,
		cssPath = options.cssPath,
		cssData = options.cssData,
		isDocumentDomain = location.host !== document.domain,
		div = self.div().addClass('ke-edit');
	var srcScript = 'document.open();' +
		(isDocumentDomain ? 'document.domain="' + document.domain + '";' : '') +
		'document.close();',
		iframeSrc = _IE ? ' src="javascript:void(function(){' + encodeURIComponent(srcScript) + '}())"' : '',
		iframe = K('<iframe class="ke-edit-iframe" frameborder="0"' + iframeSrc + '></iframe>'),
		textarea = K('<textarea class="ke-edit-textarea" kindeditor="true"></textarea>');
	iframe.css('width', '100%');
	textarea.css('width', '100%');
	self.width = function(val) {
		div.css('width', _addUnit(val));
		return self;
	};
	self.height = function(val) {
		val = _addUnit(val);
		div.css('height', val);
		iframe.css('height', val);
		if ((_IE && _V < 8) || document.compatMode != 'CSS1Compat') {
			val = _addUnit(_removeUnit(val) - 2);
		}
		textarea.css('height', val);
		return self;
	};
	if (width) {
		self.width(width);
	}
	if (height) {
		self.height(height);
	}
	if (designMode) {
		textarea.hide();
	} else {
		iframe.hide();
	}
	self.remove = function() {
		var doc = self.doc;
		K(doc).unbind();
		K(doc.body).unbind();
		K(document).unbind();
		_elementVal(srcElement, self.html());
		srcElement.show();
		doc.write('');
		doc.clear();
		iframe.remove();
		textarea.remove();
		remove.call(self);
		return self;
	};
	self.html = function(val) {
		var doc = self.doc;
		if (designMode) {
			var body = doc.body;
			if (val === undefined) {
				return K(body).html();
			}
			K(body).html(val);
			return self;
		}
		if (val === undefined) {
			return textarea.val();
		}
		textarea.val(val);
		return self;
	};
	self.design = function(bool) {
		var val;
		if (bool === undefined ? !designMode : bool) {
			if (!designMode) {
				val = self.html();
				designMode = true;
				self.html(val);
				textarea.hide();
				iframe.show();
			}
		} else {
			if (designMode) {
				val = self.html();
				designMode = false;
				self.html(val);
				iframe.hide();
				textarea.show();
			}
		}
		self.focus();
		return self;
	};
	self.focus = function() {
		if (designMode) {
			iframe[0].contentWindow.focus();
		} else {
			textarea[0].focus();
		}
		return self;
	};
	function ready() {
		var doc = _iframeDoc(iframe);
		doc.open();
		if (isDocumentDomain) {
			doc.domain = document.domain;
		}
		doc.write(_getInitHtml(themesPath, bodyClass, cssPath, cssData));
		doc.close();
		self.doc = doc;
		self.html(_elementVal(srcElement));
		if (_IE) {
			doc.body.disabled = true;
			doc.body.contentEditable = true;
			doc.body.removeAttribute('disabled');
		} else {
			doc.body.contentEditable = true;
		}
		self.cmd = _cmd(doc);
		if (options.afterCreate) {
			options.afterCreate.call(self);
		}
	}
	iframe.bind('load', function() {
		iframe.unbind('load');
		if (_IE) {
			ready();
		} else {
			setTimeout(ready, 0);
		}
	});
	div.append(iframe);
	div.append(textarea);
	srcElement.hide();
	self.iframe = iframe;
	self.textarea = textarea;
	return self;
}
K.edit = _edit;
K.iframeDoc = _iframeDoc;
function _bindToolbarEvent(itemNode, item) {
	itemNode.mouseover(function(e) {
		K(this).addClass('ke-toolbar-icon-outline-on');
	})
	.mouseout(function(e) {
		K(this).removeClass('ke-toolbar-icon-outline-on');
	})
	.click(function(e) {
		item.click.call(this, e);
	});
}
function _toolbar(options) {
	var self = _widget(options),
		remove = self.remove,
		disableMode = options.disableMode === undefined ? false : options.disableMode,
		noDisableItems = options.noDisableItems === undefined ? [] : options.noDisableItems,
		div = self.div(),
		itemNodes = {};
	div.addClass('ke-toolbar')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	self.get = function(key) {
		return itemNodes[key];
	};
	self.addItem = function(item) {
		var itemNode;
		if (item.name == '|') {
			itemNode = K('<span class="ke-inline-block ke-toolbar-separator"></span>');
		} else if (item.name == '/') {
			itemNode = K('<br />');
		} else {
			var title = item.title || '';
			itemNode = K('<a class="ke-inline-block ke-toolbar-icon-outline" href="javascript:;" title="' + title + '">' +
				'<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ke-icon-' + item.name + '"></span></a>');
			_bindToolbarEvent(itemNode, item);
		}
		itemNode.data('item', item);
		itemNodes[item.name] = itemNode;
		div.append(itemNode);
	};
	self.remove = function() {
		_each(itemNodes, function(key, val) {
			val.remove();
		});
		remove.call(self);
	};
	self.disable = function(bool) {
		var arr = noDisableItems, item;
		if (bool === undefined ? !disableMode : bool) {
			_each(itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.addClass('ke-toolbar-icon-outline-disabled');
					val.opacity(0.5);
					if (item.name !== '|') {
						val.unbind();
					}
				}
			});
			disableMode = true;
		} else {
			_each(itemNodes, function(key, val) {
				item = val.data('item');
				if (item.name !== '/' && _inArray(item.name, arr) < 0) {
					val.removeClass('ke-toolbar-icon-outline-disabled');
					val.opacity(1);
					if (item.name !== '|') {
						_bindToolbarEvent(val, item);
					}
				}
			});
			disableMode = false;
		}
	};
	return self;
}
K.toolbar = _toolbar;
function _menu(options) {
	options.z = options.z || 811213;
	var self = _widget(options),
		div = self.div(),
		remove = self.remove,
		centerLineMode = options.centerLineMode === undefined ? true : options.centerLineMode;
	div.addClass('ke-menu');
	self.addItem = function(item) {
		if (item.title === '-') {
			div.append(K('<div class="ke-menu-separator"></div>'));
			return;
		}
		var itemDiv = K('<div class="ke-menu-item"></div>'),
			leftDiv = K('<div class="ke-inline-block ke-menu-item-left"></div>'),
			rightDiv = K('<div class="ke-inline-block ke-menu-item-right"></div>'),
			height = _addUnit(item.height),
			iconClass = item.iconClass;
		div.append(itemDiv);
		if (height) {
			itemDiv.css('height', height);
			rightDiv.css('line-height', height);
		}
		var centerDiv;
		if (centerLineMode) {
			centerDiv = K('<div class="ke-inline-block ke-menu-item-center"></div>');
			if (height) {
				centerDiv.css('height', height);
			}
		}
		itemDiv.mouseover(function(e) {
			K(this).addClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.addClass('ke-menu-item-center-on');
			}
		});
		itemDiv.mouseout(function(e) {
			K(this).removeClass('ke-menu-item-on');
			if (centerDiv) {
				centerDiv.removeClass('ke-menu-item-center-on');
			}
		});
		itemDiv.click(function(e) {
			item.click.call(K(this));
			e.stop();
		});
		itemDiv.append(leftDiv);
		if (centerDiv) {
			itemDiv.append(centerDiv);
		}
		itemDiv.append(rightDiv);
		if (item.checked) {
			iconClass = 'ke-icon-checked';
		}
		leftDiv.html('<span class="ke-inline-block ke-toolbar-icon ke-toolbar-icon-url ' + iconClass + '"></span>');
		rightDiv.html(item.title);
	};
	self.remove = function() {
		K('.ke-menu-item', div.get()).remove();
		remove.call(self);
	};
	return self;
}
K.menu = _menu;
function _colorpicker(options) {
	options.z = options.z || 811213;
	var self = _widget(options),
		colors = options.colors || [
			['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
			['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
			['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
			['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
		],
		selectedColor = (options.selectedColor || '').toLowerCase(),
		remove = self.remove,
		cells = [];
	self.div().addClass('ke-colorpicker');
	function addAttr(cell, color, cls) {
		cell = K(cell).addClass(cls);
		if (selectedColor === color.toLowerCase()) {
			cell.addClass('ke-colorpicker-cell-selected');
		}
		cell.attr('title', color || options.noColor);
		cell.mouseover(function(e) {
			K(this).addClass('ke-colorpicker-cell-on');
		});
		cell.mouseout(function(e) {
			K(this).removeClass('ke-colorpicker-cell-on');
		});
		cell.click(function(e) {
			options.click.call(K(this), color);
			e.stop();
		});
		if (color) {
			cell.append(K('<div class="ke-colorpicker-cell-color"></div>').css('background-color', color));
		} else {
			cell.html(options.noColor);
		}
		cells.push(cell);
	}
	var table = self.doc.createElement('table');
	self.div().append(table);
	table.className = 'ke-colorpicker-table';
	table.cellPadding = 0;
	table.cellSpacing = 0;
	table.border = 0;
	var row = table.insertRow(0), cell = row.insertCell(0);
	cell.colSpan = colors[0].length;
	addAttr(cell, '', 'ke-colorpicker-cell-top');
	for (var i = 0; i < colors.length; i++) {
		row = table.insertRow(i + 1);
		for (var j = 0; j < colors[i].length; j++) {
			cell = row.insertCell(j);
			addAttr(cell, colors[i][j], 'ke-colorpicker-cell');
		}
	}
	self.remove = function() {
		_each(cells, function() {
			this.unbind();
		});
		remove.call(self);
	};
	return self;
}
K.colorpicker = _colorpicker;
function _button(arg) {
	arg = arg || {};
	var name = arg.name || '',
		span = K('<span class="ke-button-common ke-button-outer" title="' + name + '"></span>'),
		btn = K('<input class="ke-button-common ke-button" type="button" value="' + name + '" />');
	if (arg.click) {
		btn.click(arg.click);
	}
	span.append(btn);
	return span;
}
function _dialog(options) {
	options.z = options.z || 811213;
	var self = _widget(options),
		remove = self.remove,
		width = _addUnit(options.width),
		height = _addUnit(options.height),
		doc = self.doc,
		div = self.div(),
		title = options.title,
		body = K(options.body, doc),
		previewBtn = options.previewBtn,
		yesBtn = options.yesBtn,
		noBtn = options.noBtn,
		closeBtn = options.closeBtn,
		shadowMode = options.shadowMode === undefined ? true : options.shadowMode,
		docEl = doc.documentElement,
		docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth),
		docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight);
	div.addClass('ke-dialog').bind('click,mousedown', function(e){
		e.stopPropagation();
	});
	div.addClass('ke-dialog-' + (shadowMode ? '' : 'no-') + 'shadow');
	var headerDiv = K('<div class="ke-dialog-header"></div>');
	div.append(headerDiv);
	headerDiv.html(title);
	var span = K('<span class="ke-dialog-icon-close" title="' + closeBtn.name + '"></span>').click(closeBtn.click);
	headerDiv.append(span);
	self.draggable({
		clickEl : headerDiv,
		beforeDrag : options.beforeDrag
	});
	var bodyDiv = K('<div class="ke-dialog-body"></div>');
	div.append(bodyDiv);
	bodyDiv.append(body);
	var footerDiv = K('<div class="ke-dialog-footer"></div>');
	if (previewBtn || yesBtn || noBtn) {
		div.append(footerDiv);
	}
	_each([
		{ btn : previewBtn, name : 'preview' },
		{ btn : yesBtn, name : 'yes' },
		{ btn : noBtn, name : 'no' }
	], function() {
		if (this.btn) {
			var button = _button(this.btn);
			button.addClass('ke-dialog-' + this.name);
			footerDiv.append(button);
		}
	});
	if (height) {
		bodyDiv.height(_removeUnit(height) - headerDiv.height() - footerDiv.height());
	}
	var mask = _widget({
		x : 0,
		y : 0,
		z : 811212,
		cls : 'ke-dialog-mask',
		width : docWidth,
		height : docHeight
	});
	self.resetPos(div.width(), div.height());
	self.remove = function() {
		mask.remove();
		span.remove();
		K('input', div).remove();
		footerDiv.remove();
		bodyDiv.remove();
		headerDiv.remove();
		remove.call(self);
	};
	self.show = function() {
		mask.show();
		div.show();
	};
	self.hide = function() {
		mask.hide();
		div.hide();
	};
	return self;
}
K.button = _button;
K.dialog = _dialog;
function _tabs(options) {
	var self = _widget(options),
		remove = self.remove,
		afterSelect = options.afterSelect,
		div = self.div(),
		liList = [];
	div.addClass('ke-tabs')
		.bind('contextmenu,mousedown,mousemove', function(e) {
			e.preventDefault();
		});
	var ul = K('<ul class="ke-tabs-ul ke-clearfix"></ul>');
	div.append(ul);
	self.add = function(tab) {
		var li = K('<li class="ke-tabs-li">' + tab.title + '</li>');
		li.data('tab', tab);
		liList.push(li);
		ul.append(li);
	};
	self.selectedIndex = 0;
	self.select = function(index) {
		self.selectedIndex = index;
		_each(liList, function(i, li) {
			li.unbind();
			if (i === index) {
				li.addClass('ke-tabs-li-selected');
				K(li.data('tab').panel).show('');
			} else {
				li.removeClass('ke-tabs-li-selected').removeClass('ke-tabs-li-on')
				.mouseover(function() {
					K(this).addClass('ke-tabs-li-on');
				})
				.mouseout(function() {
					K(this).removeClass('ke-tabs-li-on');
				})
				.click(function() {
					self.select(i);
				});
				K(li.data('tab').panel).hide();
			}
		});
		if (afterSelect) {
			afterSelect.call(self, index);
		}
	};
	self.remove = function() {
		_each(liList, function() {
			this.remove();
		});
		ul.remove();
		remove.call(self);
	};
	return self;
}
K.tabs = _tabs;
function _getScript(url, fn) {
	var head = document.getElementsByTagName('head')[0] || document.documentElement,
	script = document.createElement('script');
	head.appendChild(script);
	script.src = url;
	script.charset = 'utf-8';
	script.onload = script.onreadystatechange = function() {
		if (!this.readyState || this.readyState === 'loaded') {
			if (fn) {
				fn();
			}
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
		}
	};
}
function _ajax(url, fn, method, data) {
	method = method || 'GET';
	var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open(method, url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (fn) {
				data = _json(_trim(xhr.responseText));
				fn(data);
			}
		}
	};
	if (method == 'POST') {
		var params = [];
		_each(data, function(key, val) {
			params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
		});
		try {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		} catch (e) {}
		xhr.send(params.join('&'));
	} else {
		xhr.send(null);
	}
}
K.getScript = _getScript;
K.ajax = _ajax;
var _plugins = {};
function _plugin(name, fn) {
	_plugins[name] = fn;
}
var _language = {};
function _parseLangKey(key) {
	var match, ns = 'core';
	if ((match = /^(\w+)\.(\w+)$/.exec(key))) {
		ns = match[1];
		key = match[2];
	}
	return { ns : ns, key : key };
}
function _lang(mixed, langType) {
	langType = langType === undefined ? _options.langType : langType;
	if (typeof mixed === 'string') {
		if (!_language[langType]) {
			return 'no language';
		}
		var pos = mixed.length - 1;
		if (mixed.substr(pos) === '.') {
			return _language[langType][mixed.substr(0, pos)];
		}
		var obj = _parseLangKey(mixed);
		return _language[langType][obj.ns][obj.key];
	}
	_each(mixed, function(key, val) {
		var obj = _parseLangKey(key);
		if (!_language[langType]) {
			_language[langType] = {};
		}
		if (!_language[langType][obj.ns]) {
			_language[langType][obj.ns] = {};
		}
		_language[langType][obj.ns][obj.key] = val;
	});
}
function _bindContextmenuEvent() {
	var self = this, doc = self.edit.doc;
	K(doc).contextmenu(function(e) {
		if (self.menu) {
			self.hideMenu();
		}
		if (self._contextmenus.length === 0) {
			return;
		}
		var maxWidth = 0, items = [];
		_each(self._contextmenus, function() {
			if (this.title == '-') {
				items.push(this);
				return;
			}
			if (this.cond && this.cond()) {
				items.push(this);
				if (this.width && this.width > maxWidth) {
					maxWidth = this.width;
				}
			}
		});
		while (items.length > 0 && items[0].title == '-') {
			items.shift();
		}
		while (items.length > 0 && items[items.length - 1].title == '-') {
			items.pop();
		}
		var prevItem = null;
		_each(items, function(i) {
			if (this.title == '-' && prevItem.title == '-') {
				delete items[i];
			}
			prevItem = this;
		});
		if (items.length > 0) {
			var pos = K(self.edit.iframe).pos();
			self.menu = _menu({
				x : pos.x + e.clientX,
				y : pos.y + e.clientY,
				width : maxWidth
			});
			_each(items, function() {
				if (this.title) {
					self.menu.addItem(this);
				}
			});
			e.stop();
		}
	});
}
function _addBookmarkToStack(stack, bookmark) {
	if (stack.length === 0) {
		stack.push(bookmark);
		return;
	}
	var prev = stack[stack.length - 1];
	if (bookmark.html !== prev.html) {
		stack.push(bookmark);
	}
}
function KEditor(options) {
	var self = this;
	self.config = {};
	function setOption(key, val) {
		self[key] = val;
		self.config[key] = val;
	}
	_each(options, function(key, val) {
		setOption(key, options[key]);
		if (key === 'scriptPath') {
			setOption('themesPath', options[key] + 'themes/');
			setOption('langPath', options[key] + 'lang/');
			setOption('pluginsPath', options[key] + 'plugins/');
		}
	});
	_each(_options, function(key, val) {
		if (self[key] === undefined) {
			setOption(key, val);
		}
	});
	var se = K(self.srcElement);
	if (!self.width) {
		setOption('width', se.width() || self.minWidth);
	}
	if (!self.height) {
		setOption('height', se.height() || self.minHeight);
	}
	setOption('width', _addUnit(self.width));
	setOption('height', _addUnit(self.height));
	self.srcElement = se;
	self._handlers = {};
	self._contextmenus = [];
	self._undoStack = [];
	self._redoStack = [];
	_each(_plugins, function(name, fn) {
		fn.call(self, KindEditor);
	});
	var tempNames = self.preloadPlugins.slice(0);
	function load() {
		if (tempNames.length > 0) {
			var name = tempNames.shift();
			if (!_plugins[name]) {
				self.loadPlugin(name, load);
			}
		}
	}
	load();
}
KEditor.prototype = {
	lang : function(mixed) {
		return _lang(mixed, this.langType);
	},
	loadPlugin : function(name, fn) {
		var self = this;
		if (_plugins[name]) {
			_plugins[name].call(self, KindEditor);
			if (fn) {
				fn.call(self);
			}
			return self;
		}
		_getScript(self.pluginsPath + name + '/' + name + '.js', function() {
			if (_plugins[name]) {
				_plugins[name].call(self, KindEditor);
				if (fn) {
					fn.call(self);
				}
			}
		});
		return self;
	},
	handler : function(key, fn) {
		var self = this;
		if (!self._handlers[key]) {
			self._handlers[key] = [];
		}
		if (fn === undefined) {
			_each(self._handlers[key], function() {
				this.call(self);
			});
			return self;
		}
		self._handlers[key].push(fn);
		return self;
	},
	clickToolbar : function(name, fn) {
		var self = this, key = 'clickToolbar' + name;
		if (fn === undefined) {
			if (self._handlers[key]) {
				return self.handler(key);
			}
			self.loadPlugin(name, function() {
				self.handler(key);
			});
			return self;
		}
		return self.handler(key, fn);
	},
	addContextmenu : function(item) {
		this._contextmenus.push(item);
	},
	afterCreate : function(fn) {
		return this.handler('afterCreate', fn);
	},
	beforeHideMenu : function(fn) {
		return this.handler('beforeHideMenu', fn);
	},
	beforeHideDialog : function(fn) {
		return this.handler('beforeHideDialog', fn);
	},
	create : function() {
		var self = this,
			fullscreenMode = self.fullscreenMode;
		if (fullscreenMode) {
			_docElement().style.overflow = 'hidden';
		} else {
			_docElement().style.overflow = 'auto';
		}
		var width = fullscreenMode ? _docWidth() + 'px' : self.width,
			height = fullscreenMode ? _docHeight() + 'px' : self.height,
			container = K('<div class="ke-container"></div>').css('width', width);
		if (fullscreenMode) {
			var pos = _getScrollPos();
			container.css({
				position : 'absolute',
				left : _addUnit(pos.x),
				top : _addUnit(pos.y),
				'z-index' : 811211
			});
			K(document.body).append(container);
		} else {
			self.srcElement.before(container);
		}
		var toolbar = _toolbar({
				parent : container,
				noDisableItems : self.noDisableItems
			});
		_each(self.items, function(i, name) {
			toolbar.addItem({
				name : name,
				title : self.lang(name),
				click : function(e) {
					if (self.menu) {
						var menuName = self.menu.name;
						self.hideMenu();
						if (menuName === name) {
							return;
						}
					}
					self.clickToolbar(name);
					e.stop();
				}
			});
		});
		if (!self.designMode) {
			toolbar.disable(true);
		}
		var edit = _edit({
			parent : container,
			srcElement : self.srcElement,
			designMode : self.designMode,
			themesPath : self.themesPath,
			bodyClass : self.bodyClass,
			cssPath : self.cssPath,
			cssData : self.cssData,
			afterCreate : function() {
				var statusbar = K('<div class="ke-statusbar"></div>'), rightIcon;
				container.append(statusbar);
				if (!fullscreenMode) {
					rightIcon = K('<span class="ke-inline-block ke-statusbar-right-icon"></span>');
					statusbar.append('<span class="ke-inline-block ke-statusbar-center-icon"></span>');
					statusbar.append(rightIcon);
					_drag({
						moveEl : container,
						clickEl : statusbar,
						moveFn : function(x, y, width, height, diffX, diffY) {
							height += diffY;
							if (height >= self.minHeight) {
								self.resize(null, height);
								self.height = _addUnit(height);
							}
						}
					});
					_drag({
						moveEl : container,
						clickEl : rightIcon,
						moveFn : function(x, y, width, height, diffX, diffY) {
							width += diffX;
							height += diffY;
							if (width >= self.minWidth) {
								self.resize(width, null);
								self.width = _addUnit(width);
							}
							if (height >= self.minHeight) {
								self.resize(null, height);
								self.height = _addUnit(height);
							}
						}
					});
				}
				if (self._resizeListener) {
					K(window).unbind('resize', self._resizeListener);
					self._resizeListener = null;
				}
				function resizeListener(e) {
					if (self.container) {
						self.resize(_docElement().clientWidth, _docElement().clientHeight);
					}
				}
				if (self.fullscreenMode) {
					K(window).bind('resize', resizeListener);
					self._resizeListener = resizeListener;
				}
				self.container = container;
				self.toolbar = toolbar;
				self.edit = this;
				self.cmd = this.cmd;
				self.statusbar = statusbar;
				self.menu = self.contextmenu = self.dialog = null;
				self._rightIcon = rightIcon;
				self.resize(width, height);
				K(this.doc, document).click(function(e) {
					if (self.menu) {
						self.hideMenu();
					}
				});
				_bindContextmenuEvent.call(self);
				/*
				var pasted = false;
				K(this.doc.body).bind('paste', function(e){
					if (pasted) return false;
					pasted = true;
					var n= K('<div id="_mcePaste">tesw</div>', self.edit.doc);
					K(self.edit.doc.body).append(n);
					var rng = self.edit.doc.body.createTextRange();
					rng.moveToElementText(n[0]);
					rng.execCommand('paste');
					setTimeout(function() {
						var data = K("#_mcePaste", self.edit.doc);
						self.cmd.range.insertNode(data[0]);
					}, 0);
					e.stop();
					return false;
				});
				*/
				self.addBookmark();
				this.cmd.oninput(function(e) {
					self.addBookmark();
				});
				self.afterCreate();
			}
		});
		return self;
	},
	remove : function() {
		var self = this;
		if (self.menu) {
			self.hideMenu();
		}
		if (self.dialog) {
			self.hideDialog();
		}
		self.toolbar.remove();
		self.edit.remove();
		if (self._rightIcon) {
			self._rightIcon.remove();
		}
		self.statusbar.remove();
		self.container.remove();
		self.container = self.toolbar = self.edit = self.menu = self.dialog = null;
		return self;
	},
	resize : function(width, height) {
		var self = this;
		if (width !== null) {
			self.container.css('width', _addUnit(width));
		}
		if (height !== null) {
			height = _removeUnit(height) - self.toolbar.div().height() - self.statusbar.height();
			if (height > 0) {
				self.edit.height(height);
			}
		}
		return self;
	},
	select : function() {
		this.cmd.select();
		return this;
	},
	html : function(val) {
		if (val === undefined) {
			return this.edit.html();
		}
		this.edit.html(val);
		return this;
	},
	val : function(key) {
		return this.cmd.val(key);
	},
	state : function(key) {
		return this.cmd.state(key);
	},
	exec : function(key) {
		var self = this, cmd = self.cmd;
		cmd[key].apply(cmd, _toArray(arguments, 1));
		self.addBookmark();
		return self;
	},
	insertHtml : function(val) {
		return this.exec('inserthtml', val);
	},
	focus : function() {
		this.edit.focus();
		return this;
	},
	addBookmark : function() {
		var self = this, doc = self.edit.doc, body = K(doc.body), range = self.cmd.range;
		var bookmark = range.getBookmark();
		bookmark.html = body.html();
		if (self._undoStack.length > 0) {
			var prev = self._undoStack[self._undoStack.length - 1];
			if (Math.abs(bookmark.html.length -  prev.html.length) < self.minChangeLength) {
				return self;
			}
		}
		_addBookmarkToStack(self._undoStack, bookmark);
		return self;
	},
	undo : function() {
		var self = this, doc = self.edit.doc, body = K(doc.body), range = self.cmd.range;
		if (self._undoStack.length === 0) {
			return self;
		}
		var bookmark = range.getBookmark();
		bookmark.html = body.html();
		_addBookmarkToStack(self._redoStack, bookmark);
		var prev = self._undoStack.pop();
		if (bookmark.html === prev.html && self._undoStack.length > 0) {
			prev = self._undoStack.pop();
		}
		body.html(prev.html);
		range.moveToBookmark(prev);
		return self.select();
	},
	redo : function() {
		var self = this, doc = self.edit.doc, body = K(doc.body), range = self.cmd.range;
		if (self._redoStack.length === 0) {
			return self;
		}
		var bookmark = range.getBookmark();
		bookmark.html = body.html();
		_addBookmarkToStack(self._undoStack, bookmark);
		var next = self._redoStack.pop();
		body.html(next.html);
		range.moveToBookmark(next);
		return self.select();
	},
	fullscreen : function(bool) {
		var self = this;
		self.fullscreenMode = (bool === undefined ? !self.fullscreenMode : bool);
		self.remove();
		return self.create();
	},
	createMenu : function(options) {
		var self = this,
			name = options.name,
			knode = self.toolbar.get(name),
			pos = knode.pos();
		options.x = pos.x;
		options.y = pos.y + knode.height();
		if (options.selectedColor !== undefined) {
			options.noColor = self.lang('noColor');
			self.menu = _colorpicker(options);
		} else {
			options.centerLineMode = false;
			self.menu = _menu(options);
		}
		return self.menu;
	},
	hideMenu : function() {
		this.beforeHideMenu();
		this.menu.remove();
		this.menu = null;
		return this;
	},
	hideContextmenu : function() {
		this.contextmenu.remove();
		this.contextmenu = null;
		return this;
	},
	createDialog : function(options) {
		var self = this,
			name = options.name;
		options.shadowMode = self.shadowMode;
		options.closeBtn = {
			name : self.lang('close'),
			click : function(e) {
				self.hideDialog();
				self.focus();
			}
		};
		options.noBtn = {
			name : self.lang('no'),
			click : function(e) {
				self.hideDialog();
				self.focus();
			}
		};
		return (self.dialog = _dialog(options));
	},
	hideDialog : function() {
		var self = this;
		self.beforeHideDialog();
		self.dialog.remove();
		self.dialog = null;
		self.cmd.select();
		return self;
	}
};
function _create(expr, options) {
	if (!options) {
		options = {};
	}
	var knode = K(expr);
	if (knode) {
		options.srcElement = knode[0];
		if (!options.width) {
			options.width = knode.width();
		}
		if (!options.height) {
			options.height = knode.height();
		}
		return new KEditor(options).create();
	}
}
if (_IE && _V < 7) {
	_nativeCommand(document, 'BackgroundImageCache', true);
}
K.create = _create;
K.plugin = _plugin;
K.lang = _lang;
})(window);
KindEditor.plugin('core', function(K) {
	var self = this;
	self.clickToolbar('source', function() {
		self.toolbar.disable();
		self.edit.design();
	});
	self.clickToolbar('fullscreen', function() {
		self.fullscreen();
	});
	self.clickToolbar('undo', function() {
		self.undo();
	});
	self.clickToolbar('redo', function() {
		self.redo();
	});
	self.clickToolbar('formatblock', function() {
		var blocks = self.lang('formatblock.formatBlock'),
			heights = {
				h1 : 28,
				h2 : 24,
				h3 : 18,
				H4 : 14,
				p : 12
			},
			curVal = self.val('formatblock'),
			menu = self.createMenu({
				name : 'formatblock',
				width : self.langType == 'en' ? 200 : 150
			});
		K.each(blocks, function(key, val) {
			var style = 'font-size:' + heights[key] + 'px;';
			if (key.charAt(0) === 'h') {
				style += 'font-weight:bold;';
			}
			menu.addItem({
				title : '<span style="' + style + '">' + val + '</span>',
				height : heights[key] + 12,
				checked : (curVal === key || curVal === val),
				click : function() {
					self.select().exec('formatblock', '<' + key.toUpperCase() + '>').hideMenu();
				}
			});
		});
	});
	self.clickToolbar('fontname', function() {
		var curVal = self.val('fontname'),
			menu = self.createMenu({
				name : 'fontname',
				width : 150
			});
		K.each(self.lang('fontname.fontName'), function(key, val) {
			menu.addItem({
				title : '<span style="font-family: ' + key + ';">' + val + '</span>',
				checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
				click : function() {
					self.exec('fontname', key).hideMenu();
				}
			});
		});
	});
	self.clickToolbar('fontsize', function() {
		var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
			curVal = self.val('fontsize');
			menu = self.createMenu({
				name : 'fontsize',
				width : 150
			});
		K.each(fontSize, function(i, val) {
			menu.addItem({
				title : '<span style="font-size:' + val + ';">' + val + '</span>',
				height : K.removeUnit(val) + 12,
				checked : curVal === val,
				click : function() {
					self.exec('fontsize', val).hideMenu();
				}
			});
		});
	});
	K.each('forecolor,hilitecolor'.split(','), function(i, name) {
		self.clickToolbar(name, function() {
			self.createMenu({
				name : name,
				selectedColor : self.val(name) || 'default',
				click : function(color) {
					self.exec(name, color).hideMenu();
				}
			});
		});
	});
	K.each(('cut,copy,paste').split(','), function(i, name) {
		self.clickToolbar(name, function() {
			self.focus();
			try {
				self.exec(name, null);
			} catch(e) {
				alert(self.lang(name + 'Error'));
			}
		});
	});
	self.clickToolbar('about', function() {
		var html = '<div style="margin:20px;">' +
			'<div>KindEditor ' + K.VERSION + '</div>' +
			'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
			'</div>';
		self.createDialog({
			name : 'about',
			width : 300,
			title : self.lang('about'),
			body : html
		});
	});
	K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
		'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
		'bold,italic,underline,strikethrough,removeformat,unlink').split(','), function(i, name) {
		if (self.shortcutKeys[name]) {
			self.afterCreate(function() {
				K.ctrl(this.edit.doc, self.shortcutKeys[name], function() {
					self.clickToolbar(name);
				});
			});
		}
		self.clickToolbar(name, function() {
			self.focus().exec(name, null);
		});
	});
});
KindEditor.lang({
	source : 'HTML代码',
	undo : '后退(Ctrl+Z)',
	redo : '前进(Ctrl+Y)',
	cut : '剪切(Ctrl+X)',
	copy : '复制(Ctrl+C)',
	paste : '粘贴(Ctrl+V)',
	plainpaste : '粘贴为无格式文本',
	wordpaste : '从Word粘贴',
	selectall : '全选(Ctrl+A)',
	justifyleft : '左对齐',
	justifycenter : '居中',
	justifyright : '右对齐',
	justifyfull : '两端对齐',
	insertorderedlist : '编号',
	insertunorderedlist : '项目符号',
	indent : '增加缩进',
	outdent : '减少缩进',
	subscript : '下标',
	superscript : '上标',
	formatblock : '段落',
	fontname : '字体',
	fontsize : '文字大小',
	forecolor : '文字颜色',
	hilitecolor : '文字背景',
	bold : '粗体(Ctrl+B)',
	italic : '斜体(Ctrl+I)',
	underline : '下划线(Ctrl+U)',
	strikethrough : '删除线',
	removeformat : '删除格式',
	image : '图片',
	flash : 'Flash',
	media : '视音频',
	table : '表格',
	hr : '插入横线',
	emoticons : '插入表情',
	link : '超级链接',
	unlink : '取消超级链接',
	fullscreen : '全屏显示',
	about : '关于',
	print : '打印(Ctrl+P)',
	filemanager : '浏览服务器',
	yes : '确定',
	no : '取消',
	close : '关闭',
	editImage : '图片属性',
	deleteImage : '删除图片',
	editMedia : '视音频属性',
	deleteMedia : '删除视音频',
	editLink : '超级链接属性',
	deleteLink : '取消超级链接',
	tableprop : '表格属性',
	tableinsert : '插入表格',
	tabledelete : '删除表格',
	tablecolinsertleft : '左侧插入列',
	tablecolinsertright : '右侧插入列',
	tablerowinsertabove : '上方插入行',
	tablerowinsertbelow : '下方插入行',
	tablecoldelete : '删除列',
	tablerowdelete : '删除行',
	noColor : '无颜色',
	invalidImg : "请输入有效的URL地址。\n只允许jpg,gif,bmp,png格式。",
	invalidMedia : "请输入有效的URL地址。\n只允许swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb格式。",
	invalidWidth : "宽度必须为数字。",
	invalidHeight : "高度必须为数字。",
	invalidBorder : "边框必须为数字。",
	invalidUrl : "请输入有效的URL地址。",
	invalidRows : '行数为必选项，只允许输入大于0的数字。',
	invalidCols : '列数为必选项，只允许输入大于0的数字。',
	invalidPadding : '边距必须为数字。',
	invalidSpacing : '间距必须为数字。',
	invalidJson : '服务器发生故障。',
	cutError : '您的浏览器安全设置不允许使用剪切操作，请使用快捷键(Ctrl+X)来完成。',
	copyError : '您的浏览器安全设置不允许使用复制操作，请使用快捷键(Ctrl+C)来完成。',
	pasteError : '您的浏览器安全设置不允许使用粘贴操作，请使用快捷键(Ctrl+V)来完成。',
	'plainpaste.comment' : '请使用快捷键(Ctrl+V)把内容粘贴到下面的方框里。',
	'wordpaste.comment' : '请使用快捷键(Ctrl+V)把内容粘贴到下面的方框里。',
	'link.url' : 'URL地址',
	'link.linkType' : '打开类型',
	'link.newWindow' : '新窗口',
	'link.selfWindow' : '当前窗口',
	'flash.url' : 'Flash地址',
	'flash.width' : '宽度',
	'flash.height' : '高度',
	'media.url' : '媒体文件地址',
	'media.width' : '宽度',
	'media.height' : '高度',
	'media.autostart' : '自动播放',
	'image.remoteImage' : '远程图片',
	'image.localImage' : '本地上传',
	'image.remoteUrl' : '图片地址',
	'image.localUrl' : '图片地址',
	'image.size' : '图片大小',
	'image.width' : '宽',
	'image.height' : '高',
	'image.resetSize' : '重置大小',
	'image.align' : '对齐方式',
	'image.defaultAlign' : '默认方式',
	'image.leftAlign' : '左对齐',
	'image.rightAlign' : '右对齐',
	'image.imgTitle' : '图片说明',
	'image.viewServer' : '浏览...',
	'filemanager.emptyFolder' : '空文件夹',
	'filemanager.moveup' : '移到上一级文件夹',
	'filemanager.viewType' : '显示方式：',
	'filemanager.viewImage' : '缩略图',
	'filemanager.listImage' : '详细信息',
	'filemanager.orderType' : '排序方式：',
	'filemanager.fileName' : '名称',
	'filemanager.fileSize' : '大小',
	'filemanager.fileType' : '类型',
	'table.cells' : '单元格数',
	'table.rows' : '行数',
	'table.cols' : '列数',
	'table.size' : '大小',
	'table.width' : '宽度',
	'table.height' : '高度',
	'table.percent' : '%',
	'table.px' : 'px',
	'table.space' : '边距间距',
	'table.padding' : '边距',
	'table.spacing' : '间距',
	'table.align' : '对齐方式',
	'table.alignDefault' : '默认',
	'table.alignLeft' : '左对齐',
	'table.alignCenter' : '居中',
	'table.alignRight' : '右对齐',
	'table.border' : '边框',
	'table.borderWidth' : '边框',
	'table.borderColor' : '颜色',
	'table.backgroundColor' : '背景颜色',
	'formatblock.formatBlock' : {
		h1 : '标题 1',
		h2 : '标题 2',
		h3 : '标题 3',
		h4 : '标题 4',
		p : '正 文'
	},
	'fontname.fontName' : {
		'SimSun' : '宋体',
		'NSimSun' : '新宋体',
		'FangSong_GB2312' : '仿宋_GB2312',
		'KaiTi_GB2312' : '楷体_GB2312',
		'SimHei' : '黑体',
		'Microsoft YaHei' : '微软雅黑',
		'Arial' : 'Arial',
		'Arial Black' : 'Arial Black',
		'Times New Roman' : 'Times New Roman',
		'Courier New' : 'Courier New',
		'Tahoma' : 'Tahoma',
		'Verdana' : 'Verdana'
	}
}, 'zh_CN');
