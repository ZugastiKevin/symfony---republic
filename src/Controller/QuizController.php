<?php

namespace App\Controller;

use App\Entity\Quiz;
use App\Form\QuizTypeForm;
use App\Repository\QuizRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class QuizController extends AbstractController
{
    // tous les quiz
    #[Route('/quiz', name: 'allquiz')]
    public function reads(QuizRepository $repository): Response
    {
        $quiz = $repository->findAll();

        return $this->render('quiz/all.html.twig', [
            'allquiz' => $quiz,
        ]);
    }

    // quiz par id
    #[Route('/quiz/{id}', name: 'quiz')]
    public function read(Quiz $quiz): Response
    {
        return $this->render('quiz/index.html.twig', [
            'quiz' => $quiz,
        ]);
    }

    // creation / modification quiz
    #[Route('/update_clock/{id}', name: 'update_clock')]
    #[Route('/create_clock', name: 'create_clock')]
    public function addClock(?Quiz $quiz, Request $request, EntityManagerInterface $entityManager): Response
    {
        if (!$quiz) {
            $quiz = new Quiz;
        }

        $form = $this->createForm(QuizTypeForm::class, $quiz);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $quiz->setUser($this->getUser());
            $entityManager->persist($quiz);
            $entityManager->flush();
                
            return $this->redirectToRoute('home');
        }

        return $this->render('quiz/createUpdateQuiz.html.twig', [
            'quizCreateForm' => $form->createView(),
            'quizUpdateForm' => $quiz->getId() !== null,
        ]);
    }

    // supression dun quiz
    #[Route('/delete_quiz/{id}', name: 'delete_quiz')]
    public function deleteClock(Quiz $quiz, Request $request, EntityManagerInterface $entityManager)
    {
        if($this->isCsrfTokenValid("SUP". $quiz->getId(),$request->get('_token'))){
            $entityManager->remove($quiz);
            $entityManager->flush();
            return $this->redirectToRoute('home');
        }
    }
}
