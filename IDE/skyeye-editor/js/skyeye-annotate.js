$(function() {
	var skyeye_setting = [];
	var skyeyeAnnotate = function(ele, opt) {
		this.defaults = { //defaults 是我们设置的默认参数。
			id: null,
			width: '200', //批注默认宽度
			userName: 'skyeye', //添加批注的人
			userImage: 'skyeye-editor/images/no-userphoto.png', //添加批注人的logo
			data: [], //默认回显的数据
			selectedElem: null, //当前选中的文本对象
			addIconSrc: 'skyeye-editor/images/add-icon.png', //新增批注的图标
			whetherLoadData: false, //是否已经加载数据，根据数据的数量进行判断
			resetContentBox: true, //是否重置左侧内容宽度
			annotateId: null, //右侧批注的id
		};
		this.settings = $.extend({}, this.defaults, opt);
	}
	skyeyeAnnotate.prototype = {
		_id: null,
		_op: null,
		$this: null,
		init: function() {
			_id = this.settings.id;
			$this = $("#" + _id);
			_op = this;
			this.create();
		},

		// 加载事件
		create: function() {
			// 空白处点击事件
			$(document).click(function(event) {
				if($((event.target || event.srcElement)).closest(".show-editor,#annotateIcon,.show-content").length == 0) {
					// 过滤非加载项
					var setting = getObject(_id);
					if($("#" + setting.annotateId) && $("#" + setting.annotateId).length > 0) {
						// 移除标注box选中的特效
						$("#" + setting.annotateId).find(".new-skyeye-anno-box").removeClass("hover");
						_op.resetData();
						$this.find(".selectClass").css({
							"background-color": "lightcyan"
						});
					}
				}
			});

			$this.mouseup(function(e) {
				var selectedText = _op.getSelectText();
				var addIconSrc = 'skyeye-editor/images/add-icon.png';
				if(getObject(_id).addIconSrc) {
					addIconSrc = getObject(_id).addIconSrc;
				}
				$("#annotateIcon").unbind("click");
				var addIcon = '<div id="annotateIcon" style="display: none; position: absolute;" title="添加批注"><img src="' + addIconSrc + '" class="skyeyetipsIcon filter"></div>';
				$this.append(addIcon);
				if(selectedText) {
					$("#annotateIcon").css({
						"left": e.offsetX + 1,
						"top": e.offsetY - 30
					}).fadeIn(300);
					_op.addAnnotateIcon();
				} else {
					$this.find("div[id='annotateIcon']").remove();
				}
				_op.setSettings(_id, {
					selectedElem: e
				});
			});
			
			// 初始化数据
			_op.initData();
		},

		// 添加批注按钮事件
		addAnnotateIcon: function() {
			$("#annotateIcon").hover(function() {
				$(this).children().removeClass("filter");
			}, function() {
				$(this).children().addClass("filter");
			}).click(function() {
				$("#annotateIcon").unbind("click");
				$this.find("div[id='annotateIcon']").remove();
				_op.addAnnoTate();
			});
		},

		// 添加批注
		addAnnoTate: function() {
			// 1.加载右侧box
			_op.resetAddAnnotateBox();
			// 2.添加批注框
			_op.addAnnotateBox();
		},

		// 添加右侧box
		resetAddAnnotateBox: function() {
			var setting = getObject(_id);
			// 判断是否需要重新加载批注宽度设置内容的宽度
			if(!setting.whetherLoadData) {
				if(setting.resetContentBox) {
					// 设置当前content的宽度
					var con_width = $this.outerWidth(true);
					var annoTate_width = parseInt(setting.width);
					$this.css({
						"width": (con_width - annoTate_width - 20) + 'px'
					});
				}
				$this.css({
					"float": 'left'
				});
				var con_height = $this.height();
				// 获取批注框的大box的id
				var annotateId = _op.getRandomId();
				var annotateBox = '<div class="annotate-box" id="' + annotateId + '" style="width: ' + annoTate_width + 'px; height: ' + con_height + 'px;"></div>';
				$this.after(annotateBox);
				_op.setSettings(_id, {
					whetherLoadData: true,
					annotateId: annotateId
				});
				// 设置内容点击事件
				$("#" + annotateId).on("click", ".show-content", function(e){
					$(this).hide();
					$(this).parent().find(".show-editor").html($(this).html());
					$(this).parent().find(".show-editor").show();
					$(this).parent().find(".show-editor").focus();
				});
				
				// 设置批注点击事件
				$("#" + annotateId).on("click", ".new-skyeye-anno-box", function(e){
					$(this).parent().find(".new-skyeye-anno-box").removeClass("hover");
					$(this).addClass("hover");
					$this.find(".selectClass").css({
						"background-color": "lightcyan"
					});
					var insId = $(this).attr("insId");
					$("." + insId).css({
						"background-color": "cyan"
					});
				});
			}
		},

		// 添加批注框
		addAnnotateBox: function() {
			var setting = getObject(_id);
			console.log(setting.selectedElem)
			// 选中的内容
			var selectText = _op.getSelectText();
			// 选中内容的开始位置
			var startAdd = window.getSelection().anchorOffset;
			// 选中内容的结束位置
			var endAdd = window.getSelection().extentOffset;
			var insId = (new Date().getTime());
			var boxId = _op.getRandomId();
			// 设置文字选中
			_op.setTextChoose(selectText, startAdd, endAdd, insId);
			var box = _op.getNowSkyeyeAnnoBox({
				selectText: selectText,
				startAdd: startAdd,
				endAdd: endAdd,
				annoId: boxId,
				insId: insId,
				userImage: setting.userImage,
				userName: setting.userName,
				annoTateContent: '',
				marginTop: (setting.selectedElem.pageY - 80) + 'px',
				createDate: _op.getNowDate()
			});
			$("#" + setting.annotateId).append(box);
			$("#" + boxId).find(".show-editor").show();
			$("#" + boxId).find(".show-editor").focus();
			$("#" + boxId).find(".show-content").hide();
		},
		
		// 获取批注框html
		getNowSkyeyeAnnoBox: function(params){
			return '<div class="new-skyeye-anno-box" data-text="' + params.selectText + '" data-zIndex="99999" startAdd="' + params.startAdd 
						+ '" endAdd="' + params.endAdd + '" id="' + params.annoId + '" '
						+ ' insId="' + params.insId + '" style="z-index: 99999; margin-top:' + params.marginTop + '">' +
						'<div class="anno-title">' +
							'<img src="' + params.userImage + '" class="anno-user-img"/>' +
							'<font class="anno-user-name">' + params.userName + '</font>' +
							'<font class="anno-time">' + params.createDate + '</font>' +
						'</div>' +
						'<div class="anno-content">' +
							'<div class="show-content" style="display: none">' + params.annoTateContent + '</div>' +
							'<div class="show-editor" contenteditable="true">' + params.annoTateContent + '</div>' +
						'</div>' +
					'</div>';
		},
		
		// 获取选中的文本
		getSelectText: function(){
			var selectedText;
			if(window.getSelection) {
				selectedText = window.getSelection().toString();
			} else if(document.selection && document.selection.createRange) {
				selectedText = document.selection.createRange().text;
			}
			return selectedText;
		},
		
		// 刷新数据
		resetData: function(){
			var data = new Array();
			var setting = getObject(_id);
			$.each($this.find(".selectClass"), function(i, item){
				var insId = $.trim($(this).attr("class").replace("selectClass", ""));
				var _this = $('div[insId="' + insId + '"]');
				var editorContent = _this.find(".show-editor").html();
				if(_op.checkIsNull(editorContent)){
					// 取消文字选中
					_op.cancleTextChoose(_this.attr("insId"), _this.data("text"));
					// 如果内容为空则移除
					_this.remove();
				}else{
					_this.find(".show-editor").hide();
					_this.find(".show-content").show();
					_this.find(".show-content").html(editorContent);
					var zIndex = (i + 1);
					_this.css({
						"z-index": zIndex
					});
					var ss = {
						selectText: _this.data("text"),
						annoTateContent: editorContent,
						annoId: _this.attr("id"),
						zIndex: zIndex,
						startAdd: _this.attr("startAdd"),
						endAdd: _this.attr("endAdd"),
						insId: _this.attr("insId"),
						userImage: _this.find(".anno-user-img").attr("src"),
						userName: _this.find(".anno-user-name").html(),
						createDate: _this.find(".anno-time").html(),
						marginTop: _this.offset().top
					};
					data.push(ss);
				}
			});
			// 判断是否有批注
			if($("#" + setting.annotateId).find(".new-skyeye-anno-box").length == 0){
				_op.removeAnnoTateBox();
			}
			_op.setSettings(_id, {
				data: data
			});
			// 重置批注列表信息
			_op.resetAnnoBox();
		},
		
		// 初始化数据
		initData: function(){
			var setting = getObject(_id);
			if(setting.data.length > 0){
				// 1.加载右侧box
				_op.resetAddAnnotateBox();
				// 重新获取配置信息
				setting = getObject(_id);
				// 2.加载数据批注框
				_op.initDataBox(setting.annotateId, setting.data);
			}
		},
		
		// 加载数据批注框
		initDataBox: function(annotateId, data){
			rangy.init();
			$.each(data, function(i, item){
				var box = _op.getNowSkyeyeAnnoBox({
					selectText: item.selectText,
					startAdd: item.startAdd,
					endAdd: item.endAdd,
					annoId: item.annoId,
					insId: item.insId,
					userImage: item.userImage,
					userName: item.userName,
					annoTateContent: item.annoTateContent,
					createDate: item.createDate,
					marginTop: item.marginTop + 'px',
				});
				$("#" + annotateId).append(box);
				var childNodes = document.getElementById($this.attr("id")).childNodes;
				_op.recursionLoadChoose(item, childNodes, 1);
			});
			window.getSelection().removeAllRanges();
			$("#" + annotateId).find(".show-editor").hide();
			$("#" + annotateId).find(".show-content").show();
		},
		
		// 递归设置选中
		recursionLoadChoose: function(item, childNodes, type){
			if(type == 1){
				_op.loadRange(childNodes[0], item);
				childNodes = document.getElementById($this.attr("id")).childNodes;
			}
			// 设置选中内容背景
			$.each(childNodes, function(i, startNode){
				if(_op.loadRange(startNode, item)){
					_op.recursionLoadChoose(item, document.getElementById($this.attr("id")).childNodes, 2);
					return false;
				}
			});
		},
		
		loadRange: function(startNode, item){
			if(startNode.data && startNode.data.length > item.endAdd){
				window.getSelection().removeAllRanges();
				var range = _op.getRange();
				range.setStart(startNode, item.startAdd);
				range.setEnd(startNode, item.endAdd);
				window.getSelection().addRange(range);
				if(_op.getSelectText() == item.selectText){
					var cssApplier = rangy.createCssClassApplier("selectClass " + item.insId, true); 
					cssApplier.toggleSelection();
					return true;
				}
			}
			return false;
		},
		
		// 获取range对象
		getRange: function(){
			var range;
			if(document.selection){
				// IE
			  	range = document.body.createTextRange(); 
			} else if(window.getSelection){
				// others
			  	range = document.createRange(); 
			} 
			return range;
		},
		
		// 移除包含批注的大box
		removeAnnoTateBox: function(){
			var setting = getObject(_id);
			$("#" + setting.annotateId).remove();
			// 设置当前content的宽度
			var con_width = $this.outerWidth(true);
			var annoTate_width = parseInt(setting.width);
			$this.css({
				"width": (con_width + annoTate_width + 20) + 'px'
			});
			_op.setSettings(_id, {
				whetherLoadData: false,
				annotateId: ""
			});
		},
		
		// 重置批注列表信息
		resetAnnoBox: function(){
			var setting = getObject(_id);
			
		},

		// 获取随机id
		getRandomId: function(num) {　　
			num = num || 16;　　
			var str = "";
			// 循环产生随机数字串
			for(var i = 0; i < num; i++) {　　　　
				str += Math.floor(Math.random() * 10);　　
			}　　
			return str;
		},
		
		// 判断是否为空
		checkIsNull: function(content){
			if(content == "" || content == null){
				return true;
			}
			return false;
		},
		
		// 设置文字选中
		setTextChoose: function(contentText, start, end, insId){
			rangy.init();
			var cssApplier = rangy.createCssClassApplier("selectClass " + insId, true); 
			cssApplier.toggleSelection();
		},
		
		// 取消文字选中
		cancleTextChoose: function(insId, content){
			$("." + insId).prop("outerHTML", content);
		},
		
		// 获取当前时间
		getNowDate: function(){
			var myDate = new Date();
			// 获取当前年
			var year = myDate.getFullYear();
			// 获取当前月
			var month = myDate.getMonth() + 1;
			// 获取当前日
			var date = myDate.getDate();
			var h = myDate.getHours(); // 获取当前小时数(0-23)
			var m = myDate.getMinutes(); // 获取当前分钟数(0-59)
			var s = myDate.getSeconds();
			return year + '-' + _op.getNow(month) + "-" + _op.getNow(date) + " " + _op.getNow(h) + ':' + _op.getNow(m) + ":" + _op.getNow(s);
		},
		
		// 格式化数字为两位数
		getNow: function(s){
			return s < 10 ? '0' + s: s;
		},
		
		// 重置setting
		setSettings: function(id, opt) {
			var set = getObject(id);
			set = $.extend({}, set, opt);
			setObject(id, set);
		}
	}

	// 初始化加载批注插件
	$.fn.skyeyeAnnotate = function(options) {
		if(!$(this).attr("id")) {
			throw err = new Error('Not Find Id');
		}
		options.id = $(this).attr("id");
		var annotate = new skyeyeAnnotate(this, options);
		$.each(skyeye_setting, function(index, item) {
			if(!isNull(item)) {
				if(item.settings.id == skyeyeAnnotate.settings.id) {
					skyeye_setting.splice(index, 1);
					return;
				}
			}
		});
		skyeye_setting.push(_createObject(annotate.settings.id, annotate.settings));
		return this.each(function() {
			annotate.init();
		});
	}

	// 获取数据
	$.fn.getAnnotateData = function() {
		if(!$(this).attr("id")) {
			throw err = new Error('Not Find Id');
		}
		return getObject($(this).attr("id")).data;
	}

	// 创建新的批注对象
	var _createObject = function(id, settings) {
		var obj = {
			id: id,
			settings: settings
		};
		return obj;
	}

	// 获取批注对象
	var getObject = function(id) {
		for(var i of skyeye_setting) {
			if(i.id == id) {
				return i.settings;
			}
		}
	}

	// 重置批注对象中的settings
	var setObject = function(id, settings) {
		for(var i of skyeye_setting) {
			if(i.id == id) {
				i.settings = settings;
			}
		}
	}

});