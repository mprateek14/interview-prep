import React, { useState } from 'react';

export default function DragCircleApp() {
    const [circles, setCircles] = useState([]);
    const [draftCircle, setDraftCircle] = useState(null);

    const handleMouseDown = (e) => {
        // Start drawing: Record center coordinates
        setDraftCircle({
            cx: e.clientX,
            cy: e.clientY,
            r: 0,
            color: 'red' // default
        });
    };

    const handleMouseMove = (e) => {
        if (!draftCircle) return;

        // 1. Calculate the dynamic radius
        const r = Math.hypot(e.clientX - draftCircle.cx, e.clientY - draftCircle.cy);

        // 2. Continuously check for collisions against committed circles
        let isOverlapping = false;
        for (let i = 0; i < circles.length; i++) {
            const existingCircle = circles[i];
            const distance = Math.hypot(existingCircle.cx - draftCircle.cx, existingCircle.cy - draftCircle.cy);
            
            if (distance < (existingCircle.r + r)) {
                isOverlapping = true;
                break;
            }
        }

        // 3. Update transient state
        setDraftCircle(prev => ({
            ...prev,
            r,
            color: isOverlapping ? 'blue' : 'red'
        }));
    };

    const handleMouseUp = () => {
        if (!draftCircle) return;

        // Only commit if it actually has a radius > 0
        if (draftCircle.r > 0) {
            setCircles(prev => [...prev, { ...draftCircle, id: crypto.randomUUID() }]);
        }
        
        // Clear the transient state
        setDraftCircle(null);
    };

    // Helper function to render a circle object
    const renderCircle = (circle, key) => (
        <div
            key={key}
            style={{
                position: 'absolute',
                left: circle.cx - circle.r,
                top: circle.cy - circle.r,
                width: circle.r * 2,
                height: circle.r * 2,
                borderRadius: '50%',
                backgroundColor: circle.color,
                opacity: 0.7, // Added opacity to see overlaps clearly
                pointerEvents: 'none', // Prevents mouse events from firing on the circles
                boxSizing: 'border-box'
            }}
        />
    );

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // CRITICAL: Stop drawing if mouse leaves the window
            style={{ 
                height: '100vh', 
                width: '100vw', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                cursor: 'crosshair' // Better UX for drawing
            }}
        >
            {/* Render committed circles */}
            {circles.map(c => renderCircle(c, c.id))}
            
            {/* Render the circle currently being drawn */}
            {draftCircle && renderCircle(draftCircle, 'draft')}
        </div>
    );
}