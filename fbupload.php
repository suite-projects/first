<?php
date_default_timezone_set("Asia/Tokyo");
set_include_path(get_include_path() . PATH_SEPARATOR . realpath(dirname(__FILE__) . '/../include/'));
require_once('setting.php');
require_once('autoload.php');
require_once('globals.php');

define('__TXT_ENCODE__','sjis-win');
$datadir = realpath(dirname(__FILE__).'/../data/');
if (!is_dir($datadir)) write_error("dataディレクトリがありません。");
define('__BACKUP_DIR__', $datadir."/back/");

if (!is_dir(__BACKUP_DIR__)) {// ディレクトリがないとき作成
  if (!@mkdir(__BACKUP_DIR__, 0777, true)) {
    write_error(__BACKUP_DIR__ . "が作成できません");
    exit(1);
  }
}
delete_old_file(__BACKUP_DIR__, "zip", 60 * 60 * 24 * 2);
$arr_ext = array("txt", "dgd", "stl");

Autoload::start();
if (isset($_POST["shopcd"]) && isset($_FILES['file'])) {
  try {
    $shopcd = $_POST["shopcd"];
    $file = $_FILES['file'];
    $shop_id = "";

    $con = new DB_Connect();
    $sql = "SELECT shop_id FROM m_shop ";
    $sql .= "WHERE shop_code = '" . trim($shopcd) . "'";
    $rs = $con->Execute($sql);
    if ($rs->Count > 0) {
      $row = $rs->Fetch();
      $shop_id = $row["shop_id"];
    }
    $rs->Close();
    if (!is_numeric($shop_id)) throw new Exception("該当する店舗がありません");
    if (!file_exists($file["tmp_name"]))  throw new Exception("ファイルがありません");
    if ($file['error'] == UPLOAD_ERR_OK){ //アップロード成功
      if(!is_uploaded_file($file["tmp_name"])) throw new Exception("ファイルがアップロードされたものではありません");
      $zipname = $file["tmp_name"];
      $org_name = strtolower($file["name"]);
      list($measure_code,$dmy) = explode(".",$org_name);  unset($dmy);
      if(!is_numeric($measure_code))  throw new Exception("ファイル名が計測コードではありません");

      $zip = new ZipArchive;
      $res = $zip->open($zipname);
      if($res !== TRUE) throw new Exception("ZIPの展開に失敗しました :cd ".$res);
//echo $org_name."を展開<br />";
      for ($i = 0; $i < $zip->numFiles; $i++) {
          $filename = strtolower($zip->getNameIndex($i));
          list($name,$myext) = explode(".",$filename,2);
          if(in_array(strtolower($myext), $arr_ext)){
            $func = "put_".$myext."file";
            if(function_exists($func)){
              $context = $zip->getFromIndex($i);
              $func($con,$context, $name, $shop_id,$measure_code);
            }
          }
      }
      $zip->close();
      //バックアップ
      rename($zipname,__BACKUP_DIR__.date('YmdHis')."_".basename($org_name));
      echo "成功";
    }else{
      $msg = "失敗 ";
      switch($file['error']){
        case UPLOAD_ERR_INI_SIZE:$msg .= "php.iniに設定されたupload_max_filesize値を超えてます";break;
        case UPLOAD_ERR_FORM_SIZE:$msg .= "フォームで設定されたMAX_FILE_SIZE値を超えてます";break;
        case UPLOAD_ERR_PARTIAL:$msg .= "一部分のみしかアップロードされていません";break;
        case UPLOAD_ERR_NO_FILE:$msg .= "ファイルがアップロードされませんでした";break;
      }
      throw new Exception($msg);
    }
  } catch (dbException $e) {
    write_error($e->getMessage());
  } catch (Exception $e) {
    write_error($e->getMessage());
  }
} else {
  header("HTTP/1.0 404 Not Found");
  header("Status: 404 Not Found");
  header('HTTP', true, 404);
}
exit();

function write_error($msg) {
  echo "err:".$msg;
  file_put_contents('php://stderr', $msg . "\n");
  exit();
}

function put_txtfile(DB_Connect &$con,&$context,$name, $shop_id,$measure_code) {
  if (!exist_check($con, $measure_code, $shop_id))  return;

  $txt = mb_convert_encoding($context, "UTF-8", __TXT_ENCODE__);
  $tmp = explode(",", $txt);

  $sql = "UPDATE t_measure SET ";
  $sql .= "customer_num             = " . db_num($tmp[0]) . ",";
  $sql .= "tel                      = " . db_str($tmp[1] . "-" . $tmp[2] . "-" . $tmp[3]) . ",";
  $sql .= "sex                      = " . db_num($tmp[4]) . ",";
  $sql .= "date                     = " . db_date($tmp[5]) . ",";

  $sql .= "left_length              = " . db_num($tmp[6]) . ",";
  $sql .= "left_ballgirth           = " . db_num($tmp[7]) . ",";
  $sql .= "left_width               = " . db_num($tmp[8]) . ",";
  $sql .= "left_jisballgirth        = " . db_num($tmp[9]) . ",";
  $sql .= "left_jiswidth            = " . db_num($tmp[10]) . ",";
  $sql .= "left_heelwidth           = " . db_num($tmp[11]) . ",";
  $sql .= "left_inball              = " . db_num($tmp[12]) . ",";
  $sql .= "left_outball             = " . db_num($tmp[13]) . ",";
  $sql .= "left_instepheight        = " . db_num($tmp[14]) . ",";
  $sql .= "left_archheight          = " . db_num($tmp[15]) . ",";
  $sql .= "left_archrate            = " . db_num($tmp[16]) . ",";
  $sql .= "left_bigtoeside          = " . db_num($tmp[17]) . ",";
  $sql .= "left_littletoeside       = " . db_num($tmp[18]) . ",";
  $sql .= "left_heelangle           = " . db_num($tmp[20]) . ",";
  $sql .= "left_bigtoeheight        = " . db_num($tmp[21]) . ",";
  $sql .= "left_littletoeheight     = " . db_num($tmp[22]) . ",";
  $sql .= "left_oankleheight        = " . db_num($tmp[23]) . ",";
  $sql .= "left_heelgirth           = " . db_num($tmp[24]) . ",";
  $sql .= "left_reserve1            = " . db_num($tmp[25]) . ",";
  $sql .= "left_instepgirth         = " . db_num($tmp[26]) . ",";
  $sql .= "left_reserve3            = " . db_num($tmp[27]) . ",";
  $sql .= "left_reserve4            = " . db_num($tmp[28]) . ",";
  $sql .= "left_reserve5            = " . db_num($tmp[29]) . ",";
  $sql .= "left_agedate             = " . db_num($tmp[30]) . ",";
  $sql .= "left_age                 = " . db_num($tmp[31]) . ",";
  $sql .= "left_birth               = " . db_date($tmp[32]) . ",";
  $sql .= "left_position            = " . db_num($tmp[33]) . ",";

  $sql .= "right_length             = " . db_num($tmp[34]) . ",";
  $sql .= "right_ballgirth          = " . db_num($tmp[35]) . ",";
  $sql .= "right_width              = " . db_num($tmp[36]) . ",";
  $sql .= "right_jisballgirth       = " . db_num($tmp[37]) . ",";
  $sql .= "right_jiswidth           = " . db_num($tmp[38]) . ",";
  $sql .= "right_heelwidth          = " . db_num($tmp[39]) . ",";
  $sql .= "right_inball             = " . db_num($tmp[40]) . ",";
  $sql .= "right_outball            = " . db_num($tmp[41]) . ",";
  $sql .= "right_instepheight       = " . db_num($tmp[42]) . ",";
  $sql .= "right_archheight         = " . db_num($tmp[43]) . ",";
  $sql .= "right_archrate           = " . db_num($tmp[44]) . ",";
  $sql .= "right_bigtoeside         = " . db_num($tmp[45]) . ",";
  $sql .= "right_littletoeside      = " . db_num($tmp[46]) . ",";
  $sql .= "right_heelangle          = " . db_num($tmp[48]) . ",";
  $sql .= "right_bigtoeheight       = " . db_num($tmp[49]) . ",";
  $sql .= "right_littletoeheight    = " . db_num($tmp[50]) . ",";
  $sql .= "right_oankleheight       = " . db_num($tmp[51]) . ",";
  $sql .= "right_heelgirth          = " . db_num($tmp[52]) . ",";
  $sql .= "right_reserve1           = " . db_num($tmp[53]) . ",";
  $sql .= "right_instepgirth        = " . db_num($tmp[54]) . ",";
  $sql .= "right_reserve3           = " . db_num($tmp[55]) . ",";
  $sql .= "right_reserve4           = " . db_num($tmp[56]) . ",";
  $sql .= "right_reserve5           = " . db_num($tmp[57]) . ",";
  $sql .= "right_agedate            = " . db_num($tmp[58]) . ",";
  $sql .= "right_age                = " . db_num($tmp[59]) . ",";
  $sql .= "right_birth              = " . db_date($tmp[60]) . ",";
  $sql .= "right_position           = " . db_num($tmp[61]) . ",";
  $sql .= "birth                    = " . db_birth($tmp[73], $tmp[74], $tmp[75]) . " ";

  $sql .= "where measure_code = " . intval($measure_code) . " ";
  $sql .= "and shop_id = " . intval($shop_id) . " ";
  $con->Execute($sql);
  unset($tmp);
}

function put_dgdfile(DB_Connect &$con,&$context,$name, $shop_id,$measure_code) {
  put_binary_file($con, $context,$name, $shop_id,$measure_code, 1);
}

function put_stlfile(DB_Connect &$con,&$context,$name, $shop_id,$measure_code) {
  put_binary_file($con, $context,$name, $shop_id,$measure_code, 2);
}

function put_binary_file(DB_Connect &$con,&$context,$name, $shop_id,$measure_code, $mode) {
  $kind = "";
  if(strpos($name, 'left') !== FALSE) $kind = "left";
  if(strpos($name, 'right') !== FALSE) $kind = "right";
  if ($kind != 'left' && $kind != 'right') return;

  if (!exist_check($con, $measure_code, $shop_id))  return;

  $field = "";
  if ($mode == 1) {
    if ($kind == 'left') {
      $field = "dgdbinary_left";
    } elseif ($kind == 'right') {
      $field = "dgdbinary_right";
    } else {
      return;
    }
  } elseif ($mode == 2) {
    if ($kind == 'left') {
      $field = "stlbinary_left";
    } elseif ($kind == 'right') {
      $field = "stlbinary_right";
    } else {
      return;
    }
  } else {
    return;
  }

  $sql = "UPDATE t_measure SET ";
  $sql .= $field." = '".pg_escape_bytea($context)."' ";
  $sql .= "where measure_code = ".intval($measure_code)." ";
  $sql .= "and shop_id = ".intval($shop_id)." ";
  $con->Execute($sql);
}

function exist_check(DB_Connect &$con, $m_code, $shop_id) {
  try{
    $ret = 0;
    $sql = "select count(measure_code) as cnt from t_measure ";
    $sql .= "where measure_code = " . intval($m_code) . " ";
    $sql .= "and shop_id = " . intval($shop_id) . " ";
    $rs = $con->Execute($sql);
    if($rs->Count > 0){
      $row = $rs->Fetch();
      $ret = $row["cnt"];
    }
    $rs->Close();
    if ($ret == 0) {
      $sql = "INSERT INTO t_measure(measure_code,shop_id)";
      $sql .= "VALUES(" . intval($m_code) . "," . intval($shop_id) . ")";
      $con->Execute($sql);
    }
  }  catch (dbException $e){
    echo $e->getMessage();
    return false;
  }
  return true;
}


function db_str($STR) {
  $Ret = "";
  $STR = trim($STR);
  $Ret = str_replace("'", "''", $STR);
  return "'" . $Ret . "'";
}

function db_num($STR) {
  if (is_numeric($STR)) {
    return floatval($STR);
  } else {
    return "NULL";
  }
}

function db_date($STR) {
  $s = trim($STR);
  $y = substr($s, 0, 4);
  $m = substr($s, 4, 2);
  $d = substr($s, 6, 2);
  $h = substr($s, 8, 2);
  $mi = substr($s, 10, 2);

  if ($h != "" && $mi != "") {
    if (is_date2($y, $m, $d, $h, $mi)) {
      return "TO_TIMESTAMP('" . $y . "/" . $m . "/" . $d . " " . $h . ":" . $mi . "','YYYY/MM/DD HH24:MI')";
    } else {
      return "NULL";
    }
  } else {
    if (is_date2($y, $m, $d)) {
      return "TO_DATE('" . $y . "/" . $m . "/" . $d . "','YYYY/MM/DD')";
    } else {
      return "NULL";
    }
  }
  return "NULL";
}

function db_birth($y, $m, $d) {
  if (is_date2($y, $m, $d)) {
    return "TO_DATE('" . $y . "/" . $m . "/" . $d . "','YYYY/MM/DD')";
  } else {
    return "NULL";
  }
}

function is_date2($y = 0, $m = 0, $d = 0, $h = 0, $mi = 0, $s = 0) {
  if (is_numeric($y) && is_numeric($m) && is_numeric($d) && is_numeric($h) && is_numeric($mi) && is_numeric($s)) {
    return checkdate($m, $d, $y);
  } else {
    return false;
  }
}

?>