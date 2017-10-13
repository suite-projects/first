<?php

define('__HOST__','localhost');
define('__PORT__','5432');
define('__DB__','footbank');
define('__OWNER__','postgres');
define('__PASS__','postgres');
define('__TXT_ENCODE__','sjis-win');


echo '<!-- exist_check --><P>'; echo '\n'; print "\n";

// *******************************************************************************

echo "Are you sure you want to do this?  Type 'yes' to continue: ";

$handle = fopen ("php://stdin","r");
$line = fgets($handle);
if(trim($line) != 'yes'){
    echo "ABORTING!\n";
    exit;
}
echo "\n";
echo "Thank you, continuing...\n";

echo "Connection test.....\n";

// *******************************************************************************

// DB�R�l�N�V����
$db = pg_open();

if(!$db){
  echo "Cannot make connection !!\n";
  exit(1);
}

echo "Connection confirmed.. \n\n";

// ���ʃ��\�[�X
$rs = pg_list_dbs($db);

// ���R�[�h���̎擾
$count = pg_num_rows($rs);

// �e���R�[�h�̓ǂݎ��
while($arr_record = pg_fetch_assoc($rs))
{
	print "{$arr_record['shop_id']}, {$arr_record['measure_code']}, {$arr_record['jpg_right']}";
	
	file_put_contents('image.stl', $arr_record["stlbinary_right"]);
	//file_put_contents('image.jpg', $arr_record["jpg_right"]);
	
	print "\n";
}

// ���R�[�h�X�V��SQL���̍쐬


// ���ʃ��\�[�X�̊J��
pg_free_result($rs);

// �f�[�^�x�[�X�̐ؒf
pg_close($db);

echo "Disconnected \n";
exit(0);

// *******************************************************************************
// * �֐��Fpg_open
// * �߂�F�Ȃ�
// *******************************************************************************
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

// *******************************************************************************
// * �֐��Fpg_list_dbs
// * �߂�F���ʃ��\�[�X
// *******************************************************************************
function pg_list_dbs($db)
{
	assert(is_resource($db));

	$str_sql = "select ";
	$str_sql .= "shop_id,measure_code,";
	$str_sql .= "left_length, right_length,";
	$str_sql .= "left_width,right_width,";
	$str_sql .= "trim(jpg_left) as jpg_left, trim(jpg_right) as jpg_right,";
	$str_sql .= "trim(trailing from encode(stlbinary_left,'escape')) as stlbinary_left,";
	$str_sql .= "trim(trailing from encode(stlbinary_right,'escape')) as stlbinary_right ";
	$str_sql .= "FROM t_measure ";
	$str_sql .= "WHERE measure_code=2000039";

	return pg_query($db,$str_sql);
}


?>