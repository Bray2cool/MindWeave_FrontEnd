"use client";
import { useEffect, useState, FC } from 'react';

const prompts: string[] = [
  "What’s been on your mind the most today?",
  "Describe a small win from today. Even if it felt invisible.",
  "What emotion have you been avoiding lately?",
  "Is there something you’ve been trying to prove to yourself?",
  "When did you feel most like yourself this week?",
  "What thought have you had more than once this week?",
  "What are you most grateful for today, even slightly?",
  "Is there a feeling or goal you’ve been chasing lately?",
  "What’s something you’ve been putting off?",
  "What’s something you’ve been curious about?",
];

const PromptRotator: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex((prev: number) => (prev + 1) % prompts.length);
        setAnimate(false);
      }, 300); // animation duration
    }, 4000); // switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-2 rounded-lg text-lg text-[#FAF9F6] transition-all h-[3rem] flex items-center justify-center overflow-hidden w-full">
      <div
        key={index}
        className={`transition-all duration-300 ease-in-out transform italic ${
          animate ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {prompts[index]}
      </div>
    </div>
  );
};

export default PromptRotator;