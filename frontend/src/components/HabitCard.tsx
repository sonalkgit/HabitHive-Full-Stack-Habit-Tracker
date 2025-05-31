import React from 'react';

interface HabitCardProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  title,
  completed,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="habit-card">
      <h3 style={{ textDecoration: completed ? 'line-through' : 'none' }}>{title}</h3>
      <button onClick={onToggle}>{completed ? 'Undo' : 'Complete'}</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default HabitCard;
