import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, Button, Select, Modal, message, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import "../../../styles/leads/leadAssignment.css";
import api from '../../../services/axiosGlobal';
import { getUserById } from '../../../redux/features/authenticationSlice';
const { Option } = Select;
const DeleteModal = ({ visible, onCancel, onConfirm, count }) => {
    return (_jsxs(Modal, { title: "Confirm Delete", open: visible, onCancel: onCancel, onOk: onConfirm, okText: "Delete", okButtonProps: { danger: true }, children: [_jsxs("p", { children: ["Are you sure you want to delete ", count, " lead assignment", count > 1 ? 's' : '', "?"] }), _jsx("p", { children: "This action cannot be undone." })] }));
};
const UpdateModal = ({ visible, onCancel, onConfirm, leadType, newOwnerName }) => {
    const [updateType, setUpdateType] = useState('none');
    return (_jsx(Modal, { title: "Update Lead Assignments", open: visible, onCancel: onCancel, onOk: () => onConfirm(updateType), okButtonProps: { disabled: updateType === 'none' }, children: _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("p", { children: ["How would you like to update leads of type \"", leadType, "\" assigned to ", newOwnerName, "?"] }), _jsx(Radio.Group, { onChange: (e) => setUpdateType(e.target.value), value: updateType, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [_jsx(Radio, { value: "incoming", children: "Update Only Upcoming Leads" }), _jsx(Radio, { value: "existing", children: "Update Only Existing Leads" }), _jsx(Radio, { value: "both", children: "Update Both Existing and Upcoming Leads" })] }) })] }) }));
};
const LeadAssignmentComponent = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [newLeadType, setNewLeadType] = useState('');
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [organizationUsers, setOrganizationUsers] = useState([]);
    const [userNameMap, setUserNameMap] = useState({});
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.authentication.user);
    const [retryCount, setRetryCount] = useState(0);
    const [selectedLeadTypes, setSelectedLeadTypes] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    useEffect(() => {
        if (!currentUser?.organisation) {
            dispatch(getUserById());
        }
    }, [dispatch]);
    useEffect(() => {
        if (currentUser?.organisation?.organisationId) {
            fetchUsers();
            fetchAssignments();
        }
        else if (retryCount < 3) {
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1);
                dispatch(getUserById());
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentUser?.organisation, retryCount]);
    const columns = [
        {
            title: 'Lead Type',
            dataIndex: 'leadType',
            key: 'leadType',
            sorter: (a, b) => a.leadType.localeCompare(b.leadType),
        },
        {
            title: 'Assign To',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId, record) => (_jsx(Select, { value: userId || undefined, style: { width: '100%' }, onChange: (value) => handleAssignmentChange(record.leadType, value), placeholder: "Select a team member", showSearch: true, filterOption: (input, option) => {
                    const user = organizationUsers.find(u => u.userId === option?.value);
                    if (!user)
                        return false;
                    const searchStr = `${user.firstName} ${user.lastName}`.toLowerCase();
                    return searchStr.includes(input.toLowerCase());
                }, children: organizationUsers.map((user) => (_jsx(Option, { value: user.userId, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: `${user.firstName} ${user.lastName}`.trim() }), user.role && (_jsx("span", { style: { fontSize: '11px', color: '#888' }, children: user.role }))] }) }, user.userId))) })),
        },
    ];
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            const orgId = currentUser?.organisation?.organisationId;
            if (!orgId) {
                message.warning('Unable to filter users - organization information missing');
                return;
            }
            const usersData = response.data?.data?.users || [];
            const filteredUsers = usersData
                .filter((user) => {
                const userOrgId = user.organisationId || user.organisation?.organisationId || user.organization?.id;
                return userOrgId === orgId;
            })
                .map((user) => ({
                userId: user.userId,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                role: user.role || '',
                organisationId: user.organisationId || user.organisation?.organisationId || user.organization?.id
            }));
            setOrganizationUsers(filteredUsers);
            const nameMap = filteredUsers.reduce((acc, user) => {
                acc[user.userId] = `${user.firstName} ${user.lastName}`.trim() || user.email || 'Unknown User';
                return acc;
            }, {});
            setUserNameMap(nameMap);
            if (filteredUsers.length === 0) {
                message.warning('No active users found in your organization');
            }
        }
        catch (error) {
            message.error('Failed to fetch team members');
            setOrganizationUsers([]);
            setUserNameMap({});
        }
        finally {
            setLoading(false);
        }
    };
    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leadAssignment');
            if (response.data?.data) {
                const assignments = response.data.data.map((assignment) => ({
                    ...assignment,
                    key: assignment.leadAssignmentId,
                    userName: userNameMap[assignment.userId] || 'Unassigned'
                }));
                setAssignments(assignments);
            }
        }
        catch (error) {
            message.error('Failed to fetch lead assignments');
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateConfirm = async (updateType) => {
        if (!pendingUpdate)
            return;
        try {
            const encodedLeadType = encodeURIComponent(pendingUpdate.leadType);
            const payload = {
                userId: pendingUpdate.userId,
                organizationId: currentUser?.organisation?.organisationId
            };
            switch (updateType) {
                case 'existing':
                    // Only update existing leads
                    const existingResponse = await api.put(`/lead/assign-by-type/${encodedLeadType}`, payload);
                    if (existingResponse.data?.success) {
                        message.success('Updated successfully');
                    }
                    else {
                        message.error('Failed to update existing leads');
                    }
                    break;
                case 'both':
                    // Update both existing and upcoming leads
                    const [assignmentResponse, bulkResponse] = await Promise.all([
                        api.put(`/leadAssignment/${encodedLeadType}`, payload),
                        api.put(`/lead/assign-by-type/${encodedLeadType}`, payload)
                    ]);
                    if (assignmentResponse.data?.success && bulkResponse.data?.success) {
                        message.success('Updated successfully');
                        fetchAssignments(); // Refresh the assignments list
                    }
                    else {
                        message.error('Failed to update one or more components');
                    }
                    break;
                case 'incoming':
                    // Only update upcoming leads
                    const incomingResponse = await api.put(`/leadAssignment/${encodedLeadType}`, payload);
                    if (incomingResponse.data?.success) {
                        message.success('Updated successfully');
                        fetchAssignments(); // Refresh the assignments list
                    }
                    else {
                        message.error('Failed to update incoming leads assignment');
                    }
                    break;
            }
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update';
            message.error(errorMessage);
        }
        finally {
            setIsUpdateModalVisible(false);
            setPendingUpdate(null);
        }
    };
    const handleAssignmentChange = async (leadType, userId) => {
        setPendingUpdate({ leadType, userId });
        setIsUpdateModalVisible(true);
    };
    const handleAddLeadType = async () => {
        if (!newLeadType.trim()) {
            message.warning('Please enter a lead type');
            return;
        }
        try {
            const response = await api.post('/leadAssignment/create-lead-assignment', {
                leadType: newLeadType.trim(),
                organisationId: currentUser?.organizationId
            });
            if (response.data?.success) {
                message.success('Lead type added successfully');
                setIsModalVisible(false);
                setNewLeadType('');
                fetchAssignments();
            }
        }
        catch (error) {
            message.error('Failed to add lead type');
        }
    };
    const handleDelete = async () => {
        setIsDeleteModalVisible(true);
    };
    const handleDeleteConfirm = async () => {
        try {
            const deletePromises = selectedLeadTypes.map(async (leadType) => {
                const encodedLeadType = encodeURIComponent(leadType);
                return api.delete(`/leadAssignment/${encodedLeadType}`);
            });
            await Promise.all(deletePromises);
            message.success('Lead assignments deleted successfully');
            setSelectedLeadTypes([]);
            setIsDeleteModalVisible(false);
            fetchAssignments();
        }
        catch (error) {
            message.error('Failed to delete lead assignments');
        }
    };
    return (_jsx("div", { className: "subscription-container", children: _jsxs("div", { className: "subscription-content", children: [_jsxs("div", { className: "subscription-header", style: { display: 'flex', gap: '10px' }, children: [_jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: () => setIsModalVisible(true), className: "add-new-button", children: "Add New" }), selectedLeadTypes.length > 0 && (_jsxs(Button, { type: "primary", danger: true, icon: _jsx(DeleteOutlined, {}), onClick: handleDelete, children: ["Delete (", selectedLeadTypes.length, ")"] }))] }), _jsx("div", { className: "table-container", children: _jsx(Table, { columns: columns, dataSource: assignments, loading: loading, rowKey: "leadAssignmentId", rowSelection: {
                            type: 'checkbox',
                            onChange: (_, selectedRows) => {
                                setSelectedLeadTypes(selectedRows.map(row => row.leadType));
                            },
                            selectedRowKeys: assignments
                                .filter(assignment => selectedLeadTypes.includes(assignment.leadType))
                                .map(assignment => assignment.leadAssignmentId)
                        }, pagination: {
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} assignments`,
                        }, scroll: { x: true, y: 'calc(100vh - 300px)' }, className: "custom-table" }) }), _jsx(Modal, { title: "Add New Lead Type", open: isModalVisible, onOk: handleAddLeadType, onCancel: () => {
                        setIsModalVisible(false);
                        setNewLeadType('');
                    }, className: "custom-modal", children: _jsx("div", { style: { marginTop: 16 }, children: _jsx("input", { type: "text", value: newLeadType, onChange: (e) => setNewLeadType(e.target.value), placeholder: "Enter lead type", className: "custom-input" }) }) }), _jsx(UpdateModal, { visible: isUpdateModalVisible, onCancel: () => {
                        setIsUpdateModalVisible(false);
                        setPendingUpdate(null);
                    }, onConfirm: handleUpdateConfirm, leadType: pendingUpdate?.leadType || '', newOwnerName: pendingUpdate ? (userNameMap[pendingUpdate.userId] || 'Unknown User') : '' }), _jsx(DeleteModal, { visible: isDeleteModalVisible, onCancel: () => setIsDeleteModalVisible(false), onConfirm: handleDeleteConfirm, count: selectedLeadTypes.length })] }) }));
};
export default LeadAssignmentComponent;
