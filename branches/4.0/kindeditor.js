/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2010 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http://www.kindsoft.net/
* @licence LGPL(http://www.kindsoft.net/lgpl_license.html)
* @version 4.0 (2010-07-24)
*******************************************************************************/
(function (window, undefined) {
var _kindeditor = '4.0 (2010-07-24)',
	_ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_VERSION = _matches ? _matches[1] : '0';
function _isArray(val) {
	return val && Object.prototype.toString.call(val) === '[object Array]';
}
function _isFunction(val) {
	return val && Object.prototype.toString.call(val) === '[object Function]';
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
	return str.replace(/^\s+|\s+$/g, '');
}
function _inString(val, str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	return (delimiter + str + delimiter).indexOf(delimiter + val + delimiter) >= 0;
}
function _addUnit(val) {
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
function _toHex(color) {
	function hex(d) {
		var s = parseInt(d, 10).toString(16).toUpperCase();
		return s.length > 1 ? s : '0' + s;
	}
	return color.replace(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/ig,
		function($0, $1, $2, $3) {
			return '#' + hex($1) + hex($2) + hex($3);
		}
	);
}
function _toMap(str, delimiter) {
	delimiter = delimiter === undefined ? ',' : delimiter;
	var map = {}, arr = str.split(delimiter), match;
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
function _toArray(obj) {
	return Array.prototype.slice.call(obj, 0);
}
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
var _round = Math.round;
var K = {
	kindeditor : _kindeditor,
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
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
	toArray : _toArray
};
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
	cssData : '',
	minWidth : 600,
	minHeight : 100,
	minChangeSize : 5,
	items : [
		'source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', '|', 'selectall', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
		'flash', 'media', 'table', 'hr', 'emoticons', 'link', 'unlink', '|', 'about'
	],
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
var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	_VALUE_TAG_MAP = _toMap('input,button,textarea,select');
function _bindEvent(el, type, fn) {
	if (el.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent){
		el.attachEvent('on' + type, fn);
	}
}
function _unbindEvent(el, type, fn) {
	if (el.removeEventListener){
		el.removeEventListener(type, fn, false);
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
var _elList = [], _data = {};
function _getId(el) {
	var id = _inArray(el, _elList);
	if (id < 0) {
		_each(_elList, function(i, val) {
			if (!val) {
				id = i;
				_elList[id] = el;
				return false;
			}
		});
		if (id < 0) {
			id = _elList.length;
			_elList.push(el);
		}
	}
	if (!(id in _data)) {
		_data[id] = {};
	}
	return id;
}
function _bind(el, type, fn) {
	if (type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_bind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (id in _data && _data[id][type] !== undefined && _data[id][type].length > 0) {
		_each(_data[id][type], function(key, val) {
			if (val === undefined) {
				_data[id][type].splice(key, 1);
			}
		});
		_unbindEvent(el, type, _data[id][type][0]);
	} else {
		_data[id][type] = [];
	}
	if (_data[id][type].length === 0) {
		_data[id][type][0] = function(e) {
			_each(_data[id][type], function(key, val) {
				if (key > 0 && val) {
					val.call(el, _event(el, e));
				}
			});
		};
	}
	if (_inArray(fn, _data[id][type]) < 0) {
		_data[id][type].push(fn);
	}
	_bindEvent(el, type, _data[id][type][0]);
}
function _unbind(el, type, fn) {
	if (type && type.indexOf(',') >= 0) {
		_each(type.split(','), function() {
			_unbind(el, this, fn);
		});
		return;
	}
	var id = _getId(el);
	if (type === undefined) {
		if (id in _data) {
			_each(_data[id], function(key, val) {
				if (val.length > 0) {
					_unbindEvent(el, key, val[0]);
				}
			});
			delete _data[id];
			delete _elList[id];
		}
		return;
	}
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, _data[id][type][0]);
			delete _data[id][type];
		} else {
			for (var i = 1, len = _data[id][type].length; i < len; i++) {
				if (_data[id][type][i] === fn) {
					delete _data[id][type][i];
				}
			}
			if (_data[id][type].length == 2 && _data[id][type][1] === undefined) {
				_unbindEvent(el, type, _data[id][type][0]);
				delete _data[id][type];
			}
			var typeCount = 0;
			_each(_data[id], function() {
				typeCount++;
			});
			if (typeCount < 1) {
				delete _data[id];
				delete _elList[id];
			}
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
	if (id in _data && _data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
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
function _ready(fn, doc) {
	doc = doc || document;
	var win = doc.parentWindow || doc.defaultView, loaded = false;
	function readyFunc() {
		if (!loaded) {
			loaded = true;
			fn(KindEditor);
		}
		_unbind(doc, 'DOMContentLoaded');
		_unbind(doc, 'readystatechange');
		_unbind(win, 'load');
	}
	function ieReadyFunc() {
		if (!loaded) {
			try {
				doc.documentElement.doScroll('left');
			} catch(e) {
				win.setTimeout(ieReadyFunc, 0);
				return;
			}
			readyFunc();
		}
	}
	if (doc.addEventListener) {
		_bind(doc, 'DOMContentLoaded', readyFunc);
	} else if (doc.attachEvent) {
		_bind(doc, 'readystatechange', function() {
			if (doc.readyState === 'complete') {
				readyFunc();
			}
		});
		if (doc.documentElement.doScroll && win.frameElement === undefined) {
			ieReadyFunc();
		}
	}
	_bind(win, 'load', readyFunc);
}
if (_IE) {
	window.attachEvent('onunload', function() {
		var id, target;
		_each(_elList, function(i, el) {
			if (el) {
				_unbind(el);
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
function _formatHtml(html) {
	var re = /((?:[\r\n])*)<(\/)?([\w-:]+)(\s*(?:[\w-:]+)(?:=(?:"[^"]*"|'[^']*'|[^\s"'<>]*))?)*\s*(\/)?>((?:[\r\n])*)/g;
	html = (html + '').replace(re, function($0, $1, $2, $3, $4, $5, $6) {
		var startNewline = $1 || '',
			startSlash = $2 || '',
			tagName = $3.toLowerCase(),
			attr = $4 || '',
			endSlash = $5 ? ' ' + $5 : '',
			endNewline = $6 || '';
		if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
			endSlash = ' /';
		}
		if (endNewline) {
			endNewline = '';
		}
		if (tagName !== 'script' && tagName !== 'style') {
			startNewline = '';
		}
		if (attr !== '') {
			attr = attr.replace(/\s*([\w-:]+)=([^\s"'<>]+|"[^"]*"|'[^']*')/g, function($0, $1, $2) {
				var key = $1.toLowerCase(),
					val = $2 || '';
				if (val === '') {
					val = '""';
				} else {
					if (key === 'style') {
						val = val.substr(1, val.length - 2);
						val = _formatCss(val);
						if (val === '') {
							return '';
						}
						val = '"' + val + '"';
					}
					if (!/^['"]/.test(val)) {
						val = '"' + val + '"';
					}
				}
				return ' ' + key + '=' + val + ' ';
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
	return _trim(html);
}
K.formatHtml = _formatHtml;
function _contains(nodeA, nodeB) {
	while ((nodeB = nodeB.parentNode)) {
		if (nodeB === nodeA) {
			return true;
		}
	}
	return false;
}
function _getAttr(el, key) {
	key = key.toLowerCase();
	var val = null;
	if (_IE && _VERSION < 8) {
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
		var arr = [], els = root.getElementsByName(stripslashes(name)), el;
		for (var i = 0, len = els.length; i < len; i++) {
			el = els[i];
			if (cmpTag(tag, el.nodeName)) {
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
	return val.get ? val.get() : val;
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
	if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
		key = 'className';
	}
	el.setAttribute(key, '' + val);
}
function _removeAttr(el, key) {
	if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
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
function _getScrollPos() {
	var x, y;
	if (_IE || _OPERA) {
		var docEl = document.documentElement;
		x = docEl.scrollLeft;
		y = docEl.scrollTop;
	} else {
		x = window.scrollX;
		y = window.scrollY;
	}
	return {x : x, y : y};
}
function KNode(node) {
	var self = this;
	_each(node, function(i) {
		self[i] = this;
	});
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
			_setHtml(this, _formatHtml(val));
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
			return self[0].style[key] || _computedCss(self[0], key) || '';
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
	append : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		self[0].appendChild(_get(val));
		return self;
	},
	before : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		self[0].parentNode.insertBefore(_get(val), self[0]);
		return self;
	},
	after : function(val) {
		var self = this;
		if (self.length < 1) {
			return self;
		}
		if (self[0].nextSibling) {
			self[0].parentNode.insertBefore(_get(val), self[0].nextSibling);
		} else {
			self[0].appendChild(_get(val));
		}
		return self;
	},
	replaceWith : function(val) {
		var self = this, node = _get(val);
		if (self.length < 1) {
			return self;
		}
		_unbind(self[0]);
		self[0].parentNode.replaceChild(node, self[0]);
		self[0] = node;
		return self;
	},
	remove : function() {
		var self = this;
		self.each(function(i, node) {
			_unbind(node);
			if (node.hasChildNodes()) {
				node.innerHTML = '';
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
				if (fn(new KNode([n])) === false) {
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
	'change,select,submit,keydown,keypress,keyup,error').split(','), function(i, type) {
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
		if (/<.+>/.test(expr)) {
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
var _START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;
function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}
function _updateCommonAncestor() {
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
	this.commonAncestorContainer = parentsA[lenA - i + 1];
}
function _copyAndDelete(isCopy, isDelete) {
	var self = this, doc = self.doc,
		sc = self.startContainer, so = self.startOffset,
		ec = self.endContainer, eo = self.endOffset,
		nodeList = [], selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		if (sc.nodeType == 3 && so === 0) {
			self.setStart(sc.parentNode, 0);
		}
		self.collapse(true);
	}
	function splitTextNode(node, startOffset, endOffset) {
		var length = node.nodeValue.length, centerNode;
		if (isCopy) {
			var cloneNode = node.cloneNode(true);
			centerNode = cloneNode.splitText(startOffset);
			centerNode.splitText(endOffset - startOffset);
		}
		if (isDelete) {
			var center = node;
			if (startOffset > 0) {
				center = node.splitText(startOffset);
			}
			if (endOffset < length) {
				center.splitText(endOffset - startOffset);
			}
			nodeList.push(center);
		}
		return centerNode;
	}
	function extractNodes(parent, frag) {
		var textNode;
		if (parent.nodeType == 3) {
			textNode = splitTextNode(parent, so, eo);
			if (isCopy) {
				frag.appendChild(textNode);
			}
			return false;
		}
		var node = parent.firstChild, testRange, nextNode;
		while (node) {
			testRange = new KRange(doc);
			testRange.selectNode(node);
			if (testRange.compareBoundaryPoints(_END_TO_START, selfRange) >= 0) {
				return false;
			}
			nextNode = node.nextSibling;
			if (testRange.compareBoundaryPoints(_START_TO_END, selfRange) > 0) {
				if (node.nodeType == 1) {
					if (testRange.compareBoundaryPoints(_START_TO_START, selfRange) >= 0 && testRange.compareBoundaryPoints(_END_TO_END, selfRange) <= 0) {
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
					if (node == sc && node == ec) {
						textNode = splitTextNode(node, so, eo);
					} else if (node == sc) {
						textNode = splitTextNode(node, so, node.nodeValue.length);
					} else if (node == ec) {
						textNode = splitTextNode(node, 0, eo);
					} else {
						textNode = splitTextNode(node, 0, node.nodeValue.length);
					}
					if (isCopy) {
						frag.appendChild(textNode);
					}
				}
			}
			node = nextNode;
		}
	}
	var frag = doc.createDocumentFragment();
	extractNodes(selfRange.commonAncestorContainer, frag);
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}
	return isCopy ? frag : self;
}
function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument,
		pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement(),
		children = parent.childNodes;
	if (children.length === 0) {
		return {node: parent.parentNode, offset: K(parent).index()};
	}
	var startNode = doc, startPos = 0, isEnd = false;
	var testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	for (var i = 0, len = children.length; i < len; i++) {
		var node = children[i];
		var cmp = testRange.compareEndPoints('StartToStart', pointRange);
		if (cmp > 0) {
			isEnd = true;
		}
		if (cmp === 0) {
			return {node: node.parentNode, offset: i};
		}
		if (node.nodeType == 1) {
			var nodeRange = rng.duplicate();
			nodeRange.moveToElementText(node);
			testRange.setEndPoint('StartToEnd', nodeRange);
			if (isEnd) {
				startPos += nodeRange.text.length;
			} else {
				startPos = 0;
			}
		} else if (node.nodeType == 3) {
			testRange.moveStart('character', node.nodeValue.length);
			startPos += node.nodeValue.length;
		}
		if (!isEnd) {
			startNode = node;
		}
	}
	if (!isEnd && startNode.nodeType == 1) {
		return {node: parent, offset: K(parent.lastChild).index() + 1};
	}
	testRange = rng.duplicate();
	testRange.moveToElementText(parent);
	testRange.setEndPoint('StartToEnd', pointRange);
	startPos -= testRange.text.length;
	return {node: startNode, offset: startPos};
}
function _toRange(rng) {
	var doc, range;
	if (_IE) {
		doc = rng.parentElement().ownerDocument;
		if (rng.item) {
			range = new KRange(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false);
		range = new KRange(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		range = new KRange(doc);
		range.setStart(startContainer, rng.startOffset);
		range.setEnd(rng.endContainer, rng.endOffset);
		return range;
	}
}
function _getBeforeLength(node) {
	var doc = node.ownerDocument,
		len = 0,
		sibling = node.previousSibling;
	while (sibling) {
		if (sibling.nodeType == 1) {
			if (!K(sibling).isSingle()) {
				var range = doc.body.createTextRange();
				range.moveToElementText(sibling);
				len += range.text.length;
			} else {
				len += 1;
			}
		} else if (sibling.nodeType == 3) {
			len += sibling.nodeValue.length;
		}
		sibling = sibling.previousSibling;
	}
	return len;
}
function _getEndRange(node, offset) {
	var doc = node.ownerDocument || node,
		range = doc.body.createTextRange();
	if (doc == node) {
		range.collapse(true);
		return range;
	}
	if (node.nodeType == 1) {
		var children = node.childNodes, isStart, child, isTemp = false, temp;
		if (offset === 0) {
			child = children[0];
			isStart = true;
		} else {
			child = children[offset - 1];
			isStart = false;
		}
		if (!child) {
			temp = doc.createTextNode(' ');
			node.appendChild(temp);
			child = temp;
			isTemp = true;
		}
		if (child.nodeName.toLowerCase() === 'head') {
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
			range.moveToElementText(child);
			range.collapse(isStart);
		} else {
			range.moveToElementText(node);
			if (isTemp) {
				node.removeChild(temp);
			}
			var len = _getBeforeLength(child);
			len = isStart ? len : len + child.nodeValue.length;
			range.moveStart('character', len);
		}
	} else if (node.nodeType == 3) {
		range.moveToElementText(node.parentNode);
		range.moveStart('character', offset + _getBeforeLength(node));
	}
	return range;
}
function KRange(doc) {
	var self = this;
	self.startContainer = doc;
	self.startOffset = 0;
	self.endContainer = doc;
	self.endOffset = 0;
	self.collapsed = true;
	self.commonAncestorContainer = doc;
	self.doc = doc;
}
KRange.prototype = {
	setStart : function(node, offset) {
		var self = this, doc = self.doc;
		self.startContainer = node;
		self.startOffset = offset;
		if (self.endContainer === doc) {
			self.endContainer = node;
			self.endOffset = offset;
		}
		_updateCollapsed.call(this);
		_updateCommonAncestor.call(this);
		return self;
	},
	setEnd : function(node, offset) {
		var self = this, doc = self.doc;
		self.endContainer = node;
		self.endOffset = offset;
		if (self.startContainer === doc) {
			self.startContainer = node;
			self.startOffset = offset;
		}
		_updateCollapsed.call(this);
		_updateCommonAncestor.call(this);
		return self;
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
			return this.setStartBefore(children[0].get()).setEndAfter(children[children.length - 1].get());
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
		if (!this.doc.createRange) {
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
		} else {
			return rangeA.compareBoundaryPoints(how, rangeB);
		}
	},
	cloneRange : function() {
		return new KRange(this.doc).setStart(this.startContainer, this.startOffset).setEnd(this.endContainer, this.endOffset);
	},
	toString : function() {
		var rng = this.get(),
			str = this.doc.createRange ? rng.toString() : rng.text;
		return str.replace(/\r\n|\n|\r/g, '');
	},
	cloneContents : function() {
		return _copyAndDelete.call(this, true, false);
	},
	deleteContents : function() {
		return _copyAndDelete.call(this, false, true);
	},
	extractContents : function() {
		return _copyAndDelete.call(this, true, true);
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
				c = sc.splitText(so);
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
	get : function() {
		var self = this, doc = self.doc, node,
			sc = self.startContainer, so = self.startOffset,
			ec = self.endContainer, eo = self.endOffset, rng;
		if (doc.createRange) {
			rng = doc.createRange();
			try {
				rng.setStart(sc, so);
				rng.setEnd(ec, eo);
			} catch (e) {}
		} else {
			rng = doc.body.createTextRange();
			rng.setEndPoint('StartToStart', _getEndRange(sc, so));
			rng.setEndPoint('EndToStart', _getEndRange(ec, eo));
		}
		return rng;
	},
	html : function() {
		return K(this.cloneContents()).outer();
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
	return win.getSelection ? win.getSelection() : doc.selection;
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
	if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
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
	var newMap = _singleKeyMap(map), arr, key, val, method;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				return true;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			method = match[1] ? 'css' : 'attr';
			key = match[2];
			val = match[3] || '';
			if (val === '' && knode[method](key) !== '') {
				return true;
			}
			if (val !== '' && knode[method](key) === val) {
				return true;
			}
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
	var newMap = _singleKeyMap(map), arr, key;
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		allFlag = false;
		for (var i = 0, len = arr.length; i < len; i++) {
			key = arr[i];
			if (key === '*') {
				allFlag = true;
				break;
			}
			var match = /^(\.?)([^=]+)(?:=([^=]+))?$/.exec(key);
			key = match[2];
			if (match[1]) {
				knode.css(key, '');
			} else {
				knode.removeAttr(key);
			}
		}
		if (allFlag) {
			if (knode.first()) {
				var kchild = knode.first();
				while (kchild) {
					var next = kchild.next();
					knode.before(kchild);
					kchild = next;
				}
			}
			knode.remove();
		}
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
	return _getInnerNode(knode).isInline();
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
		knode.before(wrapper);
		knode.remove();
		return wrapper;
	}
	var nodeWrapper = knode, child;
	while ((child = knode.first()) && child.children().length == 1) {
		knode = child;
	}
	var next, frag = knode.doc.createDocumentFragment();
	while ((child = knode.first())) {
		next = child.next();
		frag.appendChild(child.get());
		child = next;
	}
	wrapper = _mergeWrapper(nodeWrapper, wrapper);
	if (frag.firstChild) {
		_getInnerNode(wrapper).append(frag);
	}
	nodeWrapper.before(wrapper);
	nodeWrapper.remove();
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
function _getCommonNode(range, map) {
	var ec = range.endContainer, eo = range.endOffset,
		knode = K((ec.nodeType == 3 || eo === 0) ? ec : ec.childNodes[eo - 1]),
		child = knode;
	while (child && (child = child.firstChild) && child.childNodes.length == 1) {
		if (_hasAttrOrCss(child, map)) {
			return child;
		}
	}
	while (knode) {
		if (_hasAttrOrCss(knode, map)) {
			return knode;
		}
		knode = knode.parent();
	}
	return null;
}
function KCmd(range) {
	var self = this, doc = range.doc;
	self.doc = doc;
	self.win = _getWin(doc);
	self.sel = _getSel(doc);
	self.range = range;
	self._preformat = null;
	self._preremove = null;
}
KCmd.prototype = {
	select : function() {
		var self = this, sel = self.sel, range = self.range.cloneRange(),
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset,
			doc = sc.ownerDocument || sc, win = _getWin(doc), rng;
		if (_IE && sc.nodeType == 1 && range.collapsed) {
			var empty = K('<span>&nbsp;</span>', doc);
			range.insertNode(empty.get());
			rng = doc.body.createTextRange();
			rng.moveToElementText(empty.get());
			rng.collapse(false);
			rng.select();
			empty.remove();
			win.focus();
			return self;
		}
		rng = range.get();
		if (_IE) {
			rng.select();
		} else {
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		win.focus();
		return self;
	},
	wrap : function(val) {
		var self = this, doc = self.doc, range = self.range, wrapper,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (typeof val == 'string') {
			wrapper = K(val, doc);
		} else {
			wrapper = val;
		}
		if (range.collapsed) {
			if (self._preformat) {
				wrapper = _mergeWrapper(self._preformat.wrapper, wrapper);
			}
			self._preformat = {
				wrapper : wrapper,
				range : range.cloneRange()
			};
			return self;
		}
		if (!wrapper.isInline()) {
			var w = wrapper.clone(true), child = w;
			while (child.first()) {
				child = child.first();
			}
			child.append(range.extractContents());
			range.insertNode(w.get()).selectNode(w.get());
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
			var parent, knode = K(center),
				isStart = sc == node, isEnd = ec == node;
			while ((parent = knode.parent()) && parent.isInline() && parent.children().length == 1) {
				if (!isStart) {
					isStart = sc == parent.get();
				}
				if (!isEnd) {
					isEnd = ec == parent.get();
				}
				knode = parent;
			}
			var el = _wrapNode(knode, wrapper).get();
			if (isStart) {
				range.setStartBefore(el);
			}
			if (isEnd) {
				range.setEndAfter(el);
			}
		}
		function wrapRange(parent) {
			var node = parent.firstChild;
			if (parent.nodeType == 3) {
				wrapTextNode(parent, so, eo);
				return false;
			}
			var testRange, nextNode, knode;
			while (node) {
				testRange = _range(doc);
				testRange.selectNode(node);
				if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
					return false;
				}
				nextNode = node.nextSibling;
				if (testRange.compareBoundaryPoints(_START_TO_END, range) > 0) {
					if (node.nodeType == 1) {
						if (wrapRange(node) === false) {
							return false;
						}
					} else if (node.nodeType == 3) {
						if (node == sc && node == ec) {
							wrapTextNode(node, so, eo);
						} else if (node == sc) {
							wrapTextNode(node, so, node.nodeValue.length);
						} else if (node == ec) {
							wrapTextNode(node, 0, eo);
						} else {
							wrapTextNode(node, 0, node.nodeValue.length);
						}
					}
				}
				node = nextNode;
			}
		}
		wrapRange(range.commonAncestorContainer);
		return self;
	},
	split : function(isStart, map) {
		var range = this.range, doc = range.doc,
			sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		var tempRange = range.cloneRange().collapse(isStart);
		var node = tempRange.startContainer, pos = tempRange.startOffset,
			parent = node.nodeType == 3 ? node.parentNode : node,
			needSplit = false;
		while (parent && parent.parentNode) {
			var knode = K(parent);
			if (!knode.isInline()) {
				break;
			}
			if (!_hasAttrOrCss(knode, map)) {
				break;
			}
			needSplit = true;
			parent = parent.parentNode;
		}
		if (needSplit) {
			var mark = doc.createElement('span');
			range.cloneRange().collapse(!isStart).insertNode(mark);
			if (isStart) {
				tempRange.setStartBefore(parent.firstChild).setEnd(node, pos);
			} else {
				tempRange.setStart(node, pos).setEndAfter(parent.lastChild);
			}
			var frag = tempRange.extractContents(),
				first = frag.firstChild, last = frag.lastChild;
			if (isStart) {
				tempRange.insertNode(frag);
				range.setStartAfter(last).setEndBefore(mark);
			} else {
				parent.appendChild(frag);
				range.setStartBefore(mark).setEndBefore(first);
			}
			var markParent = mark.parentNode;
			markParent.removeChild(mark);
			if (!isStart && markParent === range.endContainer) {
				range.setEnd(range.endContainer, range.endOffset - 1);
			}
		}
		return this;
	},
	remove : function(map) {
		var self = this, doc = self.doc, range = self.range;
		if (range.collapsed) {
			self._preremove = {
				map : map,
				range : range.cloneRange()
			};
			return self;
		}
		self.split(true, map);
		self.split(false, map);
		var nodeList = [];
		K(range.commonAncestorContainer).scan(function(knode) {
			var testRange = _range(doc);
			testRange.selectNode(knode.get());
			if (testRange.compareBoundaryPoints(_END_TO_START, range) >= 0) {
				return false;
			}
			if (testRange.compareBoundaryPoints(_START_TO_START, range) >= 0) {
				nodeList.push(knode);
			}
		});
		var sc = range.startContainer, so = range.startOffset,
			ec = range.endContainer, eo = range.endOffset;
		if (so > 0) {
			var before = K(sc.childNodes[so - 1]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				range.setStart(sc, so - 1);
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
			before = K(sc.childNodes[so]);
			if (before && _isEmptyNode(before)) {
				before.remove();
				if (sc == ec) {
					range.setEnd(ec, eo - 1);
				}
			}
		}
		var after = K(ec.childNodes[range.endOffset]);
		if (after && _isEmptyNode(after)) {
			after.remove();
		}
		_each(nodeList, function() {
			_removeAttrOrCss(this, map);
		});
		return self;
	},
	_applyPreformat : function() {
		var self = this, range = self.range,
			format = self._preformat, remove = self._preremove;
		if (format || remove) {
			if (format) {
				range.setStart(format.range.startContainer, format.range.startOffset);
			} else {
				range.setStart(remove.range.startContainer, remove.range.startOffset);
			}
			if (format) {
				self.wrap(format.wrapper);
			}
			if (remove) {
				self.remove(remove.map);
			}
			var sc = range.startContainer, so = range.startOffset,
				textNode = _getInnerNode(K(sc.nodeType == 3 ? sc : sc.childNodes[so])).get();
			range.setEnd(textNode, textNode.nodeValue.length);
			range.collapse(false);
			self.select();
			self._preformat = null;
			self._preremove = null;
		}
	},
	exec : function(key, val) {
		return this[key.toLowerCase()](val);
	},
	state : function(key) {
		var self = this, doc = self.doc, range = self.range, bool = false;
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
				knode = _getCommonNode(range, {'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
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
			knode = _getCommonNode(range, {'*' : '.font-size'});
			if (knode) {
				val = knode.css('font-size');
			}
			return lc(val);
		}
		if (key === 'forecolor') {
			knode = _getCommonNode(range, {'*' : '.color'});
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
			knode = _getCommonNode(range, {'*' : '.background-color'});
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
		if (_getCommonNode(self.range, map)) {
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
			'*' : 'class,style'
		},
		tags = _INLINE_TAG_MAP;
		_each(tags, function(key, val) {
			map[key] = '*';
		});
		this.remove(map);
		return this.select();
	},
	inserthtml : function(val) {
		var self = this, doc = self.doc, range = self.range;
		var div = doc.createElement('div'),
			frag = doc.createDocumentFragment();
		div.innerHTML = val;
		var node = div.firstChild;
		while (node) {
			frag.appendChild(node.cloneNode(true));
			node = node.nextSibling;
		}
		div = null;
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
	oninput : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _INPUT_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
			}
		});
		return self;
	},
	oncursormove : function(fn) {
		var self = this, doc = self.doc;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CURSORMOVE_KEY_MAP[e.which]) {
				fn(e);
				e.stop();
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
				e.stop();
			}
		});
		K(doc).mouseup(fn);
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
		var doc = mixed.ownerDocument || mixed,
			range = _range(doc).selectNodeContents(doc.body).collapse(false),
			cmd = new KCmd(range);
		cmd.onchange(function(e) {
			var rng = _getRng(doc);
			if (rng) {
				cmd.range = _range(rng);
			}
		});
		cmd.oninput(function(e) {
			cmd._applyPreformat();
		});
		cmd.oncursormove(function(e) {
			cmd._preformat = null;
			cmd._preremove = null;
		});
		return cmd;
	}
	return new KCmd(mixed);
}
K.cmd = _cmd;
function _bindDragEvent(options) {
	var moveEl = options.moveEl,
		moveFn = options.moveFn,
		clickEl = options.clickEl || moveEl,
		iframeFix = options.iframeFix === undefined ? true : options.iframeFix;
	var docs = [document],
		poss = [{ x : 0, y : 0}],
		listeners = [];
	if (iframeFix) {
		K('iframe').each(function() {
			docs.push(_iframeDoc(this));
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
				var docEl = doc.documentElement,
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
			_bindDragEvent(options);
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
function _getInitHtml(bodyClass, cssData) {
	var arr = [
		'<html><head><meta charset="utf-8" /><title>KindEditor</title>',
		'<style>',
		'html {margin:0;padding:0;}',
		'body {margin:0;padding:0;}',
		'body, td {font:12px/1.5 "sans serif",tahoma,verdana,helvetica;}',
		'p {margin:5px 0;}',
		'table {border-collapse:collapse;}',
		'table.ke-zeroborder td {border:1px dotted #AAAAAA;}',
		'</style>'
	];
	if (cssData) {
		if (_isArray(cssData)) {
			_each(cssData, function(i, path) {
				if (path !== '') {
					arr.push('<link href="' + path + '" rel="stylesheet" />');
				}
			});
		} else {
			arr.push('<style>' + cssData + '</style>');
		}
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
		designMode = options.designMode === undefined ? true : options.designMode,
		bodyClass = options.bodyClass,
		cssData = options.cssData,
		div = self.div().addClass('ke-edit'),
		iframe = K('<iframe class="ke-edit-iframe" frameborder="0"></iframe>'),
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
		if ((_IE && _VERSION < 8) || document.compatMode != 'CSS1Compat') {
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
	div.append(iframe);
	div.append(textarea);
	srcElement.hide();
	var doc = _iframeDoc(iframe);
	if (!_IE) {
		doc.designMode = 'on';
	}
	doc.open();
	doc.write(_getInitHtml(bodyClass, cssData));
	doc.close();
	if (_IE) {
		doc.body.contentEditable = 'true';
	}
	self.iframe = iframe;
	self.textarea = textarea;
	self.doc = doc;
	self.remove = function() {
		K(doc).unbind();
		K(doc.body).unbind();
		K(document).unbind();
		_elementVal(srcElement, self.html());
		srcElement.removeAttr('kindeditor');
		srcElement.show();
		doc.write('');
		doc.clear();
		iframe.remove();
		textarea.remove();
		remove.call(self);
		return self;
	};
	self.html = function(val) {
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
			iframe.get().contentWindow.focus();
		} else {
			textarea.get().focus();
		}
		return self;
	};
	self.html(_elementVal(srcElement));
	self.cmd = _cmd(doc);
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
		e.stop();
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
			itemNode = K('<a class="ke-inline-block ke-toolbar-icon-outline" href="#" title="' + (item.title || '') + '">' +
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
	options.z = options.z || 19811213;
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
		itemDiv.click(item.click);
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
	options.z = options.z || 19811213;
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
function _dialog(options) {
	options.z = options.z || 19811213;
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
	var contentCell;
	if (shadowMode) {
		var table = doc.createElement('table');
		table.className = 'ke-dialog-table';
		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.border = 0;
		div.append(table);
		var rowNames = ['t', 'm', 'b'],
			colNames = ['l', 'c', 'r'],
			i, j, row, cell;
		for (i = 0, len = 3; i < len; i++) {
			row = table.insertRow(i);
			for (j = 0, l = 3; j < l; j++) {
				cell = row.insertCell(j);
				cell.className = 'ke-' + rowNames[i] + colNames[j];
				if (i == 1 && j == 1) {
					contentCell = K(cell);
				} else {
					cell.innerHTML = '<span class="ke-dialog-empty"></span>';
				}
			}
		}
		contentCell.css({
			width : width,
			height : height,
			'vertical-align' : 'top'
		});
	} else {
		div.addClass('ke-dialog-no-shadow');
		contentCell = div;
	}
	var headerDiv = K('<div class="ke-dialog-header"></div>');
	contentCell.append(headerDiv);
	headerDiv.html(title);
	var span = K('<span class="ke-dialog-icon-close ke-dialog-icon-close-' +
		(shadowMode ? '' : 'no-') + 'shadow" title="' + closeBtn.name + '"></span>')
		.click(closeBtn.click);
	headerDiv.append(span);
	self.draggable({
		clickEl : headerDiv
	});
	var bodyDiv = K('<div class="ke-dialog-body"></div>');
	contentCell.append(bodyDiv);
	bodyDiv.append(body);
	var footerDiv = K('<div class="ke-dialog-footer"></div>');
	if (previewBtn || yesBtn || noBtn) {
		contentCell.append(footerDiv);
	}
	_each([
		{ btn : previewBtn, name : 'preview' },
		{ btn : yesBtn, name : 'yes' },
		{ btn : noBtn, name : 'no' }
	], function() {
		var btn = this.btn;
		if (btn) {
			var button = K('<input type="button" class="ke-dialog-' + this.name + '" value="' + btn.name + '" />');
			footerDiv.append(button);
			button.click(btn.click);
		}
	});
	if (self.height) {
		bodyDiv.height(_removeUnit(self.height) - headerDiv.height() - footerDiv.height());
	}
	var mask = _widget({
		x : 0,
		y : 0,
		z : 19811212,
		cls : 'ke-dialog-mask',
		width : docWidth,
		height : docHeight
	});
	self.resetPos(div.width(), div.height());
	self.remove = function() {
		mask.remove();
		span.remove();
		K('input', div.get()).remove();
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
K.dialog = _dialog;
var _plugins = {};
function _plugin(name, obj) {
	if (obj === undefined) {
		return _plugins[name];
	}
	_plugins[name] = obj;
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
function KEditor(options) {
	var self = this;
	_each(options, function(key, val) {
		self[key] = options[key];
	});
	_each(_options, function(key, val) {
		if (self[key] === undefined) {
			self[key] = val;
		}
	});
	var se = K(self.srcElement);
	if (!self.width) {
		self.width = se.width() || self.minWidth;
	}
	if (!self.height) {
		self.height = se.height() || self.minHeight;
	}
	self.width = _addUnit(self.width);
	self.height = _addUnit(self.height);
	self.srcElement = se;
}
KEditor.prototype = {
	lang : function(mixed) {
		return _lang(mixed, this.langType);
	},
	create : function() {
		var self = this,
			fullscreenMode = self.fullscreenMode,
			bodyParent = document.body.parentNode;
		if (fullscreenMode) {
			bodyParent.style.overflow = 'hidden';
		} else {
			bodyParent.style.overflow = 'auto';
		}
		var docEl = document.documentElement,
			docWidth = Math.max(docEl.scrollWidth, docEl.clientWidth),
			docHeight = Math.max(docEl.scrollHeight, docEl.clientHeight),
			width = fullscreenMode ? docWidth + 'px' : self.width,
			height = fullscreenMode ? docHeight + 'px' : self.height,
			container = K('<div class="ke-container"></div>').css('width', width);
		if (fullscreenMode) {
			var pos = _getScrollPos();
			container.css({
				position : 'absolute',
				left : _addUnit(pos.x),
				top : _addUnit(pos.y),
				'z-index' : 19811211
			});
			K(document.body).append(container);
		} else {
			self.srcElement.before(container);
		}
		var toolbar = _toolbar({
				parent : container,
				noDisableItems : 'source,fullscreen'.split(',')
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
					_plugin(name).call(this, self);
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
				bodyClass : self.bodyClass,
				cssData : self.cssData
			}),
			doc = edit.doc, textarea = edit.textarea;
		K(doc, document).click(function(e) {
			if (self.menu) {
				self.hideMenu();
			}
		});
		_each({
			undo : 'Z', redo : 'Y', bold : 'B', italic : 'I',
			underline : 'U', selectall : 'A', print : 'P'
		}, function(name, key) {
			_ctrl(doc, key, function() {
				if (_plugin(name)) {
					_plugin(name).call(doc, self);
				}
			});
			if (key == 'Z' || key == 'Y') {
				_ctrl(textarea.get(), key, function() {
					if (_plugin(name)) {
						_plugin(name).call(textarea, self);
					}
				});
			}
		});
		var statusbar = K('<div class="ke-statusbar"></div>');
		container.append(statusbar);
		if (!fullscreenMode) {
			var rightIcon = K('<span class="ke-inline-block ke-statusbar-right-icon"></span>');
			statusbar.append(rightIcon);
			_bindDragEvent({
				moveEl : container,
				clickEl : rightIcon,
				moveFn : function(x, y, width, height, diffX, diffY) {
					width += diffX;
					height += diffY;
					if (width >= self.minWidth) {
						self.resize(width, null);
					}
					if (height >= self.minHeight) {
						self.resize(null, height);
					}
				}
			});
		}
		if (self._resizeListener) {
			K(window).unbind('resize', self._resizeListener);
			self._resizeListener = null;
		}
		if (self.fullscreenMode) {
			function resizeListener(e) {
				if (self.container) {
					var el = document.documentElement;
					self.resize(el.clientWidth, el.clientHeight);
				}
			}
			K(window).bind('resize', resizeListener);
			self._resizeListener = resizeListener;
		}
		self.container = container;
		self.toolbar = toolbar;
		self.edit = edit;
		self.statusbar = statusbar;
		self.menu = self.dialog = null;
		self.resize(width, height);
		return self;
	},
	remove : function() {
		var self = this;
		if (self.menu) {
			self.menu.remove();
		}
		self.toolbar.remove();
		self.edit.remove();
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
			height = _removeUnit(height) - self.toolbar.div().height() - self.statusbar.height() - 11;
			if (height > 0) {
				self.edit.height(height);
			}
		}
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
		this.menu.remove();
		this.menu = null;
	},
	createDialog : function(options) {
		var self = this,
			name = options.name;
		options.shadowMode = self.shadowMode;
		options.closeBtn = {
			name : self.lang('close'),
			click : function(e) {
				self.hideDialog();
				self.edit.focus();
			}
		};
		options.noBtn = {
			name : self.lang('no'),
			click : function(e) {
				self.hideDialog();
				self.edit.focus();
			}
		};
		return (self.dialog = _dialog(options));
	},
	hideDialog : function() {
		this.dialog.remove();
		this.dialog = null;
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
if (_IE && _VERSION < 7) {
	_nativeCommand(document, 'BackgroundImageCache', true);
}
K.create = _create;
K.plugin = _plugin;
K.lang = _lang;
if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;
})(window);
(function(K, undefined) {
K.plugin('source', function(editor) {
	editor.toolbar.disable();
	editor.edit.design();
});
K.plugin('fullscreen', function(editor) {
	editor.fullscreen();
});
K.plugin('formatblock', function(editor) {
	var blocks = editor.lang('formatblock.formatBlock'),
		heights = {
			h1 : 28,
			h2 : 24,
			h3 : 18,
			H4 : 14,
			p : 12
		},
		cmd = editor.edit.cmd,
		curVal = cmd.val('formatblock'),
		menu = editor.createMenu({
			name : 'formatblock',
			width : editor.langType == 'en' ? 200 : 150
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
			click : function(e) {
				cmd.select();
				cmd.formatblock('<' + key.toUpperCase() + '>');
				editor.hideMenu();
				e.stop();
			}
		});
	});
});
K.plugin('fontname', function(editor) {
	var cmd = editor.edit.cmd,
		curVal = cmd.val('fontname'),
		menu = editor.createMenu({
			name : 'fontname',
			width : 150
		});
	K.each(editor.lang('fontname.fontName'), function(key, val) {
		menu.addItem({
			title : '<span style="font-family: ' + key + ';">' + val + '</span>',
			checked : (curVal === key.toLowerCase() || curVal === val.toLowerCase()),
			click : function(e) {
				editor.hideMenu();
				e.stop();
			}
		});
	});
});
K.plugin('fontsize', function(editor) {
	var fontSize = ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
		cmd = editor.edit.cmd,
		curVal = cmd.val('fontsize');
		menu = editor.createMenu({
			name : 'fontsize',
			width : 150
		});
	K.each(fontSize, function(i, val) {
		menu.addItem({
			title : '<span style="font-size:' + val + ';">' + val + '</span>',
			height : K.removeUnit(val) + 12,
			checked : curVal === val,
			click : function(e) {
				cmd.fontsize(val);
				editor.hideMenu();
				e.stop();
			}
		});
	});
});
K.each('forecolor,hilitecolor'.split(','), function(i, name) {
	K.plugin(name, function(editor) {
		var cmd = editor.edit.cmd,
			curVal = cmd.val(name);
		editor.createMenu({
			name : name,
			selectedColor : curVal || 'default',
			click : function(color) {
				cmd[name](color);
				editor.hideMenu();
			}
		});
	});
});
K.each(('selectall,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,' +
	'insertunorderedlist,indent,outdent,subscript,superscript,hr,print,' +
	'bold,italic,underline,strikethrough,removeformat').split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.edit.focus();
		editor.edit.cmd[name](null);
	});
});
K.each(('cut,copy,paste').split(','), function(i, name) {
	K.plugin(name, function(editor) {
		editor.edit.focus();
		try {
			editor.edit.cmd[name](null);
		} catch(e) {
			alert(editor.lang(name + 'Error'));
		}
	});
});
K.plugin('about', function(editor) {
	var html = '<div style="margin:20px;">' +
		'<div>KindEditor ' + K.kindeditor + '</div>' +
		'<div>Copyright &copy; <a href="http://www.kindsoft.net/" target="_blank">kindsoft.net</a> All rights reserved.</div>' +
		'</div>';
	editor.createDialog({
		name : 'about',
		width : 300,
		title : editor.lang('about'),
		body : html
	});
});
K.plugin('plainpaste', function(editor) {
	var lang = editor.lang('plainpaste.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<textarea style="width:415px;height:260px;border:1px solid #A0A0A0;"></textarea>' +
			'</div>',
		dialog = editor.createDialog({
			name : 'plainpaste',
			width : 450,
			title : editor.lang('plainpaste'),
			body : html,
			yesBtn : {
				name : editor.lang('yes'),
				click : function(e) {
					var html = textarea.val();
					html = K.escape(html);
					html = html.replace(/ /g, '&nbsp;');
					html = html.replace(/\r\n|\n|\r/g, "<br />$&");
					editor.edit.cmd.inserthtml(html);
					editor.hideDialog();
					editor.edit.focus();
				}
			}
		}),
		textarea = K('textarea', dialog.div().get());
	textarea.get().focus();
});
K.plugin('wordpaste', function(editor) {
	var lang = editor.lang('wordpaste.'),
		html = '<div style="margin:10px;">' +
			'<div style="margin-bottom:10px;">' + lang.comment + '</div>' +
			'<iframe style="width:415px;height:260px;border:1px solid #A0A0A0;" frameborder="0"></iframe>' +
			'</div>',
		dialog = editor.createDialog({
			name : 'wordpaste',
			width : 450,
			title : editor.lang('wordpaste'),
			body : html,
			yesBtn : {
				name : editor.lang('yes'),
				click : function(e) {
					var str = doc.body.innerHTML;
					str = str.replace(/<meta(\n|.)*?>/ig, '');
					str = str.replace(/<!(\n|.)*?>/ig, '');
					str = str.replace(/<style[^>]*>(\n|.)*?<\/style>/ig, '');
					str = str.replace(/<script[^>]*>(\n|.)*?<\/script>/ig, '');
					str = str.replace(/<w:[^>]+>(\n|.)*?<\/w:[^>]+>/ig, '');
					str = str.replace(/<xml>(\n|.)*?<\/xml>/ig, '');
					str = str.replace(/\r\n|\n|\r/ig, '');
					editor.edit.cmd.inserthtml(str);
					editor.hideDialog();
					editor.edit.focus();
				}
			}
		}),
		div = dialog.div(),
		iframe = K('iframe', div.get());
	var doc = K.iframeDoc(iframe);
	if (!K.IE) {
		doc.designMode = 'on';
	}
	doc.open();
	doc.write('<html><head><title>WordPaste</title></head>');
	doc.write('<body style="background-color:#FFFFFF;font-size:12px;margin:2px;" />');
	if (!K.IE) {
		doc.write('<br />');
	}
	doc.write('</body></html>');
	doc.close();
	if (K.IE) {
		doc.body.contentEditable = 'true';
	}
	iframe.get().contentWindow.focus();
});
})(KindEditor);
