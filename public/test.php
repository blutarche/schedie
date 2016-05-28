<?php
// $text = $_POST['text'];
$json = json_decode(file_get_contents('php://input'), true);
$text = $json["data"];
$index = 0;
$array = array();
foreach(preg_split("/((\r?\n)|(\r\n?))/", $text) as $line){
    if ($line != '') {
        array_push($array, array("line" => $line, "name" => "Harry Potter and the Sorcerer's Stone"));
        $index++;
    }
} 
if ($text != '') {
    echo json_encode(array("results" => $array));
    return 1;
}
else {
    echo "failed";
    return 0;
}
?>