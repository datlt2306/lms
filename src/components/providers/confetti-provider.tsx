"use client";
import ReactConfetti from "react-confetti";
import React from "react";

import { useConfettiStore } from "../../../hooks/use-confetti-store";

type Props = {};

const ConfettiProvider = () => {
    const confetti = useConfettiStore();
    if (!confetti.isOpen) return null;
    return (
        <ReactConfetti
            className="pointer-events-non z-[100]"
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={() => {
                confetti.onClose();
            }}
        >
            ConfettiProvider
        </ReactConfetti>
    );
};

export default ConfettiProvider;
