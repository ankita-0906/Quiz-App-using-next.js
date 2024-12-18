"use client";

import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

export default function Quiz() {
  const [questions, setQuestions] = useState([]); // Holds all questions fetched
  const [currentIndex, setCurrentIndex] = useState(0); // Current question index
  const [score, setScore] = useState(0); // Tracks the score
  const [answers, setAnswers] = useState({}); // Stores user answers
  const [quizCompleted, setQuizCompleted] = useState(false); // Tracks quiz completion
  const [hintsUsed, setHintsUsed] = useState({}); // Tracks hints used

  // Fetch questions from backend API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3000/backend/firebase");
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Handle hint usage
  const handleHint = () => {
    const questionId = questions[currentIndex]?.id;
    if (!hintsUsed[questionId]) {
      setHintsUsed((prev) => ({ ...prev, [questionId]: true }));
      setScore((prevScore) => prevScore - 5);
    }
  };

  // Save the selected answer and move to the next question
  const handleSaveAnswer = (answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentIndex].id]: answer || "", // Save answer or empty if none selected
    }));

    // Move to the next question only if not the last one
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Go back to the previous question
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Calculate final score and submit the quiz
  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let finalScore = 0;

    questions.forEach((question) => {
      const userAnswer = answers[question.id] || "";
      if (userAnswer === question.answer) {
        finalScore += 20; // Correct answer: +20 points
      } else if (userAnswer !== "") {
        finalScore -= 10; // Incorrect answer: -10 points
      }
    });

    setScore(finalScore);
    setQuizCompleted(true);
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setHintsUsed({});
    setQuizCompleted(false);
  };

  if (questions.length === 0) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4">Quiz App</h1>
      
      {quizCompleted ? (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto text-center">
        <h2 className="text-3xl text-white mb-4">Quiz Completed</h2>
        <p className="text-xl text-white mb-4">Total Score: {score}</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleRestartQuiz}
        >
          Restart Quiz
        </button>
      </div>
      
      ) : (
        <>
          <QuestionCard
            question={questions[currentIndex]}
            onSaveAnswer={handleSaveAnswer}
            onHint={handleHint}
            onPrev={handlePrevQuestion}
            isLastQuestion={currentIndex === questions.length - 1}
            userAnswer={answers[questions[currentIndex]?.id] || ""}
            hintUsed={hintsUsed[questions[currentIndex]?.id] || false}
          />

          {/* Submit Button (Enabled only after all questions are answered) */}
          {Object.keys(answers).length === questions.length && (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </button>
          )}
        </>
      )}
    </div>
  );
}
