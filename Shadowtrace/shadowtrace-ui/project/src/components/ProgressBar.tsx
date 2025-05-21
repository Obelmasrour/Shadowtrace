// src/components/ProgressBar.tsx
import { useNProgress } from '@tanem/react-nprogress';

const ProgressBar = ({ isAnimating }: { isAnimating: boolean }) => {
  const { animationDuration, isFinished, progress } = useNProgress({ isAnimating });

  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
      }}
      className="fixed top-0 left-0 w-full z-[9999]"
    >
      <div
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`,
        }}
        className="bg-blue-500 h-1 w-full"
      />
    </div>
  );
};

export default ProgressBar;
