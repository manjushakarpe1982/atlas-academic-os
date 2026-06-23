'use client';
import { useState } from 'react';
import { TopicItem } from './components/shared';
import SelectTopic from './components/SelectTopic';
import ChooseMaterial from './components/ChooseMaterial';
import SummaryView from './components/SummaryView';
import FlashcardsView from './components/FlashcardsView';
import PracticeQuiz from './components/PracticeQuiz';
import TargetedPractice from './components/TargetedPractice';

type View = 'topics' | 'choose' | 'summary' | 'flashcards' | 'quiz' | 'targeted';

export default function MaterialsPage() {
  const [view, setView] = useState<View>('topics');
  const [topic, setTopic] = useState<TopicItem | null>(null);
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState('');

  const selectTopic = (t: TopicItem, cls: string, cid: string) => {
    setTopic(t); setClassName(cls); setClassId(cid); setView('choose');
  };
  const selectMaterial = (id: string) => {
    if (id === 'summary') setView('summary');
    else if (id === 'flashcards') setView('flashcards');
    else if (id === 'quiz') setView('quiz');
    else if (id === 'targeted') setView('targeted');
  };
  const backToChoose = () => setView('choose');

  if (view === 'choose' && topic) return <ChooseMaterial topic={topic} onBack={() => setView('topics')} onSelect={selectMaterial} />;
  if (view === 'summary')    return <SummaryView className={className} classId={classId} topic={topic!} onBack={backToChoose} onFlashcards={() => setView('flashcards')} onQuiz={() => setView('quiz')} onTargeted={() => setView('targeted')} />;
  if (view === 'flashcards') return <FlashcardsView className={className} classId={classId} topic={topic!} onBack={backToChoose} onDone={backToChoose} />;
  if (view === 'quiz')       return <PracticeQuiz className={className} classId={classId} topic={topic!} onBack={backToChoose} onDone={backToChoose} />;
  if (view === 'targeted')   return <TargetedPractice className={className} classId={classId} topic={topic!} onBack={backToChoose} onDone={backToChoose} />;

  return <SelectTopic onTopicSelect={selectTopic} />;
}
