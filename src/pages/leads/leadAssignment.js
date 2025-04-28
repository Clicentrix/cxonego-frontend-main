import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LeadAssignment from '../../components/leads/leadAssignment/LeadAssignment';
const LeadAssignmentPage = () => {
    return (_jsx("div", { className: "lead-assignment-page", style: { padding: '24px' }, children: _jsxs("div", { style: {
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }, children: [_jsx("h1", { children: "Lead Assignment" }), _jsx("p", { children: "Configure how leads are automatically assigned to team members." }), _jsx(LeadAssignment, {})] }) }));
};
export default LeadAssignmentPage;
