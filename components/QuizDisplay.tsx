
import React, { useState } from 'react';
import { QuizData, UserAnswer } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface QuizDisplayProps {
  quiz: QuizData;
  onFinish: (answers: UserAnswer[]) => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(
    quiz.questions.map(q => ({ questionId: q.id, selectedOption: null }))
  );

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleSelectOption = (optionIdx: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIdx] = { 
      questionId: currentQuestion.id, 
      selectedOption: optionIdx 
    };
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const isLastQuestion = currentIdx === quiz.questions.length - 1;
  const isSelected = answers[currentIdx].selectedOption !== null;

  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
              Question {currentIdx + 1} of {quiz.questions.length}
            </h3>
            <span className="text-xs font-semibold text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`group flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                answers[currentIdx].selectedOption === idx
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600 ring-opacity-20'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold transition-colors ${
                answers[currentIdx].selectedOption === idx
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={() => onFinish(answers)}
            disabled={!isSelected}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-green-600 shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Submit Quiz
            <CheckCircle2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!isSelected}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Next Question
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;
