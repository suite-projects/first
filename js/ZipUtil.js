function ziputil_ZipSearch(target){
	if(!$('#dialog').length) {
		$('body').append("<div id='dialog' style='display:none;'></div>");
	}
	$("#dialog").dialog({
		title: '郵便番号検索',
		autoOpen: false,
		modal: true,
		resizable: true,
		width: 500,
		height:300,
		dialogClass: ''
	});
	$("#dialog").ziputil("getzip",{setTarget: target});
}

function ziputil_AddrSearch(target){
	if(!$('#dialog').length) {
		$('body').append("<div id='dialog' style='display:none;'></div>");
	}

	$("#dialog").ziputil("getaddr",{setTarget: target});
}

(function( $, undefined ) {
	$.extend($.ui, {ziputil: {version: "1.0.0"}});
	var myuuid = new Date().getTime();

	function ZipUtil() {
		this._defaults = {
			getTarget: 7,
			getInit: 0,
			setTarget: null,
			addr1: null,
			addr2: null,
			addr3: null
		};
		this.mainPanel = null;

		$.ajaxSetup({
			async: false,
			type: 'POST'
		});
	}
	$.extend(ZipUtil.prototype, {
		_attachZipUtil: function(settings) {
			this.dlgDiv = bindHover($("#"+this.mainPanel));
			var target = $("#"+settings["setTarget"]);
			this._getSetting(target,settings);
			this._getBaseHtml();
			this.dlgDiv.dialog("open");
			this._updateZipUtil();
		},
		_getSetting: function(target,settings){
			if(!target){
				alert("prease setting setTarget!");
				return ;
			}

			var inlineSettings = null;
			var opt = $("#"+target.attr('id')+"_param");
			if(opt){
				try {
					inlineSettings = $.parseJSON(opt.html());
				} catch (err) {
					inlineSettings = null;
				}
			}

			this.settings = $.extend(this.settings || {}, settings || {}, inlineSettings || {});
		},
		_getBaseHtml: function(){
			this.dlgDiv.load("/ajax/selectorbase",{id:myuuid,mode:10});
		},
		_setLoading: function(){
			$("#selector-list-body").empty();
			var html = "";
			html  = '<tr><td colspan="3">';
			html += '<div class="nowloading" style="width: 100%;height: 200px;background-color: transparent;">';
			html += '</div></td></tr>';
			$("#selector-list-body").empty().append(html);
			$("#selector-list-body .nowloading").activity({segments: 18, width: 5.5, space: 6, length: 13, color: '#255525', speed: 1.5});
		},
		_updateZipUtil: function() {
			this._setLoading();
			this._generateHTML();
			var cover = this.dlgDiv.find('iframe.ui-ziputil-cover'); // IE6- only
			if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
				cover.css({
					left: -borders[0],
					top: -borders[1],
					width: this.dlgDiv.outerWidth(),
					height: this.dlgDiv.outerHeight()
					})
			}
			return true;
		},
		_set: function(name,myval) {
			this.settings[name] = myval;
		},
		_get: function(name) {
			return this.settings[name] !== undefined ?this.settings[name] : this._defaults[name];
		},
		/* Generate the HTML for the current state of the date picker. */
		_generateHTML: function() {
			var PostData = {
				saddr: $("#jQ"+myuuid+"_saddr").val(),
				szip: $("#jQ"+myuuid+"_szip").val()
			};
			$.ajax({
				url: "/ajax/addrlist",
				data:PostData,
				async: true,
				dataType:"json",
				success:this._getJson
			});
		},
		_getJson: function(json, status, xhr){
			var html = "";

			var e = json.data;

			for(var i = 0; i < e.length; i++) {
				html += "<tr onclick=\"ZU_jQuery_"+myuuid+".ziputil.setRefValue('"+e[i].id+"');\">";
				html += "<td>"+e[i].zip+"</td>";
				html += "<td style='white-space:aauto;'>"+e[i].addr+"</td>";
				html += "<td style='white-space:aauto;'>"+e[i].kana+"</td>";
				html += "</tr>";
			}
			
			if(json.error != ""){
				html += "<tr>";
				html += "<td colspan='3'>"+json.error+"</td>";
				html += "</tr>";
			}

			$("#selector-list-body").empty().append(html);

		},
		setRefValue: function(no){
			var PostData = {mode:1,useid:no};
			$.ajax({
				url: "/ajax/getid2addr",
				data:PostData,
				async: true,
				context:this,
				dataType:"json",
				success:this._setAddr
			});

			this._close();
		},
		_open: function(){
			this.dlgDiv.dialog("open");
		},
		_close: function(){
			this.dlgDiv.dialog("close");
		},
		_getAddr: function(settings){
			var target = $("#"+settings["setTarget"]);
			this._getSetting(target,settings);

			var PostData = {zipcode: target.val()};
			$.ajax({
				url: "/ajax/getzip2addr",
				data:PostData,
				async: true,
				context:this,
				dataType:"json",
				success:this._setAddr
			});
		},
		_setAddr: function(json, status, xhr){
			if(isFinite(json.id)){
				var ret = $(json).toArray();
				if(ret.length > 0){
					var myval = ret[0];
				}else{
					alert("該当する住所がありません");
				}

				$("#"+this._get("setTarget")).val(json.zip);

				var getval = new Array("addr1");
				for(var i = 0;i < getval.length;i++){
					if($("#"+this._get(getval[i]))){
						if(myval[getval[i]] != ""){
							$("#"+this._get(getval[i])).val(myval[getval[i]]);
						}
					}
				}
			}
		}
	});
	function bindHover(dlgDiv) {
		var selector = '.selector-list tbody tr';
		return dlgDiv.delegate(selector, 'mouseout', function() {
			$(this).removeClass('state-hover');
		})
		.delegate(selector, 'mouseover', function(){
			$(this).addClass('state-hover');
		});
	}
	$.fn.ziputil = function(options){
		//if ( !this.length ) {return this;}
		$.ziputil.mainPanel = this.attr("id");
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		switch(options){
			case "getaddr":
				$.ziputil._getAddr(otherArgs[0]);
				break;
			case "getzip":
				$.ziputil._attachZipUtil(otherArgs[0]);
				break;
			default:
				$.ziputil._attachZipUtil(options);
				break;
		}
	}
	$.ziputil = new ZipUtil(); // singleton instance
	$.ziputil.initialized = false;
	$.ziputil.uuid = new Date().getTime();
	window['ZU_jQuery_' + myuuid] = $;
})(jQuery);
