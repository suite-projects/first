<?php
function timer()
{
    $time = explode(' ', microtime());
    return $time[0]+$time[1];
}
$beginning = timer();
?>
<html>
    <!-- The content of your page -->
        Page generated in <?php echo round(timer()-$beginning,6); ?> seconds.
    </body>
</html>