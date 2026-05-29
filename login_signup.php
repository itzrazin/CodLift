<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://accounts.google.com https://www.googletagmanager.com; connect-src 'self' https://accounts.google.com https://analytics.google.com https://www.google.com https://ep1.adtrafficquality.google; frame-src https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'domain' => '', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
session_start();
$_SESSION['state'] = bin2hex(random_bytes(16));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login / Signup</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>body{font-family:'Inter',sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f4f7f6;}.card{background:#fff;padding:2rem;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);width:100%;max-width:400px;}input{width:100%;padding:0.75rem;margin:0.5rem 0;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;}button{width:100%;padding:0.75rem;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-top:1rem;}.google-btn{background:#db4437;margin-top:0.5rem;text-decoration:none;display:block;text-align:center;padding:0.75rem;color:#fff;border-radius:4px;}</style>
</head>
<body>
    <div class="card">
        <form action="login_signup.php" method="POST">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Sign In</button>
        </form>
        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=<?php echo getenv('GOOGLE_CLIENT_ID'); ?>&redirect_uri=<?php echo getenv('GOOGLE_REDIRECT_URI'); ?>&response_type=code&scope=email%20profile&state=<?php echo $_SESSION['state']; ?>" class="google-btn">Sign in with Google</a>
    </div>
</body>
</html>