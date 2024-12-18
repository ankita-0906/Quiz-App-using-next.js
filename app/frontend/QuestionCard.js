import React, { useEffect, useState } from "react";

export default function QuestionCard({
  question,
  onSaveAnswer,
  onHint,
  onPrev,
  isLastQuestion,
  userAnswer,
  hintUsed,
}) {
  const [selectedOption, setSelectedOption] = useState(""); // Local state for selected option

  // When navigating back to a previous question, initialize the answer
  useEffect(() => {
    console.log(userAnswer)
    setSelectedOption(userAnswer||"");
    // 
  }, [question,userAnswer]);

  const handleOptionChange = (option) => {
    console.log(option)
    setSelectedOption(option); // Update local selection
  };

  const handleSave = () => {
    console.log(selectedOption)
    onSaveAnswer(selectedOption||""); // Save answer (empty if none selected)
  };

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl mb-4">Question: {question.question}</h2>

      {/* Options */}
      {["option1", "option2"].map((optionKey) => (
        <div key={optionKey} className="mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value={question[optionKey]}
              checked={selectedOption === question[optionKey]} // Retains answer on reload
              onChange={() => handleOptionChange(question[optionKey])}
              className="mr-2"
            />
            {question[optionKey]}
          </label>
        </div>
      ))}

      {/* Hint Button */}
      <button
        onClick={onHint}
        disabled={hintUsed}
        className="bg-yellow-500 text-white py-1 px-3 rounded mt-2 hover:bg-yellow-600 disabled:bg-gray-300"
      >
        {hintUsed ? "Hint Used" : "Use Hint (-5 points)"}
      </button>

      {hintUsed && <p className="italic text-sm mt-2">{question.hint}</p>}

      {/* Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onPrev}
          disabled={question.id === 1}
          className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500 disabled:bg-gray-300"
        >
          Previous
        </button>

        <button
       onClick={handleSave}
       className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
       >
       {isLastQuestion ? "ready to submit" : "Save & Next"}
       </button>
      </div>
    </div>
  );
}