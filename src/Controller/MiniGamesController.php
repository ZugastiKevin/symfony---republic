<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MiniGamesController extends AbstractController
{
    #[Route('/games', name: 'mini_games')]
    public function index(): Response
    {
        return $this->render('mini_games/index.html.twig', [
            'controller_name' => 'MiniGamesController',
        ]);
    }
}
