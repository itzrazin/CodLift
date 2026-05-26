<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://accounts.google.com https://www.googletagmanager.com; connect-src 'self' https://accounts.google.com https://analytics.google.com https://www.google.com https://ep1.adtrafficquality.google; frame-src https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'domain' => '', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

if (!isset($_GET['code']) || !isset($_GET['state']) || $_GET['state'] !== $_SESSION['state']) {
    die("Invalid request.");
}

$postFields = [
    'code' => $_GET['code'],
    'client_id' => 'YOUR_CLIENT_ID',
    'client_secret' => 'YOUR_CLIENT_SECRET',
    'redirect_uri' => 'YOUR_REDIRECT_URI',
    'grant_type' => 'authorization_code'
];

$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

$token = $response['access_token'];
$ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
$user = json_decode(curl_exec($ch), true);
curl_close($ch);

$google_id = filter_var($user['sub'], FILTER_SANITIZE_SPECIAL_CHARS);
// MOCK DB CHECK: SELECT * FROM users WHERE google_id = '$google_id'
// MOCK DB INSERT: INSERT INTO users (google_id, email, name, role) VALUES ('$google_id', ..., 'user')

$_SESSION['user_id'] = $google_id;
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = 'user'; 

header('Location: admin.php');
exit;
?>