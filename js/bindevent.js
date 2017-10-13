var TrustCodes = new Array( 8,9,13,37,38,39,40,46,109,110,189,190 );
for (var i = 0; i < 10; i++) {
	TrustCodes.push(i+48);
	TrustCodes.push(i+96);
}

jQuery(function($) {
	$.each($("input:text.num"),function(){
		$(this).bind("keydown",function(event){
			if($.inArray(event.keyCode, TrustCodes) >= 0 && !event.shiftKey && !event.ctrlKey && !event.altKey){
				return true;
			}else{
				return false;
			}
		});
	});
	$.each($(".txt"),function(){
		$(this).bind("focus",function(){
			$(this).select();
		});
	});
	$.each($(".input_error"),function(){
		$(this).bind("focus",function(){
			$(this).removeClass("input_error");
		});
	});
});
$(document).ready(function(){
(function($){$.fn.activity=function(opts){this.each(function(){var $this=$(this);var el=$this.data("activity");if(el){clearInterval(el.data("interval"));el.remove();$this.removeData("activity");}if(opts!==false){opts=$.extend({color:$this.css("color")},$.fn.activity.defaults,opts);el=render($this,opts).css("position","absolute").prependTo(opts.outside?"body":$this);var h=$this.outerHeight()-el.height();var w=$this.outerWidth()-el.width();var margin={top:opts.valign=="top"?opts.padding:opts.valign=="bottom"?h-opts.padding:Math.floor(h/2),left:opts.align=="left"?opts.padding:opts.align=="right"?w-opts.padding:Math.floor(w/2)};var offset=$this.offset();if(opts.outside){el.css({top:offset.top+"px",left:offset.left+"px"});}else{margin.top-=el.offset().top-offset.top;margin.left-=el.offset().left-offset.left;}el.css({marginTop:margin.top+"px",marginLeft:margin.left+"px"});animate(el,opts.segments,Math.round(10/opts.speed)/10);$this.data("activity",el);}});return this;};$.fn.activity.defaults={segments:12,space:3,length:7,width:4,speed:1.2,align:"center",valign:"center",padding:4};$.fn.activity.getOpacity=function(opts,i){var steps=opts.steps||opts.segments-1;var end=opts.opacity!==undefined?opts.opacity:1/steps;return 1-Math.min(i,steps)*(1-end)/steps;};var render=function(){return $("<div>").addClass("busy");};var animate=function(){};function svg(tag,attr){var el=document.createElementNS("http://www.w3.org/2000/svg",tag||"svg");if(attr){$.each(attr,function(k,v){el.setAttributeNS(null,k,v);});}return $(el);}if(document.createElementNS&&document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect){render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var el=svg().width(r*2).height(r*2);var g=svg("g",{"stroke-width":d.width,"stroke-linecap":"round",stroke:d.color}).appendTo(svg("g",{transform:"translate("+r+","+r+")"}).appendTo(el));for(var i=0;i<d.segments;i++){g.append(svg("line",{x1:0,y1:innerRadius,x2:0,y2:innerRadius+d.length,transform:"rotate("+(360/d.segments*i)+", 0, 0)",opacity:$.fn.activity.getOpacity(d,i)}));}return $("<div>").append(el).width(2*r).height(2*r);};if(document.createElement("div").style.WebkitAnimationName!==undefined){var animations={};animate=function(el,steps,duration){if(!animations[steps]){var name="spin"+steps;var rule="@-webkit-keyframes "+name+" {";for(var i=0;i<steps;i++){var p1=Math.round(100000/steps*i)/1000;var p2=Math.round(100000/steps*(i+1)-1)/1000;var value="% { -webkit-transform:rotate("+Math.round(360/steps*i)+"deg); }\n";rule+=p1+value+p2+value;}rule+="100% { -webkit-transform:rotate(100deg); }\n}";document.styleSheets[0].insertRule(rule);animations[steps]=name;}el.css("-webkit-animation",animations[steps]+" "+duration+"s linear infinite");};}else{animate=function(el,steps,duration){var rotation=0;var g=el.find("g g").get(0);el.data("interval",setInterval(function(){g.setAttributeNS(null,"transform","rotate("+(++rotation%steps*(360/steps))+")");},duration*1000/steps));};}}else{var s=$("<shape>").css("behavior","url(#default#VML)").appendTo("body");if(s.get(0).adj){var sheet=document.createStyleSheet();$.each(["group","shape","stroke"],function(){sheet.addRule(this,"behavior:url(#default#VML);");});render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var s=r*2;var o=-Math.ceil(s/2);var el=$("<group>",{coordsize:s+" "+s,coordorigin:o+" "+o}).css({top:o,left:o,width:s,height:s});for(var i=0;i<d.segments;i++){el.append($("<shape>",{path:"m "+innerRadius+",0  l "+(innerRadius+d.length)+",0"}).css({width:s,height:s,rotation:(360/d.segments*i)+"deg"}).append($("<stroke>",{color:d.color,weight:d.width+"px",endcap:"round",opacity:$.fn.activity.getOpacity(d,i)})));}return $("<group>",{coordsize:s+" "+s}).css({width:s,height:s,overflow:"hidden"}).append(el);};animate=function(el,steps,duration){var rotation=0;var g=el.get(0);el.data("interval",setInterval(function(){g.style.rotation=++rotation%steps*(360/steps);},duration*1000/steps));};}$(s).remove();}})(jQuery);
(function($){$.toJSON=function(a){if(typeof JSON=="object"&&JSON.stringify)return JSON.stringify(a);var c=typeof a;if(a===null)return "null";if(c=="undefined")return undefined;if(c=="number"||c=="boolean")return a+"";if(c=="string")return $.quoteString(a);if(c=="object"){if(typeof a.toJSON=="function")return $.toJSON(a.toJSON());if(a.constructor===Date){var h=a.getUTCMonth()+1;if(h<10)h="0"+h;var i=a.getUTCDate();if(i<10)i="0"+i;var n=a.getUTCFullYear(),g=a.getUTCHours();if(g<10)g="0"+g;var e=a.getUTCMinutes();if(e<10)e="0"+e;var f=a.getUTCSeconds();if(f<10)f="0"+f;var b=a.getUTCMilliseconds();if(b<100)b="0"+b;if(b<10)b="0"+b;return '"'+n+"-"+h+"-"+i+"T"+g+":"+e+":"+f+"."+b+'Z"'}if(a.constructor===Array){for(var m=[],k=0;k<a.length;k++)m.push($.toJSON(a[k])||"null");return "["+m.join(",")+"]"}var l=[];for(var d in a){var j,c=typeof d;if(c=="number")j='"'+d+'"';else if(c=="string")j=$.quoteString(d);else continue;if(typeof a[d]=="function")continue;var o=$.toJSON(a[d]);l.push(j+":"+o)}return "{"+l.join(", ")+"}"}};$.evalJSON=function(src){if(typeof JSON=="object"&&JSON.parse)return JSON.parse(src);return eval("("+src+")")};$.secureEvalJSON=function(src){if(typeof JSON=="object"&&JSON.parse)return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,"@");filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]");filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(filtered))return eval("("+src+")");else throw new SyntaxError("Error parsing JSON, source is not valid.")};$.quoteString=function(a){if(a.match(_escapeable))return '"'+a.replace(_escapeable,function(b){var a=_meta[b];if(typeof a==="string")return a;a=b.charCodeAt();return "\\u00"+Math.floor(a/16).toString(16)+(a%16).toString(16)})+'"';return '"'+a+'"'};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g,_meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"}})(jQuery)
});


function view_now_loading(){
	if(!$('#nowloading').length) {
		$('body').append("<div id='nowloading' style='width:200px;height:200px;background-color:transparent;position:absolute;'></div>");
	}

    var left = Math.floor(($(window).width() - $("#nowloading").width()) / 2) + $(window).scrollLeft();
    var top  = Math.floor(($(window).height() - $("#nowloading").height()) / 2) + $(window).scrollTop();
    $("#nowloading").css({"top": top,"left": left});
	$("#nowloading").activity({segments: 12, width: 8, space: 6, length: 13, color: '#255525', speed: 1.5});
	$("#nowloading").show();
}
function hide_now_loading(){
	$("#nowloading").activity(false);
	$("#nowloading").hide();
}
function move_value(from_id,to_id){
	if($("#"+from_id) && $("#"+to_id)){
		var param = "";
		if( $("#"+from_id).get(0).tagName.match(/input/i) ){
			param = $("#"+from_id).val();
		}else{
			param = $("#"+from_id).html();
		}

		if( $("#"+to_id).get(0).tagName.match(/input/i) ){
			$("#"+to_id).val(param);
		}else{
			$("#"+to_id).html(param);
		}
	}
}
function hasTarget(tg_name){
	var ret = false;
	if(tg_name != "" || tg_name != null){
		if($("#"+tg_name) != undefined){
			if( $("#"+tg_name).get(0) != undefined){
				ret = true;
			}
		}
	}
	return ret;
}
function isInput(tg_name){
	if(hasTarget(tg_name)){
		if( $("#"+tg_name).get(0).tagName == 'undefined'){
			alert(tg_name);
			return false;
		}

		if( $("#"+tg_name).get(0).tagName.match(/input/i) ){
			return true;
		}else{
			return false;
		}
	}
}

function setvalue(tg_name,value){
	if(hasTarget(tg_name)){
		if(isInput(tg_name)){
			$("#"+tg_name).val(value);
		}else{
			$("#"+tg_name).html(value);
		}
	}
}

function addReadonly(tg_name){
	if(hasTarget(tg_name)){
		if(isInput(tg_name)){
			$("#"+tg_name).attr("readonly", "readonly");
			$("#"+tg_name).addClass('input_readonly');
		}
	}
}

function removeReadonly(tg_name){
	if(hasTarget(tg_name)){
		if(isInput(tg_name)){
			$("#"+tg_name).attr("readonly", false);
			$("#"+tg_name).removeClass('input_readonly');
		}
	}
}

