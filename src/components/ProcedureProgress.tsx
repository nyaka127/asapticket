'use client';
import React from 'react';
import Link from 'next/link';

interface Step {
  id: number;
  label: string;
  icon: string;
  href: string;
}

const steps: Step[] = [
  { id: 1, label: 'FLIGHTS', icon: '✈️', href: '/flights' },
  { id: 2, label: 'HOTELS', icon: '🏨', href: '/hotels' },
  { id: 3, label: 'CARS', icon: '🚗', href: '/cars' },
  { id: 4, label: 'CONFIRM', icon: '🛡️', href: '/success' },
];

export function ProcedureProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-brand-sidebar py-4 px-6 border-b border-white/5 w-full">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;
          
          const content = (
            <div className={`flex flex-col items-center gap-1.5 transition-all duration-700 cursor-pointer group ${isActive || isCompleted ? 'opacity-100' : 'opacity-30 grayscale cursor-not-allowed'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-xl font-black italic border-2 transition-all group-hover:scale-110 ${isActive ? 'bg-brand-secondary text-brand-primary border-brand-secondary ring-4 ring-white/10' : isCompleted ? 'bg-brand-primary text-white border-white/20' : 'bg-white/10 text-white border-white/5'}`}>
                {isCompleted ? '✓' : step.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] font-sans ${isActive ? 'text-brand-secondary' : 'text-white/40'}`}>
                {step.label}
              </span>
            </div>
          );

          return (
            <React.Fragment key={step.id}>
              {isCompleted ? (
                <Link href={step.href}>{content}</Link>
              ) : content}
              
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 bg-white/5 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-brand-secondary transition-all duration-1000 ease-in-out" 
                    style={{ width: currentStep > step.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
