/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function add_new_row(base,action,embBase,option){
	if($("#"+base)){
		view_now_loading();

		var MaxNo = 0;
		$("#"+base).find("tr[class^=variable_tables_row_]").each(function(){
			var No = Number(this.className.substr(20));
			if(isFinite(No)){
				if(No >= MaxNo){MaxNo = No+1;}
			}
		});

		$.ajax({
			url: "/ajax/getFormRow",
			data: {action:action,rowno:MaxNo,embBase:embBase,option:option},
			async: true,
			dataType: "html",
			timeout: 20000,
			context: $("#"+base),
			complete: function(){hide_now_loading();},
			success: function(data, status, xhr){
				hide_now_loading();
				this.append(data);
				if(typeof(bind_bankselect) == 'function'){
					bind_bankselect();
				}
				if(typeof(bind_row_remove) == 'function'){
					bind_row_remove();
				}
				if(typeof(bind_calc_optionlist) == 'function'){
					bind_calc_optionlist();
				}
				if(typeof(bind_calc_workdetail) == 'function'){
					bind_calc_workdetail();
				}
			}
		});
	}
}

function bind_row_remove(){
	$.each($("table[id^=variable_tables_]"),function(){
		$(this).find("tr[class^=variable_tables_row_]").each(function(){
			var tr = $(this);
			var pobj = tr.parent("");
			$(this).find("a.line_remove").each(function(){
				$(this).bind("click",function(){
					tr.remove();
					pobj.find("tr."+tr.attr("class")+"_2").each(function(){
						$(this).remove();
					});
				});
			});
		});
	});
}

function add_new_column(base,action,embBase,option){
	if($("#"+base)){
		view_now_loading();

		var MaxNo = 0;
		$("#"+base).find("td[id^=variable_tables_col_]").each(function(){
			var No = Number(this.id.substr(20));
			if(isFinite(No)){
				if(No >= MaxNo){MaxNo = No+1;}
			}
		});

		$.ajax({
			url: "/ajax/getFormRow",
			data: {action:action,rowno:MaxNo,embBase:embBase,option:option},
			async: true,
			dataType: "html",
			timeout: 20000,
			context: $("#"+base),
			complete: function(){hide_now_loading();},
			success: function(data, status, xhr){
				hide_now_loading();
				this.append(data);
				if(typeof(bind_bankselect) == 'function'){
					bind_bankselect();
				}
				if(typeof(bind_column_remove) == 'function'){
					bind_column_remove();
				}
			}
		});
	}
}

function bind_column_remove(){
	$.each($("tr[id^=variable_tablerows_]"),function(){
		$(this).find("td[id]").each(function(){
			var td = $(this);
			$(this).find("a.column_remove").each(function(){
				$(this).bind("click",function(){
					td.remove();
				});
			});
		});
	});
}

jQuery(function($) {
	$.ajaxSetup({
		async: true,
		type: 'POST'
	});

	bind_row_remove();
	bind_column_remove();
});
