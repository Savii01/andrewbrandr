"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";

interface Step {
    id: number;
    title: string;
    description?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
    className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    steps,
    currentStep,
    onStepClick,
    className = "",
}) => {
    return (
        <div className={`space-y-0 ${className}`}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep - 1;
                const isActive = index === currentStep - 1;

                return (
                    <div
                        key={step.id}
                        className={`relative group ${onStepClick ? "cursor-pointer" : ""}`}
                        onClick={() => onStepClick?.(step.id)}
                    >
                        {/* Connecting Line (Vertical) */}
                        {index !== steps.length - 1 && (
                            <div
                                className={`absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+8px)] transition-colors duration-500 ${isCompleted ? "bg-orange" : "bg-white/10"
                                    }`}
                            />
                        )}

                        <div className={`flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 ${isActive ? "bg-white/5 border border-white/10" : "bg-transparent border border-transparent"
                            }`}>
                            {/* Circle Indicator */}
                            <div className="relative shrink-0 mt-0.5">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isActive
                                        ? "border-orange bg-transparent shadow-[0_0_10px_rgba(204,51,0,0.3)]"
                                        : isCompleted
                                            ? "border-orange bg-orange text-white"
                                            : "border-white/20 bg-transparent text-white/20"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <FaCheck size={12} className="stroke-2" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? "bg-orange" : "bg-transparent border border-white/20"
                                            }`} />
                                    )}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div>
                                <p className={`text-lg font-bold transition-all duration-500 ${isActive ? "text-white" : isCompleted ? "text-white/80" : "text-white/30"
                                    }`}>
                                    {step.title}
                                </p>
                                {step.description && (
                                    <p className={`text-[13px] mt-0.5 transition-all duration-500 ${isActive ? "text-white/60" : "text-white/20"
                                        }`}>
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
