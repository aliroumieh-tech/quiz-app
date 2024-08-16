import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>();
  const [questionNb, setQuestionNb] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        alert("An error occurred while fetching questions.");
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const fetchedCorrectAnswer = questions[questionNb].correct_answer;
      setCorrectAnswer(fetchedCorrectAnswer);

      const incorrectAnswers = questions[questionNb].incorrect_answers;
      const allAnswers = [...incorrectAnswers, fetchedCorrectAnswer];

      setShuffledAnswers(shuffleArray(allAnswers));
      setIsAnswered(false);
      setSelectedAnswer(null);
    }
  }, [questionNb, questions]);

  function shuffleArray(array: string[]): string[] {
    let newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }

  const handleClick = (answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const getButtonClass = (answer: string) => {
    if (!isAnswered) return "answer";
    if (answer === correctAnswer) return "correctAnswer";
    if (answer === selectedAnswer) return "wrongAnswer";
    return "answer";
  };

  if (questions.length === 0) {
    return <div className="container">Loading...</div>;
  } else if (questionNb === 9) {
    return (
      <>
        <div className="theEnd">No more questions!</div>
        <button
          className="tryAgain"
          onClick={() => {
            setQuestionNb(0);
            setScore(0);
          }}
        >
          try again
        </button>
      </>
    );
  }

  return (
    <div className="container">
      <h1 className="question">{questions[questionNb].question}</h1>
      <div className="answers">
        {shuffledAnswers.map((answer, index) => (
          <button
            className={getButtonClass(answer)}
            key={index}
            onClick={() => handleClick(answer)}
            disabled={isAnswered}
          >
            {answer}
          </button>
        ))}
      </div>
      <button
        className="next"
        onClick={() => {
          setQuestionNb((prev) => prev + 1);
        }}
      >
        Next Question
      </button>
      <h1 className="score" style={{ marginTop: 0, color: "white" }}>
        Score: {score}
      </h1>
    </div>
  );
}

export default App;
