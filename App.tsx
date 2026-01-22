
import React, { useState } from 'react';
import { generateQuiz } from './geminiService';
import { AppState, QuizData, UserAnswer, MediaFile } from './types';
import QuizGenerator from './components/QuizGenerator';
import QuizDisplay from './components/QuizDisplay';
import QuizResults from './components/QuizResults';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (text: string, questionCount: number, media?: MediaFile) => {
    setState(AppState.GENERATING);
    setError(null);
    try {
      const generatedQuiz = await generateQuiz(text, questionCount, media);
      setQuiz(generatedQuiz);
      setUserAnswers(generatedQuiz.questions.map(q => ({ questionId: q.id, selectedOption: null })));
      setState(AppState.QUIZ);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setState(AppState.IDLE);
    }
  };

  const handleFinishQuiz = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setState(AppState.RESULTS);
  };

  const resetApp = () => {
    setState(AppState.IDLE);
    setQuiz(null);
    setUserAnswers([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={resetApp}
        >
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg group-hover:bg-indigo-700 transition-colors">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Quiz Master</h1>
        </div>
        
        {state !== AppState.IDLE && (
          <button 
            onClick={resetApp}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Start Over
          </button>
        )}
      </header>

      <main className="w-full max-w-2xl">
        {state === AppState.IDLE && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Ready to test your knowledge?
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Paste notes or upload a textbook image or PDF, and let AI create a custom quiz.
              </p>
            </div>
            
            <QuizGenerator onGenerate={handleGenerate} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {state === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">Crafting your quiz...</h3>
              <p className="text-gray-500 mt-1">Our AI is analyzing your content to pick the best questions.</p>
            </div>
          </div>
        )}

        {state === AppState.QUIZ && quiz && (
          <QuizDisplay 
            quiz={quiz} 
            onFinish={handleFinishQuiz} 
          />
        )}

        {state === AppState.RESULTS && quiz && (
          <QuizResults 
            quiz={quiz} 
            userAnswers={userAnswers} 
            onRestart={resetApp} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-6 text-gray-400 text-sm text-center">
        <p>© {new Date().getFullYear()} AI Quiz Master • Powered by Gemini 3 Flash</p>
      </footer>
    </div>
  );
};

export default App;
