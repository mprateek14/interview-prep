import React, { useRef, useEffect } from 'react';

export default function CanvasDragCircle() {
    const canvasRef = useRef(null);
    
    // 1. Store state in refs to completely bypass React's render cycle
    const circlesRef = useRef([]);
    const draftRef = useRef(null);
    const isDrawingRef = useRef(false);

    // 2. The Imperative Render Loop
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear the previous frame entirely
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render all committed circles
        circlesRef.current.forEach(circle => {
            ctx.beginPath();
            ctx.arc(circle.cx, circle.cy, circle.r, 0, 2 * Math.PI);
            ctx.fillStyle = circle.color;
            ctx.globalAlpha = 0.7;
            ctx.fill();
        });

        // Render the transient draft circle
        const draft = draftRef.current;
        if (isDrawingRef.current && draft) {
            ctx.beginPath();
            ctx.arc(draft.cx, draft.cy, draft.r, 0, 2 * Math.PI);
            ctx.fillStyle = draft.color;
            ctx.globalAlpha = 0.7;
            ctx.fill();
        }
    };

    const handleMouseDown = (e) => {
        isDrawingRef.current = true;
        draftRef.current = {
            cx: e.clientX,
            cy: e.clientY,
            r: 0,
            color: 'red'
        };
    };

    const handleMouseMove = (e) => {
        if (!isDrawingRef.current || !draftRef.current) return;

        const draft = draftRef.current;
        // Euclidean distance for dynamic radius
        const r = Math.hypot(e.clientX - draft.cx, e.clientY - draft.cy);

        // Continuous collision check
        let isOverlapping = false;
        const committedCircles = circlesRef.current;
        
        for (let i = 0; i < committedCircles.length; i++) {
            const existing = committedCircles[i];
            const distance = Math.hypot(existing.cx - draft.cx, existing.cy - draft.cy);
            if (distance < (existing.r + r)) {
                isOverlapping = true;
                break;
            }
        }

        // Mutate the ref directly
        draft.r = r;
        draft.color = isOverlapping ? 'blue' : 'red';
        
        // Command the canvas to redraw immediately
        draw();
    };

    const handleMouseUp = () => {
        if (!isDrawingRef.current || !draftRef.current) return;
        isDrawingRef.current = false;
        
        if (draftRef.current.r > 0) {
            circlesRef.current.push({ ...draftRef.current });
        }
        draftRef.current = null;
        
        // Final draw to commit the shape
        draw();
    };

    // Initialize canvas sizing
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
        
        // Note: A robust implementation would also include a window resize listener here
    }, []);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
                display: 'block', 
                backgroundColor: '#f0f0f0', 
                cursor: 'crosshair',
                width: '100vw',
                height: '100vh'
            }}
        />
    );
}