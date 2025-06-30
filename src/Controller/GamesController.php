<?php

namespace App\Controller;

use App\Entity\Games;
use Symfony\Component\Uid\Uuid;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class GamesController extends AbstractController
{
    // cree un lobby
    #[Route('/game/create', name: 'game_create')]
    public function create(EntityManagerInterface $form): Response
    {
        $user = $this->getUser();

        $game = new Games();
        $game->setCode(substr(strtoupper(Uuid::v4()->toRfc4122()), 0, 6));
        $game->addUser($user);
        $game->setStarted(false);

        $form->persist($game);
        $form->flush();

        return $this->redirectToRoute('game_lobby', ['code' => $game->getCode()]);
    }

    // rejoindre le lobby
    #[Route('/game/join/{code}', name: 'game_join')]
    public function join(string $code, EntityManagerInterface $form): Response
    {
        $user = $this->getUser();

        $game = $form->getRepository(Games::class)->findOneBy(['code' => strtoupper($code)]);

        if (!$game || $game->isStarted()) {
            $this->addFlash('error', 'Partie introuvable ou déjà démarrée.');
            return $this->redirectToRoute('home');
        }

        $game->addPlayer($user);
        $form->flush();

        return $this->redirectToRoute('game_lobby', ['code' => $game->getCode()]);
    }

    // le lobby
    #[Route('/game/lobby/{code}', name: 'game_lobby')]
    public function lobby(string $code, EntityManagerInterface $form): Response
    {
        $game = $form->getRepository(Games::class)->findOneBy(['code' => strtoupper($code)]);

        if (!$game) {
            return $this->redirectToRoute('home');
        }

        return $this->render('game/lobby.html.twig', [
            'game' => $game,
        ]);
    }
}
