/**
 * 🦜 Voice Command Overlay Component
 * Displays available Swahili voice commands
 */

import React from "react";
import { useSwahiliVoice } from "../../hooks/useSwahiliVoice";

interface VoiceCommandOverlayProps {
  show: boolean;
  onClose: () => void;
}

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  show,
  onClose,
}) => {
  const voice = useSwahiliVoice();

  if (!show) return null;

  return (
    <div className="voice-command-overlay">
      <div className="voice-commands-panel">
        <h3>🦜 Amri za Sauti (Voice Commands)</h3>

        <div className="command-categories">
          {["navigation", "shopping", "admin", "help"].map((category) => (
            <div key={category} className="command-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              {voice.getCommandsByCategory(category).map((cmd, index) => (
                <div key={index} className="command-item">
                  <strong>Swahili:</strong> {cmd.swahili.join(", ")}
                  <br />
                  <strong>English:</strong> {cmd.english.join(", ")}
                  <br />
                  <em>{cmd.description}</em>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={onClose}>Close / Funga</button>
      </div>

      <style jsx>{`
        .voice-command-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }

        .voice-commands-panel {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .command-categories {
          margin: 1rem 0;
        }

        .command-category {
          margin-bottom: 1.5rem;
        }

        .command-category h4 {
          color: #2d5016;
          border-bottom: 2px solid #4a7c59;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .command-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #4a7c59;
        }

        .command-item strong {
          color: #2d5016;
        }

        .command-item em {
          color: #666;
          display: block;
          margin-top: 0.25rem;
        }

        button {
          background: #ff6b35;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
          width: 100%;
        }

        button:hover {
          background: #e55a2b;
        }

        @media (max-width: 768px) {
          .voice-commands-panel {
            margin: 1rem;
            padding: 1.5rem;
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceCommandOverlay;
