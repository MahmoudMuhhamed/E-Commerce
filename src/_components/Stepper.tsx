'use client';

import { FaEnvelope, FaKey, FaLock, FaCheck } from 'react-icons/fa';

interface StepperProps {
  currentStep: 'email' | 'code' | 'password';
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { id: 'email', label: 'Email', icon: FaEnvelope },
    { id: 'code', label: 'Code', icon: FaKey },
    { id: 'password', label: 'Password', icon: FaLock },
  ];

  const getStepState = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    if (stepIndex === currentIndex) return 'step-active';
    if (stepIndex < currentIndex) return 'step-completed';
    return 'step-inactive';
  };

  const getConnectorState = (index: number) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    return index < currentIndex ? 'connector-done' : '';
  };

  return (
    <div className="mt-6">
      <div className="flex items-center  justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = getStepState(step.id);
          const isCompleted = state === 'step-completed';

          return (
            <div key={step.id}>
              {/* Step Circle */}
              <div className="flex justify-between items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    state === 'step-active'
                      ? 'bg-green-600 text-white ring-4 ring-green-200'
                      : state === 'step-completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 mx-1.5 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="w-3 h-3" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 transition-all ${
                  state === 'step-active' || state === 'step-completed'
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}>
                  
                </span>

              {/* Connector Line (between steps) */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 rounded-full transition-all ${
                  getConnectorState(index) === 'connector-done'
                  ? 'bg-green-600'
                  : 'bg-gray-200'
                }`} />
              )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
