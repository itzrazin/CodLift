<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://accounts.google.com https://www.googletagmanager.com; connect-src 'self' https://accounts.google.com https://analytics.google.com https://www.google.com https://ep1.adtrafficquality.google; frame-src https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'domain' => '', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header('HTTP/1.1 403 Forbidden');
    die('Forbidden');
}

if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    setcookie(session_name(), '', time() - 3600, '/');
    header('Location: login_signup.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    <style>body{font-family:sans-serif;background:#f4f7f6;padding:2rem;}.card{background:#fff;padding:1rem;border-radius:8px;display:inline-block;margin-right:1rem;}</style>
</head>
<body>
    <h1>Admin Dashboard</h1>
    <div class="card">Total Users: 124</div>
    <div class="card">Active Sessions: 5</div>
    <br><br>
    <a href="?logout=true">Logout</a>
</body>
</html>