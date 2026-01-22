
import React from 'react';
import { QuizData, UserAnswer } from '../types';
import { RefreshCw, CheckCircle2, XCircle, Info, Trophy } from 'lucide-react';

interface QuizResultsProps {
  quiz: QuizData;
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, userAnswers, onRestart }) => {
  const score = userAnswers.reduce((acc, ans, idx) => {
    return acc + (ans.selectedOption === quiz.questions[idx].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = (score / quiz.questions.length) * 100;

  return (
    <div className="w-full space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      {/* Score Header */}
      <div className="bg-indigo-600 text-white rounded-3xl p-10 shadow-2xl shadow-indigo-200 text-center relative overflow-hidden">
        <Trophy className="w-24 h-24 absolute -right-6 -bottom-6 text-white/10 rotate-12" />
        <div className="relative z-10">
          <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm mb-2">Quiz Completed</p>
          <h2 className="text-6xl font-black mb-4">{score} / {quiz.questions.length}</h2>
          <div className="bg-white/20 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm text-lg font-bold">
            {Math.round(percentage)}% Success
          </div>
          <p className="mt-6 text-indigo-100 text-sm max-w-xs mx-auto">
            {percentage >= 80 ? "Amazing job! You've mastered this topic." : 
             percentage >= 50 ? "Good effort! Review the missed questions below." : 
             "Keep studying! Practical repetition is the key to mastery."}
          </p>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 px-2">Review Answers</h3>
        {quiz.questions.map((q, idx) => {
          const userAnswer = userAnswers[idx].selectedOption;
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div key={q.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <div className={`mt-1 flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-4">{q.question}</h4>
                  
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswer;
                      const isUserOpt = optIdx === userAnswer;
                      
                      let variantClasses = "bg-gray-50 text-gray-600 border-transparent";
                      if (isCorrectOpt) variantClasses = "bg-green-50 text-green-700 border-green-200 border-2";
                      if (isUserOpt && !isCorrect) variantClasses = "bg-red-50 text-red-700 border-red-200 border-2";

                      return (
                        <div key={optIdx} className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${variantClasses}`}>
                          <span>{opt}</span>
                          {isCorrectOpt && <span className="text-[10px] font-black uppercase tracking-tighter bg-green-200 px-2 py-0.5 rounded ml-2">Correct</span>}
                          {isUserOpt && !isCorrect && <span className="text-[10px] font-black uppercase tracking-tighter bg-red-200 px-2 py-0.5 rounded ml-2">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-800 leading-relaxed italic">
                      <span className="font-bold not-italic">Explanation:</span> {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-[0.98] mb-12"
      >
        <RefreshCw className="w-6 h-6" />
        Try Another Topic
      </button>
    </div>
  );
};

export default QuizResults;
