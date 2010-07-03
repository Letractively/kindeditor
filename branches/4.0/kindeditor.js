/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2010 Longhao Luo
*
* @author Longhao Luo <luolonghao@gmail.com>
* @website http:
* @licence LGPL(http:
* @version 4.0 (2010-07-01)
*******************************************************************************/

(function (window, undefined) {

var _ua = navigator.userAgent.toLowerCase(),
	_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1,
	_GECKO = _ua.indexOf('gecko') > -1 && _ua.indexOf('khtml') == -1,
	_WEBKIT = _ua.indexOf('applewebkit') > -1,
	_OPERA = _ua.indexOf('opera') > -1,
	_matches = /(?:msie|firefox|webkit|opera)[\/:\s](\d+)/.exec(_ua),
	_VERSION = _matches ? _matches[1] : '0';

function _isArray(val) {
	return Object.prototype.toString.call(val) === '[object Array]';
}

function _inArray(val, arr) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (val === arr[i]) {
			return i;
		}
	}
	return -1;
}
var d;  

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
	var map = {}, arr = str.split(delimiter);
	_each(arr, function(key, val) {
		map[val] = true;
	});
	return map;
}

var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
	_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),
	_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
	_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
	_VALUE_TAG_MAP = _toMap('input,button,textarea,select');

var K = {
	IE : _IE,
	GECKO : _GECKO,
	WEBKIT : _WEBKIT,
	OPERA : _OPERA,
	VERSION : _VERSION,
	each : _each,
	isArray : _isArray,
	inArray : _inArray,
	inString : _inString,
	trim : _trim,
	toHex : _toHex,
	toMap : _toMap
};

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

var _props = 'altKey,attrChange,attrName,bubbles,button,cancelable,charCode,clientX,clientY,ctrlKey,currentTarget,data,detail,eventPhase,fromElement,handler,keyCode,layerX,layerY,metaKey,newValue,offsetX,offsetY,originalTarget,pageX,pageY,prevValue,relatedNode,relatedTarget,screenX,screenY,shiftKey,srcElement,target,toElement,view,wheelDelta,which'.split(',');
function _event(el, e) {
	if (!e) {
		return;
	}
	var obj = {},
		doc = el.nodeName.toLowerCase() === '#document' ? el : el.ownerDocument;
	_each(_props, function(key, val) {
		obj[val] = e[val];
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
	obj.preventDefault = function() {
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	};
	obj.stopPropagation = function() {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		e.cancelBubble = true;
	};
	obj.stop = function() {
		this.preventDefault();
		this.stopPropagation();
	};
	return obj;
}

var _elList = [], _data = {};

function _getId(el) {
	var id = _inArray(el, _elList);
	if (id < 0) {
		id = _elList.length;
		_elList.push(el);
		_data[id] = {};
	}
	return id;
}

function _bind(el, type, fn) {
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
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
	var id = _getId(el);
	if (type === undefined) {
		if (id in _data) {
			_each(_data[id], function(key, val) {
				_unbindEvent(el, key, val[0]);
			});
			_data[id] = {};
		}
		return;
	}
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		if (fn === undefined) {
			_unbindEvent(el, type, _data[id][type][0]);
			_data[id][type] = [];
		} else {
			for (var i = 0, len = _data[id][type].length; i < len; i++) {
				if (_data[id][type][i] === fn) {
					delete _data[id][type][i];
				}
			}
			if (_data[id][type].length == 2 && _data[id][type][1] === undefined) {
				_unbindEvent(el, type, _data[id][type][0]);
				_data[id][type] = [];
			}
		}
	}
}

function _fire(el, type) {
	var id = _getId(el);
	if (_data[id][type] !== undefined && _data[id][type].length > 0) {
		_data[id][type][0]();
	}
}

K.bind = _bind;
K.unbind = _unbind;
K.fire = _fire;

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
	html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
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
			endNewline = ' ';
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
	var docA = nodeA.ownerDocument || nodeA,
		docB = nodeB.ownerDocument || nodeB;
	if (docA !== docB) {
		return false;
	}
	if (nodeB === docB) {
		return false;
	}
	if (nodeA === docA) {
		return true;
	}
	if (nodeA.nodeType === 3) {
		return false;
	}
	if (nodeB.nodeType === 3) {
		nodeB = nodeB.parentNode;
		if (!nodeB) {
			return false;
		}
		if (nodeA === nodeB) {
			return true;
		}
	}
	if (nodeA.compareDocumentPosition) {
		return !!(nodeA.compareDocumentPosition(nodeB) & 16);
	}
	return nodeA !== nodeB && nodeA.contains(nodeB);
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
		var arr = [];
		var doc = root.ownerDocument || root;
		var el = doc.getElementById(stripslashes(id));
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
		var arr = [];
		var els = root.getElementsByName(stripslashes(name));
		for (var i = 0, len = els.length, el; i < len; i++) {
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
		var arr = [];
		var els = root.getElementsByTagName(tag);
		for (var i = 0, len = els.length, el; i < len; i++) {
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
			var els = root.getElementsByTagName(tag);
			for (var i = 0, len = els.length, el; i < len; i++) {
				el = els[i];
				if (el.nodeType == 1) {
					arr.push(el);
				}
			}
		}
		return arr;
	}
	var parts = [];
	var arr, re = /((?:\\.|[^\s>])+|[\s>])/g;
	while ((arr = re.exec(expr))) {
		if (arr[1] !== ' ') {
			parts.push(arr[1]);
		}
	}
	var results = [];
	if (parts.length == 1) {
		return select(parts[0], root);
	}
	var el, isChild = false;
	for (var i = 0, lenth = parts.length; i < lenth; i++) {
		var part = parts[i];
		if (part === '>') {
			isChild = true;
			continue;
		}
		if (i > 0) {
			var els = [];
			for (var j = 0, len = results.length, val = results[j]; j < len; j++) {
				var subResults = select(part, val);
				for (var k = 0, l = subResults.length, v = subResults[k]; k < l; k++) {
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

function _node(expr, root) {
	var node, divArea;
	if (typeof expr === 'string') {
		if (/<.+>/.test(expr)) {
			var ownerDocument = root ? root.ownerDocument || root : document;
			node = ownerDocument.createElement('textarea');
		} else {
			node = _query(expr, root);
		}
	} else {
		node = expr;
	}
	if (!node) {
		return null;
	}
	var doc = node.ownerDocument || node,
		win = doc.parentWindow || doc.defaultView,
		prevDisplay = '';
	var obj = {

		name : node.nodeName.toLowerCase(),

		type : node.nodeType,

		doc : doc,
		
		getDiv : function() {
			return divArea;
		},

		bind : function(type, fn) {
			_bind(node, type, fn);
			return this;
		},
		unbind : function(type, fn) {
			_unbind(node, type, fn);
			return this;
		},
		fire : function(type) {
			_fire(node, type);
			return this;
		},
		hasAttr : function(key) {
			return _getAttr(node, key);
		},
		attr : function(key, val) {
			if (key === undefined) {
				return _getAttrList(this.outer());
			} else if (val === undefined) {
				val = _getAttr(node, key);
				return val === null ? '' : val;
			} else {
				if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
					key = 'className';
				}
				node.setAttribute(key, '' + val);
				return this;
			}
		},
		removeAttr : function(key) {
			if (_IE && _VERSION < 8 && key.toLowerCase() == 'class') {
				key = 'className';
			}
			this.attr(key, '');
			node.removeAttribute(key);
			return this;
		},
		get : function() {
			return node;
		},
		hasClass : function(cls) {
			return _inString(cls, node.className, ' ');

		},
		addClass : function(cls) {
			if (!this.hasClass(cls)) {
				node.className = _trim(node.className + ' ' + cls);
			}
			return this;
		},
		removeClass : function(cls) {
			if (this.hasClass(cls)) {
				node.className = _trim(node.className.replace(new RegExp('\\s*' + cls + '\\s*'), ''));
			}
			return this;
		},
		html : function(val) {
			if (val === undefined) {
				return _formatHtml(node.innerHTML);
			} else {
				node.innerHTML = _formatHtml(val);
				return this;
			}
		},
		val : function(val) {
			if (val === undefined) {
				return this.hasVal() ? node.value : this.attr('value');
			} else {
				if (this.hasVal()) {
					node.value = val;
				} else {
					this.attr('value' , val);
				}
				return this;
			}
		},
		css : function(key, val) {
			var self = this;
			if (key === undefined) {
				return _getCssList(this.attr('style'));
			}
			if (typeof key === 'object') {
				_each(key, function(k, v) {
					self.css(k, v);
				});
				return this;
			}
			if (val === undefined) {
				return node.style[key] || this.computedCss(key) || '';
			}
			node.style[_toCamel(key)] = val;
			return this;
		},
		computedCss : function(key) {
			var camelKey = _toCamel(key),
				val = '';
			if (win.getComputedStyle) {
				var style = win.getComputedStyle(node, null);
				val = style[camelKey] || style.getPropertyValue(key) || node.style[camelKey];
			} else if (node.currentStyle) {
				val = node.currentStyle[camelKey] || node.style[camelKey];
			}
			return val;
		},
		clone : function(bool) {
			return _node(node.cloneNode(bool));
		},
		append : function(val) {
			node.appendChild(_get(val));
			return this;
		},
		before : function(val) {
			node.parentNode.insertBefore(_get(val), node);
			return this;
		},
		after : function(val) {
			if (node.nextSibling) {
				node.parentNode.insertBefore(_get(val), node.nextSibling);
			} else {
				this.append(val);
			}
			return this;
		},
		replaceWith : function(val) {
			node.parentNode.replaceChild(_get(val), node);
			this.unbind();
			node = _get(val);
			return this;
		},
		remove : function() {
			this.unbind();
			d = d || doc.createElement('div');  
			d.appendChild(node);  
			d.innerHTML = '';  
			//d = null;
			node = null;
			//node.parentNode.removeChild(node);
			return this;
		},
		show : function() {
			if (this.computedCss('display') === 'none') {
				this.css('display', prevDisplay);
			}
			return this;
		},
		hide : function() {
			if (this.computedCss('display') !== 'none') {
				prevDisplay = this.css('display');
				this.css('display', 'none');
			}
			return this;
		},
		outer : function() {
			var div = doc.createElement('div'),html;
			div.appendChild(node);
			html = _formatHtml(div.innerHTML);
			div = null;
			return html;
		},
		hasVal : function() {
			return !!_VALUE_TAG_MAP[this.name];
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
			return _contains(node, _get(otherNode));
		},
		parent : function() {
			return _node(node.parentNode);
		},
		prev : function() {
			return _node(node.previousSibling);
		},
		next : function() {
			return _node(node.nextSibling);
		},
		each : function(fn, order) {
			order = (order === undefined) ? true : order;
			function walk(knode) {
				var n = order ? knode.first : knode.last;
				if (!n) {
					return;
				}
				while (n) {
					var next = order ? n.next() : n.prev();
					if (fn(n)) {
						return true;
					}
					if (walk(n)) {
						return;
					}
					n = next;
				}
			}
			walk(this);
		},
		toString : function() {
			return this.type == 3 ? node.nodeValue : this.outer();
		}
	};
	function _updateProp(node) {

		var list = [], child = node.firstChild;
		while (child) {
			if (child.nodeType != 3 || _trim(child.nodeValue) !== '') {
				list.push(_node(child));
			}
			child = child.nextSibling;
		}
		if (list.length > 0) {
			this.first = list[0];
			this.last = list[list.length - 1];
		} else {
			this.first = this.last = null;
		}
		this.children = list;

		var i = -1, sibling = node;
		while (sibling) {
			i++;
			sibling = sibling.previousSibling;
		}
		this.index = i;
	}
	_updateProp.call(obj, node);
	return obj;
}

K.node = _node;

var _START_TO_START = 0,
	_START_TO_END = 1,
	_END_TO_END = 2,
	_END_TO_START = 3;

function _updateCollapsed() {
	this.collapsed = (this.startContainer === this.endContainer && this.startOffset === this.endOffset);
}

function _updateCommonAncestor(doc) {
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

function _compareAndUpdate(doc) {
	var rangeA = _range(doc),
		rangeB = _range(doc);
	rangeA.startContainer = rangeA.endContainer = this.startContainer;
	rangeA.startOffset = rangeA.endOffset = this.startOffset;
	rangeB.startContainer = rangeB.endContainer = this.endContainer;
	rangeB.startOffset = rangeB.endOffset = this.endOffset;
	if (rangeA.compareBoundaryPoints(_START_TO_START, rangeB) == 1) {
		this.startContainer = this.endContainer;
		this.startOffset = this.endOffset;
	}
}

function _copyAndDelete(doc, isCopy, isDelete) {
	var self = this,
		startContainer = self.startContainer,
		startOffset = self.startOffset,
		endContainer = self.endContainer,
		endOffset = self.endOffset,
		nodeList = [],
		selfRange = self;
	if (isDelete) {
		selfRange = self.cloneRange();
		self.collapse(true);
		if (startContainer.nodeType == 3 && startOffset === 0) {
			self.setStart(startContainer.parentNode, 0);
			self.setEnd(startContainer.parentNode, 0);
		}
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
	function getTextNode(node) {
		if (node == startContainer && node == endContainer) {
			return splitTextNode(node, startOffset, endOffset);
		} else if (node == startContainer) {
			return splitTextNode(node, startOffset, node.nodeValue.length);
		} else if (node == endContainer) {
			return splitTextNode(node, 0, endOffset);
		} else {
			return splitTextNode(node, 0, node.nodeValue.length);
		}
	}
	function extractNodes(parent, frag) {
		var node = parent.firstChild;
		while (node) {
			var range = _range(doc);
			range.selectNode(node);
			if (range.compareBoundaryPoints(_END_TO_START, selfRange) >= 0) {
				return false;
			}
			var nextNode = node.nextSibling;
			if (range.compareBoundaryPoints(_START_TO_END, selfRange) > 0) {
				var type = node.nodeType;
				if (type == 1) {
					if (range.compareBoundaryPoints(_START_TO_START, selfRange) >= 0) {
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
						if (!extractNodes(node, childFlag)) {
							return false;
						}
					}
				} else if (type == 3) {
					var textNode = getTextNode(node);
					if (textNode) {
						frag.appendChild(textNode);
					}
				}
			}
			node = nextNode;
		}
		return true;
	}
	var frag = doc.createDocumentFragment(),
		ancestor = selfRange.commonAncestorContainer;
	if (ancestor.nodeType == 3) {
		var textNode = getTextNode(ancestor);
		if (textNode) {
			frag.appendChild(textNode);
		}
	} else {
		extractNodes(ancestor, frag);
	}
	for (var i = 0, len = nodeList.length; i < len; i++) {
		var node = nodeList[i];
		_node(node).remove();
	}
	return isCopy ? frag : self;
}

function _getStartEnd(rng, isStart) {
	var doc = rng.parentElement().ownerDocument;
	var range = _range(doc);
	var pointRange = rng.duplicate();
	pointRange.collapse(isStart);
	var parent = pointRange.parentElement();
	var children = parent.childNodes;
	if (children.length === 0) {
		range.selectNode(parent);
		return {node: range.startContainer, offset: range.startOffset};
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
		range.setStartAfter(parent.lastChild);
		return {node: range.startContainer, offset: range.startOffset};
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
			range = _range(doc);
			range.selectNode(rng.item(0));
			return range;
		}
		var start = _getStartEnd(rng, true),
			end = _getStartEnd(rng, false);
		range = _range(doc);
		range.setStart(start.node, start.offset);
		range.setEnd(end.node, end.offset);
		return range;
	} else {
		var startContainer = rng.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		range = _range(doc);
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
			if (!_node(sibling).isSingle()) {
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

function _range(mixed) {
	if (!mixed.nodeName) {
		return mixed.get ? mixed : _toRange(mixed);
	}
	var doc = mixed;
	return {

		startContainer : doc,

		startOffset : 0,

		endContainer : doc,

		endOffset : 0,

		collapsed : true,

		commonAncestorContainer : doc,

		setStart : function(node, offset) {
			this.startContainer = node;
			this.startOffset = offset;
			if (this.endContainer === doc) {
				this.endContainer = node;
				this.endOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},

		setEnd : function(node, offset) {
			this.endContainer = node;
			this.endOffset = offset;
			if (this.startContainer === doc) {
				this.startContainer = node;
				this.startOffset = offset;
			}
			_compareAndUpdate.call(this, doc);
			_updateCollapsed.call(this);
			_updateCommonAncestor.call(this, doc);
			return this;
		},

		setStartBefore : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index);
		},

		setStartAfter : function(node) {
			return this.setStart(node.parentNode || doc, _node(node).index + 1);
		},

		setEndBefore : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index);
		},

		setEndAfter : function(node) {
			return this.setEnd(node.parentNode || doc, _node(node).index + 1);
		},

		selectNode : function(node) {
			this.setStartBefore(node);
			this.setEndAfter(node);
			return this;
		},

		selectNodeContents : function(node) {
			var knode = _node(node);
			if (knode.type == 3 || knode.isSingle()) {
				this.selectNode(node);
			} else {
				if (knode.children.length > 0) {
					this.setStartBefore(knode.first.get());
					this.setEndAfter(knode.last.get());
				} else {
					this.setStart(node, 0);
					this.setEnd(node, 0);
				}
			}
			return this;
		},

		collapse : function(toStart) {
			if (toStart) {
				this.setEnd(this.startContainer, this.startOffset);
			} else {
				this.setStart(this.endContainer, this.endOffset);
			}
			return this;
		},

		compareBoundaryPoints : function(how, range) {
			var rangeA = this.get(),
				rangeB = range.get();
			if (!doc.createRange) {
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
					return _node(nodeC).index >= posA ? -1 : 1;
				}

				nodeC = nodeA;
				while (nodeC && nodeC.parentNode !== nodeB) {
					nodeC = nodeC.parentNode;
				}
				if (nodeC) {
					return _node(nodeC).index >= posB ? 1 : -1;
				}

			} else {
				return rangeA.compareBoundaryPoints(how, rangeB);
			}
		},

		cloneRange : function() {
			var range = _range(doc);
			range.setStart(this.startContainer, this.startOffset);
			range.setEnd(this.endContainer, this.endOffset);
			return range;
		},

		toString : function() {

			var rng = this.get(),
				str = doc.createRange ? rng.toString() : rng.text;
			return str.replace(/\r\n|\n|\r/g, '');
		},

		cloneContents : function() {
			return _copyAndDelete.call(this, doc, true, false);
		},

		deleteContents : function() {
			return _copyAndDelete.call(this, doc, false, true);
		},

		extractContents : function() {
			return _copyAndDelete.call(this, doc, true, true);
		},

		insertNode : function(node) {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				afterNode,
				parentNode,
				endNode,
				endTextNode,
				endTextPos,
				eq = startContainer == endContainer,
				isFrag = node.nodeName.toLowerCase() === '#document-fragment';
			if (endContainer.nodeType == 1 && endOffset > 0) {
				endNode = endContainer.childNodes[endOffset - 1];
				if (endNode.nodeType == 3) {
					eq = startContainer == endNode;
					if (eq) {
						endTextPos = endNode.nodeValue.length;
					}
				}
			}
			if (startContainer.nodeType == 1) {
				if (startContainer.childNodes.length > 0) {
					afterNode = startContainer.childNodes[startOffset];
				} else {
					parentNode = startContainer;
				}
			} else {
				if (startOffset === 0) {
					afterNode = startContainer;
				} else if (startOffset < startContainer.length) {
					afterNode = startContainer.splitText(startOffset);
					if (eq) {
						endTextNode = afterNode;
						endTextPos = endTextPos ? endTextPos - startOffset : this.endOffset - startOffset;
						this.setEnd(endTextNode, endTextPos);
					}
				} else {
					if (startContainer.nextSibling) {
						afterNode = startContainer.nextSibling;
					} else {
						parentNode = startContainer.parentNode;
					}
				}
			}
			if (afterNode) {
				afterNode.parentNode.insertBefore(node, afterNode);
			}
			if (parentNode) {
				parentNode.appendChild(node);
			}
			if (isFrag) {
				if (node.firstChild) {
					this.setStartBefore(node.firstChild);
				}
				if (this.collapsed) {
					if (afterNode) {
						endNode = afterNode.previousSibling;
					}
					if (parentNode) {
						endNode = parentNode.lastChild;
					}
				}
			} else {
				this.setStartBefore(node);
				if (this.collapsed) {
					endNode = node;
				}
			}
			if (endNode) {
				this.setEndAfter(endNode);
			}
			return this;
		},

		surroundContents : function(node) {
			node.appendChild(this.extractContents());
			return this.insertNode(node);
		},

		get : function() {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				endContainer = this.endContainer,
				endOffset = this.endOffset,
				range;
			if (doc.createRange) {
				range = doc.createRange();
				range.setStart(startContainer, startOffset);
				range.setEnd(endContainer, endOffset);
			} else {
				range = doc.body.createTextRange();
				range.setEndPoint('StartToStart', _getEndRange(startContainer, startOffset));
				range.setEndPoint('EndToStart', _getEndRange(endContainer, endOffset));
			}
			return range;
		},

		html : function() {
			return _node(this.cloneContents()).outer();
		}
	};
}

K.range = _range;
K.START_TO_START = _START_TO_START;
K.START_TO_END = _START_TO_END;
K.END_TO_END = _END_TO_END;
K.END_TO_START = _END_TO_START;

function _nativeCommandValue(doc, cmd) {
	var val = '';
	try {
		val = doc.queryCommandValue(cmd);
	} catch (e) {}
	if (typeof val !== 'string') {
		val = '';
	}
	return val;
}

function _getWin(doc) {
	return doc.parentWindow || doc.defaultView;
}

function _getSel(doc) {
	var win = _getWin(doc);
	return win.getSelection ? win.getSelection() : doc.selection;
}

function _select(sel, range) {
	var sc = range.startContainer, so = range.startOffset,
		ec = range.endContainer, eo = range.endOffset,
		doc = sc.ownerDocument || sc, win = _getWin(doc), rng;

	if (_IE && sc.nodeType == 1 && range.collapsed) {
		var empty = doc.createTextNode(' ');
		ec.appendChild(empty);
		rng = doc.body.createTextRange();
		rng.moveToElementText(ec);
		rng.collapse(false);
		rng.select();
		ec.removeChild(empty);
		win.focus();
		return;
	}

	rng = range.get();
	if (_IE) {
		rng.select();
	} else {
		sel.removeAllRanges();
		sel.addRange(rng);
	}
	win.focus();
}

function _hasAttrOrCss(node, map, mapKey) {
	var knode = _node(node), arr, newMap = {};
	mapKey = mapKey || knode.name;
	if (knode.type !== 1) {
		return false;
	}
	_each(map, function(key, val) {
		arr = key.split(',');
		for (var i = 0, len = arr.length, v = arr[i]; i < len; i++) {
			newMap[v] = val;
		}
	});
	if (newMap[mapKey]) {
		arr = newMap[mapKey].split(',');
		for (var i = 0, len = arr.length, val = arr[i]; i < len; i++) {
			if (val.charAt(0) === '.' && knode.css(val.substr(1)) !== '') {
				return true;
			}
			if (val.charAt(0) !== '.' && knode.attr(val) !== '') {
				return true;
			}
		}
	}
	return false;
}

function _getCommonNode(range, map) {
	var node = range.commonAncestorContainer, knode, arr;
	while (node) {
		if (_hasAttrOrCss(node, map, '*')) {
			return node;
		}
		if (_hasAttrOrCss(node, map)) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}

function _cmd(mixed) {
	var sel, doc, rng;
	if (mixed.nodeName) {

		doc = mixed.ownerDocument || mixed;
		sel = _getSel(doc);
		try {
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
			} else {
				rng = sel.createRange();
			}
		} catch(e) {}
		mixed = rng || doc;
		if (_IE && (!rng || rng.parentElement().ownerDocument !== doc)) {
			return null;
		}
	} else {

		var startContainer = mixed.startContainer;
		doc = startContainer.ownerDocument || startContainer;
		sel = _getSel(doc);
		rng = mixed.get();
	}
	var win = _getWin(doc),
		range = _range(mixed);

	return {
		wrap : function(val) {
			var wrapper = _node(val, doc), clone;

			if (!wrapper.isInline()) {
				clone = wrapper.clone(false);
				range.surroundContents(clone.get());
				_select(sel, range);
				return this;
			}

			if (range.collapsed) {
				clone = wrapper.clone(false);
				range.insertNode(clone.get());
				range.selectNodeContents(clone.get());
				_select(sel, range);
				return this;
			}

			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') {
							node.attr(key, val);
						}
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(sel, range);
			return this;
		},
		remove : function(map) {

			if (range.collapsed) {
				return this;
			}

			var frag = range.extractContents(),
				name = wrapper.name;
			_node(frag).each(function(node) {
				if (node.type == 3 && node.parent().name !== name) {
					var clone = wrapper.clone(false);
					clone.append(node.clone(true));
					node.replaceWith(clone);
				} else if (node.name === name) {
					_each(wrapper.attr(), function(key, val) {
						if (key !== 'style') {
							node.attr(key, val);
						}
					});
					_each(wrapper.css(), function(key, val) {
						node.css(key, val);
					});
				}
			});
			range.insertNode(frag);
			_select(sel, range);
			return this;
		},

		exec : function(cmd, val) {
			return this[cmd.toLowerCase()](val);
		},

		state : function(cmd) {
			var bool = false;
			try {
				bool = doc.queryCommandState(cmd);
			} catch (e) {}
			return bool;
		},

		val : function(cmd) {
			function lc(val) {
				return val.toLowerCase();
			}
			cmd = lc(cmd);
			var val = '', el;
			if (cmd === 'fontfamily' || cmd === 'fontname') {
				val = _nativeCommandValue(doc, 'fontname');
				val = val.replace(/['"]/g, '');
				return lc(val);
			}
			if (cmd === 'formatblock') {
				val = _nativeCommandValue(doc, cmd);
				if (val === '') {
					el = _getCommonNode(range, {'h1,h2,h3,h4,h5,h6,p,div,pre,address' : '*'});
					if (el) {
						val = el.nodeName;
					}
				}
				if (val === 'Normal') {
					val = 'p';
				}
				return lc(val);
			}
			if (cmd === 'fontsize') {
				el = _getCommonNode(range, {'*' : '.font-size'});
				if (el) {
					val = _node(el).css('font-size');
				}
				return lc(val);
			}
			if (cmd === 'forecolor') {
				el = _getCommonNode(range, {'*' : '.color'});
				if (el) {
					val = _node(el).css('color');
				}
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			if (cmd === 'hilitecolor') {
				el = _getCommonNode(range, {'*' : '.background-color'});
				val = _toHex(val);
				if (val === '') {
					val = 'default';
				}
				return lc(val);
			}
			return val;
		},
		bold : function() {
			return this.wrap('<strong></strong>');
		},
		italic : function() {
			return this.wrap('<em></em>');
		},
		forecolor : function(val) {
			return this.wrap('<span style="color:' + val + ';"></span>');
		},
		hilitecolor : function(val) {
			return this.wrap('<span style="background-color:' + val + ';"></span>');
		},
		fontsize : function(val) {
			return this.wrap('<span style="font-size:' + val + ';"></span>');
		},
		fontname : function(val) {
			return this.fontfamily(val);
		},
		fontfamily : function(val) {
			return this.wrap('<span style="font-family:' + val + ';"></span>');
		},
		removeformat : function() {
			var options = {
				'*' : 'class,style'
			},
			tags = _INLINE_TAGS.split(',');
			_each(tags, function(key, val) {
				options[val] = '*';
			});
			this.remove(options);
			return this;
		}
	};
}

K.cmd = _cmd;

function _getIframeDoc(iframe) {
	return iframe.contentDocument || iframe.contentWindow.document;
}

function _getInitHtml(bodyClass, css) {
	var arr = ['<!doctype html><html><head><meta charset="utf-8" /><title>KindEditor</title>'];
	if (css) {
		if (typeof css == 'string' && !/\{[\s\S]*\}/g.test(css)) {
			css = [css];
		}
		if (_isArray(css)) {
			_each(css, function(i, path) {
				if (path !== '') {
					arr.push('<link href="' + path + '" rel="stylesheet" />');
				}
			});
		} else {
			arr.push('<style>' + css + '</style>');
		}
	}
	arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + '></body></html>');
	return arr.join('');
}

function _iframeVal(val) {
	var self = this,
		body = self.doc.body;
	if (val === undefined) {
		return _node(body).html();
	} else {
		_node(body).html(val);
		return self;
	}
}

function _textareaVal(val) {
	var self = this,
		textarea = self.textarea;
	if (val === undefined) {
		return textarea.val();
	} else {
		textarea.val(val);
		return self;
	}
}

function _edit(expr, options) {
	var srcElement = _node(expr),
		designMode = options.designMode === undefined ? true : options.designMode,
		bodyClass = options.bodyClass,
		css = options.css;
	function srcVal(val) {
		return srcElement.hasVal() ? srcElement.val(val) : srcElement.html(val);
	}
	var obj = {

		width : options.width || 0,
		height : options.height || 0,
		html : function(val) {
			this.val(val);
		},
		val : function(val) {
			if (designMode) {
				return _iframeVal.call(this, val);
			} else {
				return _textareaVal.call(this, val);
			}
		},
		create : function() {
			var self = this;
			var textarea = _node('<textarea class="ke-textarea"></textarea>');
			textarea.css({
				display : 'block',
				width : self.width,
				height : self.height
			});
			srcElement.before(textarea);
			self.textarea = textarea;
			srcElement.hide();
			return self;
		},
		remove : function() {
			var self = this,
				textarea = self.textarea;
			srcElement.show();
			textarea.remove();
			self.textarea = null;
			return self;
		},
		toggle : function(bool) {
			var self = this,
				iframe = self.iframe,
				textarea = self.textarea;
			if (!iframe) {
				return self;
			}
			if (bool === undefined ? !designMode : bool) {
				if (!designMode) {
					textarea.hide();
					_iframeVal.call(self, _textareaVal.call(self));
					iframe.show();
					designMode = true;
				}
			} else {
				if (designMode) {
					iframe.hide();
					_textareaVal.call(self, _iframeVal.call(self));
					textarea.show();
					designMode = false;
				}
			}
			return self;
		},
		toDesign : function() {
			return this.toggle(true);
		},
		toSource : function() {
			return this.toggle(false);
		},
		focus : function() {
			var self = this;
			if (self.iframe && designMode) {
				self.iframe.contentWindow.focus();
			}
			return self;
		},
		oninput : function(fn) {
			var self = this,
				doc = self.doc,
				body = doc.body;
			_node(doc).bind('keyup', function(e) {
				if (!e.ctrlKey && !e.altKey && (e.keyCode < 16 || e.keyCode > 18) && e.keyCode != 116) {
					fn(e);
					e.stop();
				}
			});
			function timeoutHandler(e) {
				setTimeout(function() {
					fn(e);
				}, 1);
			}
			_node(body).bind('paste', timeoutHandler);
			_node(body).bind('cut', timeoutHandler);
			return self;
		}
	};
	return obj;
}

K.edit = _edit;

var _K = K;

K = function(options) {

};

_each(_K, function(key, val) {
	K[key] = val;
});

if (window.K === undefined) {
	window.K = K;
}
window.KindEditor = K;

})(window);
