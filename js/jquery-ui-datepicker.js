function open_Datepicker(target,title){
  if(!$('#dialog').length) {
    $('body').append("<div id='dialog' style='display:none;'></div>");
  }
  $("#dialog").dialog({
    title: title,
    autoOpen: false,
    modal: true,
    resizable: false,
    width: 200,
    height: 'auto',
    dialogClass: 'ui-datepicker'
  });
  $("#dialog").datepicker({
    setTarget: target,
    format: "yyyy/mm/dd",
    defaultDate: $("#"+target).val()
  });
}

(function( $, undefined ) {
  $.extend($.ui, {
    datepicker: {
      version: "1.0.0"
    }
  });
var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();

  function Datepicker() {
    this._defaults = {
      defaultDate: null,
      setTarget: null,
      format: '',
      minDate: null,
      maxDate: null
    };
    this.mainPanel = null;
  }
  $.extend(Datepicker.prototype, {
    markerClassName: 'hasDatepicker',

    _attachDatepicker: function(settings) {
      this.dpDiv = bindHover($("#"+this.mainPanel));
      var target = $("#"+settings["setTarget"])[0];
      if(!target){
        alert("prease setting setTarget!");
      }
      var inlineSettings = null;
      for (var attrName in this._defaults) {
        var attrValue = target.getAttribute('date:' + attrName);
        if (attrValue) {
          inlineSettings = inlineSettings || {};
          try {
            inlineSettings[attrName] = eval(attrValue);
          } catch (err) {
            inlineSettings[attrName] = attrValue;
          }
        }
      }
      this.settings = $.extend({}, settings || {}, inlineSettings || {});

      this._updateDatepicker();
      this.dpDiv.dialog("open");
    },

    _updateDatepicker: function() {
      this.dpDiv.empty().append(this._generateHTML());
      var cover = this.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
      if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
        cover.css({
          left: -borders[0],
          top: -borders[1],
          width: this.dpDiv.outerWidth(),
          height: this.dpDiv.outerHeight()
        })
      }
			
      return true;
    },
    _newInst: function(target) {
      var id = target.id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
      return {
        id: id,
        input: target,
        dpDiv:this.dpDiv
      };
    },
    _getDefaultDate: function() {
      var dd = this._get('defaultDate');
      var dt = this._toDate(dd);
      if(!dt)dt = new Date();
			
      return this._restrictMinMax(dt);
    },
    _toDate: function(dateval,defval){
      if(!dateval) return defval;
			
      if(dateval instanceof Date){
        return dateval;
      }else{
        if(this._isDate(dateval)){
          return this._getobjdate(dateval);
        }else{
          return defval;
        }
      }
    },
    _mkDate: function(y,m,d){
      return this._daylightSavingAdjust(new Date(y, m, d));
    },
    _isDate: function(dateval){
      var dt = this._getobjdate(dateval);
      if(dt == null) {
        return false;
      }
      return true;
    },
    _getobjdate: function(dateval){
      ymd = this._format_date(dateval,'yyyymmdd');
      if(!isFinite(Number(ymd))) return null;
			
      var y = Number(ymd.substr(0,4));
      var m = Number(ymd.substr(4,2));
      var d = Number(ymd.substr(6,2));
      var odt = new Date(y, m - 1, d);
      return this._daylightSavingAdjust(odt);
    },
    _format_date: function(dateval,format){
      if(!dateval)return "";
			
      if(format == ""){
        format = "yymmdd";
      }
			
      var y = String("0");
      var m = String("0");
      var d = String("0");


      if(dateval instanceof Date) {
        y = String(dateval.getFullYear());
        m = String(dateval.getMonth()+1);
        d = String(dateval.getDate());
      }else{
        strdateval = String(dateval);
        var reg1 = new RegExp("^[0-9]{6}$");
        var reg2 = new RegExp("^[0-9]{8}$");
        if(reg1.test(strdateval)){
          y = strdateval.substr(0,2);
          if(Number(y) > 50){
            strdateval = "19"+strdateval;
          }else{
            strdateval = "20"+strdateval;
          }
					
        }
        if(reg2.test(strdateval)){
          y = strdateval.substr(0,4);
          m = strdateval.substr(4,2);
          d = strdateval.substr(6,2);
        }else if(typeof dateval == "string") {
          var x = dateval.match(/\d+/g);
          if(x && x.length >= 3){
            y = x[0];
            m = x[1];
            d = x[2];
          }
        }
      }
      if(y.length == 2){
        y = "20" + y;
      }
      if(y.length != 4) y = 0;
      if(m.length == 1) m = "0" + m;
      if(m.length > 2) m = 0;
      if(d.length == 1) d = "0" + d;
      if(d.length > 2) d = 0;
			
      if(Number(y) != 0 && Number(m) != 0 && Number(d) != 0){
        var retval = format.toLowerCase();
        retval = retval.replace("yyyy",y);
        retval = retval.replace("yy",y.substr(2,2));
        retval = retval.replace("mm",m);
        retval = retval.replace("m",String(Number(m)*1));
        retval = retval.replace("dd",d);
        retval = retval.replace("d",String(Number(d)*1));
        return retval;
      }else{
        return "";
      }
    },
    _restrictMinMax: function(date) {
      var minDate = this._getMinMaxDate('min');
      var maxDate = this._getMinMaxDate('max');

      var newDate = (minDate && date < minDate ? minDate : date);
      newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
      return newDate;
    },
    _getMinMaxDate: function(minMax) {
      var mydate = this._get(minMax + 'Date');
      return this._toDate(mydate, null);
    },
    _hideDatepicker: function() {
      this.dpDiv.dialog("close");
    },
    _getInst: function(target) {
      try {
        return $.data(target, PROP_NAME);
      } catch (err) {
        throw 'Missing instance data for this datepicker';
      }
    },
    _get: function(name) {
      return this.settings[name] !== undefined ?this.settings[name] : this._defaults[name];
    },
    _set: function(name,value) {
      this.settings[name] = value;
    },
    /* Generate the HTML for the current state of the date picker. */
    _generateHTML: function() {
      var today = new Date();
      today = this._daylightSavingAdjust(new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time

      var defaultDate = this._getDefaultDate();

      var minDate = this._getMinMaxDate('min');
      var maxDate = this._getMinMaxDate('max');
      var drawMonth = this.drawMonth;
      var drawYear = this.drawYear;

      var NY = defaultDate.getFullYear();
      var NM = defaultDate.getMonth();
			
      Now_Year = today.getFullYear();
      Now_Mon = today.getMonth();
			
      if(!isFinite(NY) || NY < 1950 || NY > 2030){
        drawYear = Now_Year;
      }
      else{
        drawYear = NY;
      }
			
      if(!isFinite(NM) || NM < 0 || NM > 11){
        drawMonth = Now_Mon;
      }
      else{
        drawMonth = NM;
      }

      if (maxDate) {
        var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),maxDate.getMonth() + 1, maxDate.getDate()));
        maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
        while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
          drawMonth--;
          if (drawMonth < 0) {
            drawMonth = 11;
            drawYear--;
          }
        }
      }
      this.drawMonth = drawMonth;
      this.drawYear = drawYear;
			
      var wd_s = this._mkDate(drawYear,drawMonth,1).getDay();
      StartDay = this._mkDate(drawYear,drawMonth,1-wd_s);	//カレンダー表示開始日
			
      //wd_e = this._mkDate(drawYear,drawMonth+1,0).getDay();	//晦日の曜日
			
      MonLast = this._mkDate(drawYear,drawMonth+1,0);
      EndDay = this._addDate(StartDay,34);
      if(EndDay < MonLast){
        EndDay = this._addDate(StartDay,41);
      }
			
      var myClass = "DP_jQuery_"+String(dpuuid);
			
      var prevText = this._get('prevText',"前の月");
      prevText = "";
      var prev = '<a class="ui-datepicker-prev ui-corner-all" onclick="'+myClass+'.datepicker._monChange(-1);"' +
      ' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-w">' + prevText + '</span></a>';
			
			
      var nextText = this._get('nextText',"次の月");
      var next = '<a class="ui-datepicker-next ui-corner-all" onclick="'+myClass+'.datepicker._monChange(+1);"' +
      ' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-e">' + nextText + '</span></a>';
      var html ='';
			
      html += '<div class="ui-datepicker-header ui-corner-all">';
      html += prev;
      html += next;
      //html += '<div class="ui-datepicker-title" ondblclick="'+myClass+'.datepicker._goToday();">';
      //html += drawYear+'年'+(drawMonth+1)+'月';
      html += '<div class="ui-datepicker-title">';
      var thisYear = new Date().getFullYear();
      var determineYear = function(value) {
        var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
          (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
            parseInt(value, 10)));
        return (isNaN(year) ? thisYear : year);
      };
      year = determineYear("c-10");
      var endYear = Math.max(year, determineYear("c+10"));
      year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
      endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
      html += '<select class="ui-datepicker-year" onchange="'+myClass+'.datepicker._yearmonChange();">';
      for (; year <= endYear; year++) {
        html += "<option value='" + year + "'" +
        (year === drawYear ? " selected='selected'" : "") +
        ">" + year + "</option>";
      }
      html += "</select>年";
      html += '<select class="ui-datepicker-month" onchange="'+myClass+'.datepicker._yearmonChange();">';
      for (var month = 0; month < 12; month++) {
        html += "<option value='" + month + "'" +
        (month === drawMonth ? " selected='selected'" : "") +
        ">" + (month+1) + "</option>";
      }
      html += "</select>月";

      html += '</div></div>';
			
      var ND = StartDay;
      html += '<table class="ui-datepicker-calendar">';
      html += '<thead>';
      html += '<tr>';
      html += '<th class="sun">日</th>';
      html += '<th>月</th>';
      html += '<th>火</th>';
      html += '<th>水</th>';
      html += '<th>木</th>';
      html += '<th>金</th>';
      html += '<th class="sat">土</th>';
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';
      var cls_name;
      var InputDay = this._toDate($("#"+this._get("setTarget")).val());
      if(InputDay == null) InputDay = ND;
      while(ND <= EndDay){
        if(ND.getDay() == 0){
          html += "<tr>";
        }	//日曜
				
        if(ND.getMonth() != drawMonth){
          html += '<td class=" ui-datepicker-other-month ui-datepicker-unselectable ui-state-disabled r" >'+ND.getDate()+'</td>';
        }else{
          if(ND.getFullYear() == today.getFullYear() && ND.getMonth() == today.getMonth() && ND.getDate() == today.getDate()){
            cls_name = "ui-state-highlight";
          }else if(ND.getFullYear() == InputDay.getFullYear() && ND.getMonth() == InputDay.getMonth() && ND.getDate() == InputDay.getDate()){
            cls_name = "ui-state-active";
          } else{
            cls_name = "ui-state-default";
          }


          html += '<td onclick="'+myClass+
          '.datepicker._selectDay('+ND.getFullYear()+','+ND.getMonth()+','+ND.getDate()+');return false;"' +
          ' class=" "><a class="' + cls_name + '" style="cursor:pointer;">'+ND.getDate()+'</a></td>';
        }
        if(ND.getDay() == 6){
          html += "</tr>";
        }
				
        ND = this._addDate(ND,1);
      }
      html += '</tbody></table>';

      return html;
    },
    _addMonth: function(dateval,addMon){
      if(!dateval) return dateval;
      if(dateval instanceof Date){
        return this._daylightSavingAdjust(new Date(dateval.getFullYear(), dateval.getMonth()+addMon, dateval.getDate()));
      }
    },
    _addDate: function(dateval,addDay){
      if(!dateval) return dateval;
      if(dateval instanceof Date){
        return this._daylightSavingAdjust(new Date(dateval.getFullYear(), dateval.getMonth(), dateval.getDate()+addDay));
      }
    },
    _daylightSavingAdjust: function(date) {
      if (!date) return null;
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },
    _monChange: function(no){
      var defaultDate = this._getDefaultDate();
      this.settings["defaultDate"] = this._format_date(this._addMonth(defaultDate,no),'yyyymmdd');
      this._updateDatepicker();
    },
    _yearmonChange: function(){
      var year,month;
      this.dpDiv.find(".ui-datepicker-year").each(function(){
        year = $(this).val();
      });
      this.dpDiv.find(".ui-datepicker-month").each(function(){
        var v = Number($(this).val())+1;
        month = ("00"+String(v)).substr(-2);
      });

      this.settings["defaultDate"] = this._format_date(String(year)+String(month)+"01",'yyyymmdd');
      this._updateDatepicker();
    },
    _goToday: function(){
      this.settings["defaultDate"] = this._format_date(new Date(),'yyyymmdd');
      this._updateDatepicker();
    },
    _selectDay: function(y,m,d){
      var selDay = this._daylightSavingAdjust(new Date(y, m, d));
			
      $('#'+this._get("setTarget")).val(this._format_date(selDay,this._get("format")));
      this._close();
    },
    _open: function(){
      this.dpDiv.dialog("open");
    },
    _close: function(){
      this.dpDiv.dialog("close");
    }
  });
  function bindHover(dpDiv) {
    var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
    return dpDiv.delegate(selector, 'mouseout', function() {
      $(this).removeClass('ui-state-hover');
      if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
      if (this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
    })
    .delegate(selector, 'mouseover', function(){
      $(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
      $(this).addClass('ui-state-hover');
      if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
      if (this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
    });
  }
  $.fn.datepicker = function(options){
    if ( !this.length ) {
      return this;
    }
    $.datepicker.mainPanel = this.attr("id");

    var otherArgs = Array.prototype.slice.call(arguments, 1);
    switch(options){
      case "get":
        return $.datepicker.get();
        break;
      case "set":
        if(arguments.length == 2){
          $.datepicker.set(otherArgs);
        }
        break;
      default:
        $.datepicker._attachDatepicker(options);
        break;
    }
  }
  $.datepicker = new Datepicker(); // singleton instance
  $.datepicker.initialized = false;
  $.datepicker.uuid = new Date().getTime();
  window['DP_jQuery_' + dpuuid] = $;
})(jQuery);
