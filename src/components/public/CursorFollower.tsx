"use client";

import { useEffect, useState, useRef } from "react";

const CursorFollower = () => {
    const mousePosition = useRef({ x: 0, y: 0 });
    const [trail, setTrail] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePosition.current = { x: event.clientX, y: event.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);

        let animationFrameId: number;
        const followMouse = () => {
            setTrail((prev) => {
                const dx = mousePosition.current.x - prev.x;
                const dy = mousePosition.current.y - prev.y;
                
                // If the distance is very small, don't update to avoid jitter/unnecessary renders
                if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return prev;

                return {
                    x: prev.x + dx * 0.1,
                    y: prev.y + dy * 0.1,
                };
            });
            animationFrameId = requestAnimationFrame(followMouse);
        };

        followMouse();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            className="z-[1500] fixed top-0 left-0 w-4 h-4 bg-orange hidden lg:block rounded-full pointer-events-none"
            style={{
                transform: `translate3d(${trail.x}px, ${trail.y}px, 0)`,
            }}
        />
    );
};

export default CursorFollower;
