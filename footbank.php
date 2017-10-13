<?php
define('__HOST__','localhost');
define('__PORT__','5432');
define('__DB__','footbank');
define('__OWNER__','postgres');
define('__PASS__','postgres');
define('__TXT_ENCODE__','sjis-win');
define('__BASE_PATH__','C:/FSN-2100/Data/');
define('__BACKUP_DIR__','C:/FSN-2100/backup');

//データパス
$datapath = array("C:/FSN-2100/Size/Cstmr/","C:/FSN-2100/Data/","C:/FSN-2100/Fpdata/");

//引数ﾁｪｯｸ
if(!isset($argv[1])) {
	write_error("計測番号がありません");
	exit(1);
}

//デフォルトタイムゾーン設定
date_default_timezone_set("Asia/Tokyo");

//ベイスパス
$base_dir = __BASE_PATH__;
if(!is_dir($base_dir)){
  write_error(__BASE_PATH__."がありません");
  exit(1);
}

if(substr($base_dir,-1) != '/') $base_dir.='/';

// ディレクトリがないとき作成
if (!is_dir(__BACKUP_DIR__)){
    if (!@mkdir(__BACKUP_DIR__, 0644, true)){
      write_error(__BACKUP_DIR__."が作成できません");
      exit(1);
    }
}

//ファイル拡張子
$arr_part = array(".txt", "_left.stl","_right.stl","_left.dgd", "_right.dgd","_left.jpg", "_right.jpg");
$arr_ext = array("txt","stl","stl","dgd", "dgd", "jpg", "jpg");

//DBコネクション
$con = pg_open();

if(!$con){
  write_error("データベースに接続できません");
  exit(1);
}

// データパス、３種類
foreach($datapath as $value) {
	//拡張子
	for($i=0; $i<count($arr_part); $i++){
		$filename = $value.$argv[1].$arr_part[$i];
		if(file_exists($filename)){
			if($arr_ext[$i]=="jpg"){
				//関数名称
				$func = "put_".$arr_ext[$i]."path";
				$func(&$con,$filename, 1);
			}else{
				//関数名称
				$func = "put_".$arr_ext[$i]."file";
				$func($con,$filename,1);
			}
			
		}
	}
}

//DB切断
pg_close($con);
exit(0);

/*******************************************************************************
 * 関数：pg_open
 * 戻り：なし
 *******************************************************************************/
function pg_open(){
	$conn_str = "";
	$conn_str .= "host=".__HOST__." ";
	$conn_str .= "port=".__PORT__." ";
	$conn_str .= "dbname=".__DB__." ";
    $conn_str .= "user=".__OWNER__." ";
	$conn_str .= "password=".__PASS__." ";

    $con = pg_connect($conn_str);
    pg_set_client_encoding($con,"UNICODE");

	if($con == false){
		return false;
	}else{
		return $con;
	}
}

/*******************************************************************************
 * 関数：put_txtfile
 * 戻り：なし
 *******************************************************************************/
function put_txtfile(&$con,$fname,$shop_id){
  if(!file_exists($fname)) return;

  //計測コードと拡張子に分ける
  list($m_code,$ext) = explode(".",basename($fname));
  if(!is_numeric($m_code)) return;

  if(!exist_check($con,$m_code,$shop_id)) return;
  
echo '<!-- exist_check --><P>';

  $txt = file_get_contents($fname);
  if($txt === false) return;

  $txt = mb_convert_encoding($txt, "UTF-8", __TXT_ENCODE__);
  $tmp = explode(",",$txt);

  $sql  = "UPDATE t_measure SET ";
  
  $sql .= "customer_num             = ".db_num($tmp[0]).",";
  $sql .= "tel                      = ".db_str($tmp[1]."-".$tmp[2]."-".$tmp[3]).",";
  $sql .= "sex                      = ".db_num($tmp[4]).",";
  $sql .= "date                     = ".db_date($tmp[5]).",";

  $sql .= "left_length              = ".db_num($tmp[6]).",";
  $sql .= "left_ballgirth           = ".db_num($tmp[7]).",";
  $sql .= "left_width               = ".db_num($tmp[8]).",";
  $sql .= "left_jisballgirth        = ".db_num($tmp[9]).",";
  $sql .= "left_jiswidth            = ".db_num($tmp[10]).",";
  $sql .= "left_heelwidth           = ".db_num($tmp[11]).",";
  $sql .= "left_inball              = ".db_num($tmp[12]).",";
  $sql .= "left_outball             = ".db_num($tmp[13]).",";
  $sql .= "left_instepheight        = ".db_num($tmp[14]).",";
  $sql .= "left_archheight          = ".db_num($tmp[15]).",";
  $sql .= "left_archrate            = ".db_num($tmp[16]).",";
  $sql .= "left_bigtoeside          = ".db_num($tmp[17]).",";
  $sql .= "left_littletoeside       = ".db_num($tmp[18]).",";
  $sql .= "left_heelangle           = ".db_num($tmp[20]).",";
  $sql .= "left_bigtoeheight        = ".db_num($tmp[21]).",";
  $sql .= "left_littletoeheight     = ".db_num($tmp[22]).",";
  $sql .= "left_oankleheight        = ".db_num($tmp[23]).",";
  $sql .= "left_heelgirth           = ".db_num($tmp[24]).",";
  $sql .= "left_reserve1            = ".db_num($tmp[25]).",";
  $sql .= "left_instepgirth         = ".db_num($tmp[26]).",";
  $sql .= "left_reserve3            = ".db_num($tmp[27]).",";
  $sql .= "left_reserve4            = ".db_num($tmp[28]).",";
  $sql .= "left_reserve5            = ".db_num($tmp[29]).",";
  $sql .= "left_agedate             = ".db_num($tmp[30]).",";
  $sql .= "left_age                 = ".db_num($tmp[31]).",";
  $sql .= "left_birth               = ".db_date($tmp[32]).",";
  $sql .= "left_position            = ".db_num($tmp[33]).",";

  $sql .= "right_length             = ".db_num($tmp[34]).",";
  $sql .= "right_ballgirth          = ".db_num($tmp[35]).",";
  $sql .= "right_width              = ".db_num($tmp[36]).",";
  $sql .= "right_jisballgirth       = ".db_num($tmp[37]).",";
  $sql .= "right_jiswidth           = ".db_num($tmp[38]).",";
  $sql .= "right_heelwidth          = ".db_num($tmp[39]).",";
  $sql .= "right_inball             = ".db_num($tmp[40]).",";
  $sql .= "right_outball            = ".db_num($tmp[41]).",";
  $sql .= "right_instepheight       = ".db_num($tmp[42]).",";
  $sql .= "right_archheight         = ".db_num($tmp[43]).",";
  $sql .= "right_archrate           = ".db_num($tmp[44]).",";
  $sql .= "right_bigtoeside         = ".db_num($tmp[45]).",";
  $sql .= "right_littletoeside      = ".db_num($tmp[46]).",";
  $sql .= "right_heelangle          = ".db_num($tmp[48]).",";
  $sql .= "right_bigtoeheight       = ".db_num($tmp[49]).",";
  $sql .= "right_littletoeheight    = ".db_num($tmp[50]).",";
  $sql .= "right_oankleheight       = ".db_num($tmp[51]).",";
  $sql .= "right_heelgirth          = ".db_num($tmp[52]).",";
  $sql .= "right_reserve1           = ".db_num($tmp[53]).",";
  $sql .= "right_instepgirth        = ".db_num($tmp[54]).",";
  $sql .= "right_reserve3           = ".db_num($tmp[55]).",";
  $sql .= "right_reserve4           = ".db_num($tmp[56]).",";
  $sql .= "right_reserve5           = ".db_num($tmp[57]).",";
  $sql .= "right_agedate            = ".db_num($tmp[58]).",";
  $sql .= "right_age                = ".db_num($tmp[59]).",";
  $sql .= "right_birth              = ".db_date($tmp[60]).",";
  $sql .= "right_position           = ".db_num($tmp[61]).",";
  $sql .= "birth                    = ".db_birth($tmp[73],$tmp[74],$tmp[75])." ";

  $sql .= "where measure_code = ".intval($m_code)." ";
  $sql .= "and shop_id = ".intval($shop_id)." ";
echo '<!-- create t_measure start --><P>';

  if(!pg_query($con,$sql)) return false;

echo '<!-- create t_measure done --><P>';
  unset($tmp);
  //ファイル移動
  @rename($fname,__BACKUP_DIR__."/".$shop_id."_".date('Ymd')."_".basename($fname));
}

/*******************************************************************************
 * 関数：put_dgdfile
 * 戻り：なし
 *******************************************************************************/
function put_dgdfile(&$con,$fname,$shop_id){
  put_binary_file(&$con,$fname,$shop_id,1);
}

/*******************************************************************************
 * 関数：put_stlfile
 * 戻り：なし
 *******************************************************************************/
function put_stlfile(&$con,$fname,$shop_id){
  put_binary_file(&$con,$fname,$shop_id,2);
}

/*******************************************************************************
 * 関数：put_binary_file
 * 戻り：なし
 *******************************************************************************/
function put_binary_file(&$con,$fname,$shop_id,$mode){
  if(!file_exists($fname)) return;
  //計測コードとそれ以下
  list($m_code,$tmp) = explode("_",basename($fname));
  if(!is_numeric($m_code)) return;
  //左右と拡張子に分ける
  list($kind,$ext) = explode(".",$tmp);
  $kind = strtolower($kind);
  if($kind != 'left' && $kind != 'right') return;

  if(!exist_check($con,$m_code,$shop_id)) return;

  $field = "";
  if($mode == 1){
    if($kind == 'left'){
      $field = "dgdbinary_left";
    }elseif($kind == 'right'){
      $field = "dgdbinary_right";
    }else{
      return;
    }
  }elseif($mode == 2){
    if($kind == 'left'){
      $field = "stlbinary_left";
    }elseif($kind == 'right'){
      $field = "stlbinary_right";
    }else{
      return;
    }
  }else{
    return;
  }

  $sql  = "UPDATE t_measure SET ";
  $sql .= $field." = '".pg_escape_bytea(file_get_contents($fname))."' ";
  $sql .= "where measure_code = ".intval($m_code)." ";
  $sql .= "and shop_id = ".intval($shop_id)." ";
  if(!pg_query($con,$sql)) return false;
  
  if($ext=="dgd"){
     //ファイル移動
     @copy($fname,__BACKUP_DIR__."/".$shop_id."_".date('Ymd')."_".basename($fname));
  }else{
     //ファイル移動
     @rename($fname,__BACKUP_DIR__."/".$shop_id."_".date('Ymd')."_".basename($fname));
  }
}

/*******************************************************************************
 * 関数：exist_check
 * 戻り：TRUE/FALSE
 *******************************************************************************/
function exist_check(&$con,$m_code,$shop_id){
  $ret = 0;
  $sql  = "select count(measure_code) from t_measure ";
  $sql .= "where measure_code = ".intval($m_code)." ";
  $sql .= "and shop_id = ".intval($shop_id)." ";
  $rs = pg_query($con,$sql);
  $maxrows = @pg_num_rows($rs);
  if($maxrows > 0){
    $row = @pg_fetch_row($rs, 0);
    $ret = $row[0];
  }
  @pg_free_result($rs);

  if($ret == 0){
    $sql  = "INSERT INTO t_measure(measure_code,shop_id)";
    $sql .= "VALUES(".intval($m_code).",".intval($shop_id).")";
    if(!pg_query($con,$sql)) return false;
  }

  return true;
}

function write_error($msg){
	print $msg;
    file_put_contents('php://stderr', $msg."\n");
}
function db_str($STR){
	$Ret = "";
	$STR = trim($STR);
	$Ret = str_replace("'","''",$STR);
	return "'".$Ret."'";
}
function db_num($STR){
  if(is_numeric($STR)){
    return floatval($STR);
  }else{
    return "NULL";
  }
}
function db_date($STR){
  $s = trim($STR);
  $y = substr($s,0,4);
  $m = substr($s,4,2);
  $d = substr($s,6,2);
  $h = substr($s,8,2);
  $mi = substr($s,10,2);

  if($h != "" && $mi != ""){
    if(is_date($y,$m,$d,$h,$mi)){
      return "TO_TIMESTAMP('".$y."/".$m."/".$d." ".$h.":".$mi."','YYYY/MM/DD HH24:MI')";
    }else{
      return "NULL";
    }
  }else{
    if(is_date($y,$m,$d)){
      return "TO_DATE('".$y."/".$m."/".$d."','YYYY/MM/DD')";
    }else{
      return "NULL";
    }
  }
  return "NULL";
}

function db_birth($y,$m,$d){
  if(is_date($y,$m,$d)){
    return "TO_DATE('".$y."/".$m."/".$d."','YYYY/MM/DD')";
  }else{
    return "NULL";
  }
}

function is_date($y=0,$m=0,$d=0,$h=0,$mi=0,$s=0){
  if(is_numeric($y) && is_numeric($m) && is_numeric($d) && is_numeric($h) && is_numeric($mi) && is_numeric($s)){
    return checkdate($m, $d, $y);
  }else{
    return false;
  }
}


/*******************************************************************************
 * 関数：put_jpgpath
 * 戻り：なし
 *******************************************************************************/
function put_jpgpath(&$con,$fname,$shop_id){
  // ファイル存在チェック
  if(!file_exists($fname)) return;
  // 計測番号
  list($m_code,$tmp) = explode("_",basename($fname));
  // 数字値確認
  if(!is_numeric($m_code)) return;
  //左右と拡張子に分ける
  list($kind,$ext) = explode(".",$tmp);
  //SQL文
  $sql  = "UPDATE t_measure SET ";
  $sql .= "jpg_".$kind." = '".__BACKUP_DIR__."/".$shop_id."_".date('Ymd')."_".basename($fname)."' ";
  $sql .= "where measure_code = ".intval($m_code)." ";
  $sql .= "and shop_id = ".intval($shop_id)." ";
  //データベース更新
  if(!pg_query($con,$sql)) return false;
  //ファイル移動
  @rename($fname,__BACKUP_DIR__."/".$shop_id."_".date('Ymd')."_".basename($fname));
}

?>