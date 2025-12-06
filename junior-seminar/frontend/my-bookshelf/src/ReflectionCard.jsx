import React, { useRef, useEffect } from "react";
import "./ReflectionCard.css";

export default function ReflectionCard(props) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (props.editMode && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [props.editMode]);

    const handleBlur = () => {
        if (props.reflection.trim()) {
            props.handleSave();
        }
        props.setEditMode(false);
    };

    return (
        <div
            className={`reflection-card ${props.editMode ? "editing" : ""}`}
            onClick={() => !props.editMode && props.setEditMode(true)}
            tabIndex={0}>
            <p>Your Reflection:</p>
            {!props.editMode ? (
                <div className="reflection-text" aria-label="Reflection text">
                    {props.reflection.trim() ? props.reflection : <em>Click to write your reflection...</em>}
                    <span className="edit-icon">✏️</span>
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    className="reflection-textarea"
                    value={props.reflection}
                    onChange={(e) => props.setReflection(e.target.value)}
                    onBlur={handleBlur}
                    rows={6}
                    aria-label="Edit reflection"
                />
            )}
        </div>
    );
}
