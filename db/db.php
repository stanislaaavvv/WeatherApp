<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 10/21/16
 * Time: 9:55 AM
 */

const DB_User = 'root';
const DB_Pass = 'root';

$pdo = new PDO('mysql:host=127.0.0.1;dbname=WeatherApp', DB_User, DB_Pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);