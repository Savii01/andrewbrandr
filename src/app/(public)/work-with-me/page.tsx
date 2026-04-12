"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Pricing from '@/components/public/Pricing';
import FullBrandingForm from '@/components/public/FullBrandingForm';
import StandaloneForm from '@/components/public/StandaloneForm';

function WorkWithMeContent() {
    const searchParams = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        const plan = searchParams.get('plan');
        setSelectedPlan(plan);
    }, [searchParams]);

    return (
        <div className="bg-white dark:bg-black px-6 lg:px-32 py-20 mt-20 min-h-screen">
            {!selectedPlan ? (
                <div className="flex flex-col items-center">
                    <h2 className="text-center font-display text-3xl mb-10 dark:text-white">
                        Hello friend, you&apos;d have to choose a Plan Before We Proceed 😊
                    </h2>
                    <Pricing />
                </div>
            ) : selectedPlan === 'ongoing' ? (
                <StandaloneForm />
            ) : selectedPlan === 'standalone' ? (
                <StandaloneForm />
            ) : selectedPlan === 'fullbranding' ? (
                <FullBrandingForm />
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-center text-xl dark:text-white mb-10">Invalid plan selected</h2>
                    <Pricing />
                </div>
            )}
        </div>
    );
}

export default function WorkWithMePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>}>
            <WorkWithMeContent />
        </Suspense>
    );
}
