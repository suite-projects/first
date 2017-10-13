/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function get_bankdata(){
  if(!$('#dialog').length) {
      $('body').append("<div id='dialog' style='display:none;'></div>");
  }

  var mcode1 = "000"+String($('#insole_no1').val().replace(/[^0-9]/i,""));
  var mcode2 = "000000"+String($('#insole_no2').val().replace(/[^0-9]/i,""));
  mcode1 = mcode1.substr(-3);
  mcode2 = mcode2.substr(-6);
  $('#insole_no1').val(mcode1);
  $('#insole_no2').val(mcode2);
  var mcode = mcode1+mcode2;

  var PostData = {
      mid: escape(mcode)
  };
  $.ajax({
      url: "?page=ajax&act=getfootbank",
      data:PostData,
      type: "POST",
      async: false,
      dataType:"json",
      success:function(json, status, xhr){
          var data = json.data;
          $("#o_tel").val(data.tel);
          $("#foot_length_1").val(data.len.l);
          $("#foot_width_1").val(data.width.l);
          $("#heel_width_1").val(data.heelw.l);
          $("#inside_arch_height_1").val(data.i_arch.l);
          $("#outside_arch_height_1").val(data.o_arch.l);
          $("#foot_length_2").val(data.len.r);
          $("#foot_width_2").val(data.width.r);
          $("#heel_width_2").val(data.heelw.r);
          $("#inside_arch_height_2").val(data.i_arch.r);
          $("#outside_arch_height_2").val(data.o_arch.r);
      }
  });
}
function copy_put(){
  if(confirm("データを新規に作成します。\nよろしいですか？")){
      $("#o_id").val("");
      $("form").submit();
  }
}

