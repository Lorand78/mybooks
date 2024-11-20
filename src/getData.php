<?php
#header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin:   *');
header('Access-Control-Allow-Methods:   POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers:   Content-Type, X-Auth-Token, Origin, Authorization');
$host="localhost";
$username="root";
$password="Lorci/1978_mysql";
$dbname="mybooks";
#$username="id21424240_myownbooks";
#$password="db/78_myOwnbooks";
#$dbname="id21424240_dbmyownbooks";

$conn=mysqli_connect($host,$username,$password,$dbname);
if(mysqli_connect_errno())
    echo "Kapcsolati hiba...".mysqli_connect_error();
else
    echo "Kapcsolat létrejött...";

if ( $_GET["cat"] == "AT") {
    if ( is_null( $_GET["id"] ) ) {
        $sql = "SELECT * FROM `AUTHOR` ORDER BY AT_AUTHORNAME";
    } else {
        $sql = "SELECT * FROM `AUTHOR` WHERE AT_ID = " . $_GET["id"];
    }
} elseif ( $_GET["cat"] == "CG") {
        if ( is_null( $_GET["id"] ) ) {
            $sql = "SELECT * FROM `CATEGORY`";
        } else {
            $sql = "SELECT * FROM `CATEGORY` WHERE CG_ID = " . $_GET["id"];
        }
} elseif ( $_GET["cat"] == "BT") {
  if ( is_null( $_GET["id"] ) ) {
      $sql = "SELECT * FROM `BOOKTYPE`";
  } else {
      $sql = "SELECT * FROM `BOOKTYPE` WHERE BT_ID = " . $_GET["id"];
  }
} elseif ( $_GET["cat"] == "OS") {
  if ( is_null( $_GET["id"] ) ) {
      $sql = "SELECT * FROM `OWNERSHIP_STATUS`";
  } else {
      $sql = "SELECT * FROM `OWNERSHIP_STATUS` WHERE OS_ID = " . $_GET["id"];
  }
} elseif ( $_GET["cat"] == "PS") {
  if ( is_null( $_GET["id"] ) ) {
      $sql = "SELECT * FROM `PUBLISHER`";
  } else {
      $sql = "SELECT * FROM `PUBLISHER` WHERE PS_ID = " . $_GET["id"];
  }
} elseif ( $_GET["cat"] == "BK") {
  if ( is_null( $_GET["id"] ) ) {
      $sql = "SELECT BK_ID, BK_BOOKTITLE, BK_READED, AT_AUTHORNAME, BT_TYPENAME, CG_CATEGORY, OS_NAME, PS_PUBLISHERNAME
                FROM BOOK LEFT JOIN PUBLISHER ON BOOK.BK_PS_ID = PUBLISHER.PS_ID
                     LEFT JOIN OWNERSHIP_STATUS ON BOOK.BK_OS_ID = OWNERSHIP_STATUS.OS_ID,
                     AUTHOR, BOOKTYPE, CATEGORY
               WHERE AT_ID = BK_AT
                 AND BT_ID = BK_BT
                 AND CG_ID = BK_CG_ID
                 AND BK_USER = '" . $_GET["user"] . "'";
  } else {
      $sql = "SELECT * FROM `BOOK` WHERE BK_ID = " . $_GET["id"];
  }
} elseif ( $_GET["cat"] == "US" ) {
    $sql = "SELECT * FROM `USERS` WHERE US_USERNAME = '" . $_GET["username"] . "' AND US_PASSWORD = PASSWORD('" . $_GET["password"] . "')";
} else {
    $sql = "SELECT * FROM `AUTHOR`";
    
}
    
$result=mysqli_query($conn,$sql);

$outp = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($outp);
#echo $_GET["id"];

?>