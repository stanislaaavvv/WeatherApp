<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 10/20/16
 * Time: 10:22 PM
 */


require_once('../db/db.php');

$id = isset($_POST['data']) ? $_POST['data'] : '';
$hasData = true;

$selectFavourites = $pdo->prepare('SELECT * FROM Favourite');
$selectFavourites->execute();

$favouritesId = $selectFavourites->fetchAll(PDO::FETCH_ASSOC);
$count = count($favouritesId);

for ($i = 0; $i < $count; $i++) {
    if ($favouritesId[$i]['cityid'] == $id || empty($id)) {
        $hasData = false;
    }
}

if ($hasData) {
    $insertFavourite = 'INSERT INTO Favourite(cityid) VALUES (?)';
    $statement = $pdo->prepare($insertFavourite);

    $statement->execute([$id]);
}