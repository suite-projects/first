<?php
session_start();
session_cache_limiter('nocache');
date_default_timezone_set("Asia/Tokyo");

set_include_path(get_include_path() . PATH_SEPARATOR . realpath(dirname(__FILE__).'/../include/'));
require_once('setting.php');
if (preg_match('/^ja/i', $_SERVER['HTTP_ACCEPT_LANGUAGE'])){
  define("_LANG_PATH_", "ja");
}else{
  define("_LANG_PATH_", "en");
}
@include_once(_LANG_PATH_.'/label.php');
@include_once(_LANG_PATH_.'/messages.php');

require_once('autoload.php');
require_once('globals.php');

try{
  Autoload::start();

  $Main = new MainProc();
  //$Main->start();
  
  echo "started\n";
  
}catch (Exception $e){
  if(_IS_DEBUG_){
    echo "<pre>";
    echo $e->getMessage()."\n";
    echo $e->getTraceAsString()."\n";
    echo "</pre>";
  }else{
    if($e->getCode() == 404)
      header("HTTP/1.0 404 Not Found");
      header("Status: 404 Not Found");
      header('HTTP', true, 404);{
    }
  }
}
?>