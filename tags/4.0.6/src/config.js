
function _getBasePath() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (/kindeditor[\w\-\.]*\.js/.test(src)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
}

K.basePath = _getBasePath();

K.options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : false,
	wellFormatMode : true,
	shadowMode : true,
	loadStyleMode : true,
	basePath : K.basePath,
	themesPath : K.basePath + 'themes/',
	langPath : K.basePath + 'lang/',
	pluginsPath : K.basePath + 'plugins/',
	themeType : 'default', // default, simple
	langType : 'zh_CN',
	urlType : '', // "", relative, absolute, domain
	newlineTag : 'p', // p, br
	resizeType : 2, // 0, 1, 2
	syncType : 'form', // "", form
	pasteType : 2, // 0:none, 1:text, 2:HTML
	dialogAlignType : 'page', // page, editor
	useContextmenu : true,
	bodyClass : 'ke-content',
	indentChar : '\t', // \t, "  "
	cssPath : '', //String or Array
	cssData : '',
	minWidth : 650,
	minHeight : 100,
	minChangeSize : 5,
	items : [
		'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste',
		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
		'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'map', 'code', 'pagebreak', 'anchor', 'link', 'unlink', '|', 'about'
	],
	noDisableItems : ['source', 'fullscreen'],
	colorTable : [
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	fontSizeTable : ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
	htmlTags : {
		font : ['color', 'size', 'face', '.background-color'],
		span : [
			'.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
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
			'.width', '.height', '.border-collapse'
		],
		'td,th': [
			'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
		],
		a : ['href', 'target', 'name'],
		embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
		img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		pre : ['class'],
		hr : ['class', '.page-break-after'],
		'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : []
	},
	layout : '<div class="container"><div class="toolbar"></div><div class="edit"></div><div class="statusbar"></div></div>'
};
