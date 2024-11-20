<?php
#header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin:   *');
header('Access-Control-Allow-Methods:   POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers:   Content-Type, X-Auth-Token, Origin, Authorization');
$host="localhost";
// $username="id21424240_myownbooks";
// $password="db/78_myOwnbooks";
// $dbname="id21424240_dbmyownbooks";
$username="root";
$password="Lorci/1978_mysql";
$dbname="mybooks";

$conn=mysqli_connect($host,$username,$password,$dbname);
if(mysqli_connect_errno())
    echo "Kapcsolati hiba...".mysqli_connect_error();
else
    echo "Kapcsolat létrejött...";

#$jsondata = file_get_contents("https://myownbooks.000webhostapp.com/setData.php/");

#echo $jsondata;

if ( $_GET["cat"] == "INSBK") {
#    $sql = "SELECT NVL(MAX(BK_ID),0) +1 as maxid FROM BOOK";
#    $result=mysqli_query($conn,$sql);
#    $maxBKID = $result->fetch_all(MYSQLI_ASSOC);
#    echo " count: " . count($maxBKID);
#    echo $maxBKID[0];
  $sqlFields = "INSERT INTO BOOK (BK_BOOKTITLE";
  $sqlValues = " VALUES ('" . $_GET["title"] . "'";
  if ( !is_null( $_GET["at"] ) ) { $sqlFields = $sqlFields . ", BK_AT"; $sqlValues = $sqlValues . ", ". $_GET["at"]; } 
  if ( !is_null( $_GET["bt"] ) ) { $sqlFields = $sqlFields . ", BK_BT"; $sqlValues = $sqlValues . ", ". $_GET["bt"]; } 
  if ( !is_null( $_GET["cg"] ) ) { $sqlFields = $sqlFields . ", BK_CG_ID"; $sqlValues = $sqlValues . ", ". $_GET["cg"]; } 
  if ( !is_null( $_GET["ps"] ) ) { $sqlFields = $sqlFields . ", BK_PS_ID"; $sqlValues = $sqlValues . ", ". $_GET["ps"]; } 
  if ( !is_null( $_GET["os"] ) ) { $sqlFields = $sqlFields . ", BK_OS_ID"; $sqlValues = $sqlValues . ", ". $_GET["os"]; } 
  if ( !is_null( $_GET["yop"] ) ) { $sqlFields = $sqlFields . ", BK_YEAR_OF_PUBLICATION"; $sqlValues = $sqlValues . ", ". $_GET["yop"]; } 
  if ( !is_null( $_GET["rate"] ) ) { $sqlFields = $sqlFields . ", BK_RATE"; $sqlValues = $sqlValues . ", ". $_GET["rate"]; } 
  if ( !is_null( $_GET["desc"] ) ) { $sqlFields = $sqlFields . ", BK_DESCRIPTION"; $sqlValues = $sqlValues . ", '". $_GET["desc"] . "'"; } 
  if ( !is_null( $_GET["readed"] ) ) { $sqlFields = $sqlFields . ", BK_READED"; $sqlValues = $sqlValues . ", '". $_GET["readed"] . "'"; } 
  $sql = $sqlFields . ", BK_USER)" . $sqlValues . ", '". $_GET["user"] . "')";
} elseif ( $_GET["cat"] == "MODBK" ) {
  $sql = "UPDATE BOOK SET ";
  if ( !is_null( $_GET["title"] ) ) { $sql = $sql . "BK_BOOKTITLE = '" . $_GET["title"] . "'"; } 
  if ( !is_null( $_GET["at"] ) ) { $sql = $sql . ", BK_AT = " . $_GET["at"]; } 
  if ( !is_null( $_GET["bt"] ) ) { $sql = $sql . ", BK_BT = " . $_GET["bt"]; } 
  if ( !is_null( $_GET["cg"] ) ) { $sql = $sql . ", BK_CG_ID = " . $_GET["cg"]; } 
  if ( !is_null( $_GET["ps"] ) ) { $sql = $sql . ", BK_PS_ID = " . $_GET["ps"]; } 
  if ( !is_null( $_GET["os"] ) ) { $sql = $sql . ", BK_OS_ID = " . $_GET["os"]; } 
  if ( !is_null( $_GET["yop"] ) ) { $sql = $sql . ", BK_YEAR_OF_PUBLICATION = " . $_GET["yop"]; } 
  if ( !is_null( $_GET["rate"] ) ) { $sql = $sql . ", BK_RATE = " . $_GET["rate"]; } 
  if ( !is_null( $_GET["desc"] ) ) { $sql = $sql . ", BK_DESCRIPTION = '" . $_GET["desc"] . "'"; } 
  if ( !is_null( $_GET["readed"] ) ) { $sql = $sql . ", BK_READED = '" . $_GET["readed"] . "'"; } 
  $sql = $sql . " WHERE BK_ID = " . $_GET["id"];
} elseif ( $_GET["cat"] == "INSAT") {
  $sql = "INSERT INTO AUTHOR (AT_AUTHORNAME) VALUES ('" . $_GET["name"] . "')";
} elseif ( $_GET["cat"] == "INSPS") {
  $sql = "INSERT INTO PUBLISHER (PS_PUBLISHERNAME) VALUES ('" . $_GET["name"] . "')";
} else {
  $sql = "SELECT * FROM BOOK";
}

$result=mysqli_query($conn,$sql);

#$outp = $result->fetch_all(MYSQLI_ASSOC);

#echo $outp;

#$sql = "SELECT * FROM BOOK WHERE BK_ID = ( SELECT MAX(BK_ID) FROM BOOK )";

#$result=mysqli_query($conn,$sql);

#echo $result;

#$outp = $result->fetch_all(MYSQLI_ASSOC);

#echo json_encode($outp);
#echo $_GET["id"];

echo "kész1";
#mysqli_free_result($result);
#echo "kész2";
mysqli_close($conn);
echo "kész3";
#ALTER TABLE BOOK AUTO_INCREMENT =1;

?>