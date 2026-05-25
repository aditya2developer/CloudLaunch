<?php

$server = "YOUR_SERVER.database.windows.net";
$database = "messagedb";
$username = "CloudSA09e89a90";
$password = "password";

$conn = new PDO(
    "sqlsrv:server=$server;Database=$database",
    $username,
    $password
);

$name = $_POST['name'];
$message = $_POST['message'];

$sql = "INSERT INTO messages (name, message)
VALUES (?, ?)";

$stmt = $conn->prepare($sql);
$stmt->execute([$name, $message]);

echo "Message Saved";

?>