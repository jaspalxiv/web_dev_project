"use client";

import { Suspense } from "react";
import AuthPage from "./AuthPage"; // adjust the path if needed

export default function Page() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading authentication UI...</div>}>
            <AuthPage />
        </Suspense>
    );
}