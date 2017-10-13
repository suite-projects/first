function open_search(num){
	if(!$('#dialog').length) {
		$('body').append("<div id='dialog' style='display:none;'></div>");
	}
	$("#dialog").dialog({
		title: '顧客検索',
		autoOpen: false,
		modal: true,
		resizable: true,
		width: 580,
		height:300,
		dialogClass: '',
    buttons:{"キャンセル":function(event) {$(this).dialog("close");}}
	});
	$("#dialog").findmember("open",{mno: num});
}

function findmember_Search(num){
	if(!$('#dialog').length) {
		$('body').append("<div id='dialog' style='display:none;'></div>");
	}

	$("#dialog").findmember("search",{mno: num});
}

(function( $, undefined ) {
	$.extend($.ui, {findmember: {version: "1.0.0"}});
	var myuuid = new Date().getTime();

	function FindMember() {
    var url = location.href;
    var tmp = url.split("/");
    tmp.pop();
    this.BaseUrl = tmp.join("/");
		this.mainPanel = null;
    this.mesId = "";
    this.mesTel = "";
		$.ajaxSetup({
			async: false,
			type: 'POST'
		});
	}
	$.extend(FindMember.prototype, {
		_attachUtil: function(settings) {
      this.Target = $("#name_"+settings["mno"]);
      this.mesId = settings["mno"];
      this.mesTel = $("#tel_"+settings["mno"]);
			this.dlgDiv = bindHover($("#"+this.mainPanel));
			this._getBaseHtml();
			this.dlgDiv.dialog("open");
			this._updateUtil();
		},
		_getBaseHtml: function(){
			this.dlgDiv.load(this.BaseUrl+"/?page=connect&act=mfbase",{id:myuuid});
		},
		_setLoading: function(){
			$("#selector-list-body").empty();
			var html = "";
			html  = '<tr><td colspan="2">';
			html += '<div class="nowloading" style="width: 100%;height: 100px;background-color: transparent;">';
			html += '</div></td></tr>';
			$("#selector-list-body").empty().append(html);
			$("#selector-list-body .nowloading").activity({segments: 18, width: 5.5, space: 6, length: 13, color: '#255525', speed: 1.5});
		},
		_updateUtil: function() {
			this._setLoading();
			this._generateHTML();
			var cover = this.dlgDiv.find('iframe.ui-findmember-cover'); // IE6- only
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
				sname: $("#JQ"+myuuid+"_sname").val(),
				stel: $("#JQ"+myuuid+"_stel").val()
			};
			$.ajax({
				url: this.BaseUrl+"/?page=connect&act=mfsearch",
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
				html += "<tr onclick=\"JQ"+myuuid+".findmember.setRefValue('"+e[i].id+"');\">";
				html += "<td style='white-space:auto;text-align:left;padding-left:5px;'>"+e[i].name+"</td>";
				html += "<td style='white-space:auto;text-align:left;padding-left:5px;'>"+e[i].tel+"</td>";
				html += "</tr>";
			}
			if(json.error != ""){
				html += "<tr>";
				html += "<td colspan='2'>"+json.error+"</td>";
				html += "</tr>";
			}
			$("#selector-list-body").empty().append(html);
		},
		setRefValue: function(no){
			alert(no);alert(this.mesId);alert(this.mesTel);
			var PostData = {memid:no,mesid:this.mesId};
			$.ajax({
				url: this.BaseUrl+"/?page=connect&act=execon",
				data:PostData,
				async: true,
				context:this,
				dataType:"text",
				success:this._setName
			});
			this._close();
		},
		_open: function(){
			this.dlgDiv.dialog("open");
		},
		_close: function(){
			this.dlgDiv.dialog("close");
		},
		_setName: function(data, status, xhr){
			alert(data);
            this.Target.html(data);
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
	$.fn.findmember = function(options){
		//if ( !this.length ) {return this;}
		$.findmember.mainPanel = this.attr("id");
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		switch(options){
			case "open":
				$.findmember._attachUtil(otherArgs[0]);
				break;
			default:
				$.findmember._attachUtil(options);
				break;
		}
	}
	$.findmember = new FindMember(); // singleton instance
	$.findmember.initialized = false;
	$.findmember.uuid = new Date().getTime();
	window['JQ' + myuuid] = $;
})(jQuery);

  function getUrlParameters(parameter, staticURL, decode){
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;
        }
   }
   
   if(!returnBool) return false;
  }
