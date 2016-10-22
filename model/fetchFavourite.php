<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 10/21/16
 * Time: 9:52 AM
 */

require_once('../db/db.php');

$selectFavourites = $pdo->prepare('SELECT * FROM Favourite');
$selectFavourites->execute();

$favouritesId = $selectFavourites->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($favouritesId);