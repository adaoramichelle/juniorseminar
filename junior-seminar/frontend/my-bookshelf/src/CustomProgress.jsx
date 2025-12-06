import React from 'react';
import './CustomProgress.css';
function CustomProgress(props) {
    return (
        <div className="progress-container">
            <div
                className={`progress-bar ${props.progress === 100 ? 'full' : ''}`}
                style={{ width: `${props.progress}%` }}
            />
            <span className="progress-label">{props.progress}%</span>
        </div>
    );
}
export default CustomProgress;
