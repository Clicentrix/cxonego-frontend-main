import React from 'react';
import LeadAssignment from '../../components/leads/leadAssignment/LeadAssignment';

const LeadAssignmentPage: React.FC = () => {
  return (
    <div className="lead-assignment-page" style={{ padding: '24px' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1>Lead Assignment</h1>
        <p>Configure how leads are automatically assigned to team members.</p>
        <LeadAssignment />
      </div>
    </div>
  );
};

export default LeadAssignmentPage; 