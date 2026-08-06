"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { getVerification } from "@/lib/firebase/verifications";
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from "react-icons/fi";
import Link from "next/link";

type VerifyState = "loading" | "success" | "invalid" | "expired" | "error";

function VerifyContent() {
    const params = useSearchParams();
    const docId = params.get("docId");
    const code = params.get("code");
    const [state, setState] = useState<VerifyState>("loading");

    useEffect(() => {
        if (!docId || !code) {
            setState("invalid");
            return;
        }

        (async () => {
            try {
                const v = await getVerification(docId);
                if (!v) {
                    setState("invalid");
                    return;
                }
                if (v.code !== code) {
                    setState("invalid");
                    return;
                }
                if (Date.now() > v.expiresAt) {
                    setState("expired");
                    return;
                }

                if (v.targetType === "brief") {
                    await updateDoc(doc(db, "briefs", v.targetId), {
                        "lead.emailVerified": true,
                    });
                } else if (v.targetType === "engagement") {
                    await updateDoc(doc(db, "engagements", v.targetId), {
                        "contact.emailVerified": true,
                    });
                }
                setState("success");
            } catch (e) {
                console.error("[Verify Email]", e);
                setState("error");
            }
        })();
    }, [docId, code]);

    return (
        <div className="min-h-screen pt-32 bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
                {state === "loading" && (
                    <div className="flex flex-col items-center">
                        <FiLoader size={40} className="text-orange animate-spin mb-5" />
                        <p className="text-gray-500 font-bold">Verifying your email address...</p>
                    </div>
                )}

                {state === "success" && (
                    <>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiCheckCircle size={42} className="text-green-500" />
                        </div>
                        <h1 className="text-3xl font-customFont font-bold text-black mb-4 tracking-tighter">
                            Email Verified
                        </h1>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            Thanks! Your email has been confirmed. You can close this page —
                            we'll use this address for your project updates and meeting invites.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange transition-colors"
                        >
                            <FiMail size={15} />
                            Back to Brandr
                        </Link>
                    </>
                )}

                {state === "invalid" && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiXCircle size={42} className="text-red-500" />
                        </div>
                        <h1 className="text-3xl font-customFont font-bold text-black mb-4 tracking-tighter">
                            Link Invalid
                        </h1>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            This verification link is not valid. Please request a new
                            verification email from the studio.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange transition-colors">
                            Back to Brandr
                        </Link>
                    </>
                )}

                {state === "expired" && (
                    <>
                        <div className="w-20 h-20 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiXCircle size={42} className="text-orange" />
                        </div>
                        <h1 className="text-3xl font-customFont font-bold text-black mb-4 tracking-tighter">
                            Link Expired
                        </h1>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            This verification link has expired. Please contact the studio to
                            receive a new one.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange transition-colors">
                            Back to Brandr
                        </Link>
                    </>
                )}

                {state === "error" && (
                    <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiXCircle size={42} className="text-red-500" />
                        </div>
                        <h1 className="text-3xl font-customFont font-bold text-black mb-4 tracking-tighter">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            We couldn't verify your email right now. Please try again in a few
                            minutes.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange transition-colors">
                            Back to Brandr
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
