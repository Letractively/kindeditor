
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
/**
	@example
	K.lang('about'); //get core.about
	K.lang('about.version'); // get about.version
	K.lang('about.').version; // get about.version
	K.lang('about', 'en'); //get English core.about
	K.lang({
		core.about : '关于',
		about.version : '4.0'
	}, 'zh_CN'); //add language
*/
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
			e.preventDefault();
		}
	});
}

function _removeBookmarkTag(html) {
	return _trim(html.replace(/<span [^>]*id="__kindeditor_bookmark_\w+_\d+__"[^>]*><\/span>/i, ''));
}

function _addBookmarkToStack(stack, bookmark) {
	if (stack.length === 0) {
		stack.push(bookmark);
		return;
	}
	var prev = stack[stack.length - 1];
	if (_removeBookmarkTag(bookmark.html) !== _removeBookmarkTag(prev.html)) {
		stack.push(bookmark);
	}
}

// undo: _undoToRedo.call(this, undoStack, redoStack);
// redo: _undoToRedo.call(this, redoStack, undoStack);
function _undoToRedo(fromStack, toStack) {
	var self = this, edit = self.edit, range, bookmark;
	if (fromStack.length === 0) {
		return self;
	}
	if (edit.designMode) {
		range = self.cmd.range;
		bookmark = range.createBookmark(true);
		bookmark.html = edit.html();
	} else {
		bookmark = {
			html : edit.html()
		};
	}
	_addBookmarkToStack(toStack, bookmark);
	var prev = fromStack.pop();
	if (_removeBookmarkTag(bookmark.html) === _removeBookmarkTag(prev.html) && fromStack.length > 0) {
		prev = fromStack.pop();
	}
	if (edit.designMode) {
		edit.html(prev.html);
		if (prev.start) {
			range.moveToBookmark(prev);
			self.select();
		}
	} else {
		edit.html(_removeBookmarkTag(prev.html));
	}
	return self;
}

function KEditor(options) {
	var self = this;
	// save original options
	self.config = {};
	function setOption(key, val) {
		self[key] = val;
		self.config[key] = val;
	}
	// set options from param
	_each(options, function(key, val) {
		setOption(key, options[key]);
		if (key === 'scriptPath') {
			setOption('themesPath', options[key] + 'themes/');
			setOption('langPath', options[key] + 'lang/');
			setOption('pluginsPath', options[key] + 'plugins/');
		}
	});
	// set options from default setting
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
	self.plugin = {};
	// private properties
	self._handlers = {};
	self._contextmenus = [];
	self._undoStack = [];
	self._redoStack = [];
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
		_getScript(self.pluginsPath + name + '/' + name + '.js?ver=' + encodeURIComponent(_VERSION), function() {
			if (_plugins[name]) {
				self.loadPlugin(name, fn);
			}
		});
		return self;
	},
	handler : function(key, fn) {
		var self = this;
		if (!self._handlers[key]) {
			self._handlers[key] = [];
		}
		if (_isFunction(fn)) {
			self._handlers[key].push(fn);
			return self;
		}
		_each(self._handlers[key], function() {
			fn = this.call(self, fn);
		});
		return fn;
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
	updateState : function() {
		var self = this;
		_each(('justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,insertunorderedlist,' +
			'subscript,superscript,bold,italic,underline,strikethrough').split(','), function(i, name) {
			self.state(name) ? self.toolbar.select(name) : self.toolbar.unselect(name);
		});
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
	afterGetHtml : function(fn) {
		return this.handler('afterGetHtml', fn);
	},
	beforeSetHtml : function(fn) {
		return this.handler('beforeSetHtml', fn);
	},
	create : function() {
		var self = this, fullscreenMode = self.fullscreenMode;
		if (fullscreenMode) {
			_docElement().style.overflow = 'hidden';
		} else {
			_docElement().style.overflow = 'auto';
		}
		var width = fullscreenMode ? _docElement().clientWidth + 'px' : self.width,
			height = fullscreenMode ? _docElement().clientHeight + 'px' : self.height;
		// 校正IE6和IE7的高度
		if ((_IE && _V < 8) || document.compatMode != 'CSS1Compat') {
			height = _addUnit(_removeUnit(height) + 2);
		}
		var container = K('<div class="ke-container"></div>').css('width', width);
		if (fullscreenMode) {
			container.css({
				position : 'absolute',
				left : 0,
				top : 0,
				'z-index' : 811211
			});
			K(document.body).append(container);
			// 为了防止拖动偏移，把文档高度设置成0
			self._scrollPos = _getScrollPos();
			window.scrollTo(0, 0);
			K(document.body).css({
				'height' : 0,
				'overflow' : 'hidden'
			});
			K(document.body.parentNode).css('overflow', 'hidden');
		} else {
			self.srcElement.before(container);
			// 恢复文档高度
			if (self._scrollPos) {
				K(document.body).css({
					'height' : '',
					'overflow' : ''
				});
				K(document.body.parentNode).css('overflow', '');
				window.scrollTo(self._scrollPos.x, self._scrollPos.y);
			}
		}
		// create toolbar
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
					e.stopPropagation();
					self.clickToolbar(name);
				}
			});
		});
		// create edit
		var edit = _edit({
			height : _removeUnit(height) - toolbar.div.height(),
			parent : container,
			srcElement : self.srcElement,
			designMode : self.designMode,
			themesPath : self.themesPath,
			bodyClass : self.bodyClass,
			cssPath : self.cssPath,
			cssData : self.cssData,
			afterGetHtml : function(html) {
				html = self.afterGetHtml(html);
				return _formatHtml(html, self.filterMode ? self.htmlTags : null, self.urlType, self.wellFormatMode);
			},
			beforeSetHtml : function(html) {
				html = self.beforeSetHtml(html);
				return html;
			},
			afterCreate : function() {
				self.cmd = this.cmd;
				// hide menu when click document
				K(this.doc, document).mousedown(function(e) {
					if (self.menu) {
						self.hideMenu();
					}
				});
				_bindContextmenuEvent.call(self);
				// add bookmark to undoStack
				self.addBookmark();
				self.cmd.oninput(function(e) {
					self.addBookmark();
				}).onchange(function(e) {
					self.updateState();
				});
				self.afterCreate();
			}
		});
		// create statusbar
		var statusbar = K('<div class="ke-statusbar"></div>');
		container.append(statusbar);
		statusbar.append('<span class="ke-inline-block ke-statusbar-center-icon"></span>')
		.append('<span class="ke-inline-block ke-statusbar-right-icon"></span>');
		// set properties
		self.container = container;
		self.toolbar = toolbar;
		self.edit = edit;
		self.statusbar = statusbar;
		self.menu = self.contextmenu = null;
		self.dialogs = [];
		// remove resize event
		K(window).unbind('resize');
		// reset size
		self.resize(width, height);
		// 为了限制宽度和高度，包装self.resize
		function resize(width, height, updateProp) {
			updateProp = _undef(updateProp, true);
			if (width && width >= self.minWidth) {
				self.resize(width, null);
				if (updateProp) {
					self.width = _addUnit(width);
				}
			}
			if (height && height >= self.minHeight) {
				self.resize(null, height);
				if (updateProp) {
					self.height = _addUnit(height);
				}
			}
		}
		// fullscreen mode
		if (fullscreenMode) {
			K(window).bind('resize', function(e) {
				if (self.container) {
					resize(_docElement().clientWidth, _docElement().clientHeight, false);
				}
			});
			toolbar.select('fullscreen');
			statusbar.first().css('visibility', 'hidden');
			statusbar.last().css('visibility', 'hidden');
		} else {
			// bind drag event
			_drag({
				moveEl : container,
				clickEl : statusbar,
				moveFn : function(x, y, width, height, diffX, diffY) {
					height += diffY;
					resize(null, height);
				}
			});
			_drag({
				moveEl : container,
				clickEl : statusbar.last(),
				moveFn : function(x, y, width, height, diffX, diffY) {
					width += diffX;
					height += diffY;
					resize(width, height);
				}
			});
		}
		return self;
	},
	remove : function() {
		var self = this;
		if (self.menu) {
			self.hideMenu();
		}
		_each(self.dialogs, function() {
			self.hideDialog();
		});
		self.toolbar.remove();
		self.edit.remove();
		self.statusbar.last().remove();
		self.statusbar.remove();
		self.container.remove();
		self.container = self.toolbar = self.edit = self.menu = null;
		self.dialogs = [];
		return self;
	},
	resize : function(width, height) {
		var self = this;
		if (width !== null) {
			self.container.css('width', _addUnit(width));
		}
		if (height !== null) {
			height = _removeUnit(height) - self.toolbar.div.height() - self.statusbar.height();
			if (height > 0) {
				self.edit.setHeight(height);
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
		key = key.toLowerCase();
		var self = this, cmd = self.cmd;
		cmd[key].apply(cmd, _toArray(arguments, 1));
		// 下面命令不改变HTML内容，所以不需要改变工具栏状态，也不需要保存bookmark
		if (_inArray(key, 'selectall,copy,paste,print'.split(',')) < 0) {
			self.updateState();
			self.addBookmark();
		}
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
		var self = this, edit = self.edit, bookmark;
		if (edit.designMode) {
			var range = self.cmd.range;
			bookmark = range.createBookmark(true);
			bookmark.html = edit.html();
			range.moveToBookmark(bookmark);
		} else {
			bookmark = {
				html : edit.html()
			};
		}
		if (self._undoStack.length > 0) {
			var prev = self._undoStack[self._undoStack.length - 1];
			if (Math.abs(bookmark.html.length -  prev.html.length) < self.minChangeSize) {
				return self;
			}
		}
		_addBookmarkToStack(self._undoStack, bookmark);
		return self;
	},
	undo : function() {
		return _undoToRedo.call(this, this._undoStack, this._redoStack);
	},
	redo : function() {
		return _undoToRedo.call(this, this._redoStack, this._undoStack);
	},
	fullscreen : function(bool) {
		var self = this;
		self.fullscreenMode = (bool === undefined ? !self.fullscreenMode : bool);
		return self.remove().create();
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
		var self = this, name = options.name;
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
		if (self.dialogs.length > 0) {
			var firstDialog = self.dialogs[0],
				parentDialog = self.dialogs[self.dialogs.length - 1];
			// 提高mask的z-index
			firstDialog.mask.div.css('z-index', parentDialog.z + 1);
			// 提高dialog的z-index
			options.z = parentDialog.z + 2;
			// 不显示mask
			options.showMask = false;
		}
		var dialog = _dialog(options);
		self.dialogs.push(dialog);
		return dialog;
	},
	hideDialog : function() {
		var self = this;
		if (self.dialogs.length > 0) {
			self.beforeHideDialog();
			self.dialogs.pop().remove();
		}
		if (self.dialogs.length > 0) {
			var firstDialog = self.dialogs[0],
				parentDialog = self.dialogs[self.dialogs.length - 1];
			// 降低mask的z-index
			firstDialog.mask.div.css('z-index', parentDialog.z - 1);
		} else {
			self.cmd.select();
		}
		return self;
	}
};

/**
	@example
	K.create('textarea');
	K.create('textarea.class');
	K.create('#id');
*/
function _create(expr, options) {
	options = options || {};
	function create(editor) {
		_each(_plugins, function(name, fn) {
			fn.call(editor, KindEditor);
		});
		return editor.create();
	}
	var knode = K(expr);
	if (!knode) {
		return;
	}
	options.srcElement = knode[0];
	if (!options.width) {
		options.width = knode.width();
	}
	if (!options.height) {
		options.height = knode.height();
	}
	var editor = new KEditor(options);
	// create editor
	if (_language[editor.langType]) {
		return create(editor);
	}
	// create editor after load lang file
	_getScript(editor.langPath + editor.langType + '.js?ver=' + encodeURIComponent(_VERSION), function() {
		return create(editor);
	});
	return editor;
}

// 解决IE6浏览器重复下载背景图片的问题
if (_IE && _V < 7) {
	_nativeCommand(document, 'BackgroundImageCache', true);
}

K.create = _create;
K.plugin = _plugin;
K.lang = _lang;

