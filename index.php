<?php

echo "Hello world";
echo '<br>';

$var1 = 1;
$var2 = 5;
$var3 = 3;

if($var1>$var2&&$var1>$var3){
    echo "$var1 is the maximum number";
}
else if($var2>$var1&&$var2>$var3){
    echo "$var2 is the maximum number";
}
else{
    echo "$var3 is the maximum number";
}

?>
