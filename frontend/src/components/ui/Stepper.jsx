import { useState, Children, useEffect } from 'react';
import SpecularButton from './SpecularButton';

export const Step = ({ children }) => {
  return <div className="step-content animate-fade-in">{children}</div>;
};

export default function Stepper({
  children,
  initialStep = 0,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Previous',
  nextButtonText = 'Next',
  className = ''
}) {
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    if (initialStep >= 0 && initialStep < totalSteps) {
      setCurrentStep(initialStep);
    }
  }, [initialStep, totalSteps]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    } else {
      onFinalStepCompleted?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className={`glass-panel reflective-card p-6 rounded-2xl flex flex-col justify-between shadow-ambient ${className}`}>
      {/* Progress Header */}
      <div className="relative mb-8 select-none">
        {/* Progress Lines Container (aligned with circle centers) */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 z-0">
          {/* Progress Line Background */}
          <div className="absolute inset-0 bg-outline-variant/35" />
          {/* Active Progress Line */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Step Circles */}
        <div className="relative z-10 flex justify-between">
          {stepsArray.map((_, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            
            return (
              <button
                key={idx}
                onClick={() => {
                  if (idx <= currentStep || isCompleted) {
                    setCurrentStep(idx);
                    onStepChange?.(idx);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-background' 
                    : isActive 
                      ? 'bg-background border-primary text-primary shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                      : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                ) : (
                  idx + 1
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="flex-1 min-h-[140px] flex flex-col justify-center text-on-surface text-xs leading-relaxed py-2">
        {stepsArray[currentStep]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4 mt-4">
        <SpecularButton
          disabled={currentStep === 0}
          onClick={handleBack}
          baseColor="#1d1a22"
          textColor="#c4c4c4"
          lineColor="#6c6c6c"
          radius={8}
          size="sm"
          intensity={0.5}
        >
          {backButtonText}
        </SpecularButton>
        
        <SpecularButton
          onClick={handleNext}
          baseColor="#10b981"
          textColor="#ffffff"
          tint="#10b981"
          tintOpacity={0.15}
          lineColor="#ffffff"
          radius={8}
          size="sm"
          intensity={1.0}
        >
          {currentStep === totalSteps - 1 ? 'Finish' : nextButtonText}
        </SpecularButton>
      </div>
    </div>
  );
}
