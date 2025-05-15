import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Modal, message, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import { LeadAssignment, LeadAssignmentUpdate } from './types';
import "../../../styles/leads/leadAssignment.css";
import api from '../../../services/axiosGlobal';
import { getUserById } from '../../../redux/features/authenticationSlice';
import { AppDispatch } from '../../../redux/app/store';

const { Option } = Select;

type UpdateType = 'existing' | 'both' | 'incoming' | 'none';

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (updateType: UpdateType) => void;
  leadType: string;
  newOwnerName: string;
}

interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  count: number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ visible, onCancel, onConfirm, count }) => {
  return (
    <Modal
      title="Confirm Delete"
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete {count} lead assignment{count > 1 ? 's' : ''}?</p>
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

const UpdateModal: React.FC<UpdateModalProps> = ({ visible, onCancel, onConfirm, leadType, newOwnerName }) => {
  const [updateType, setUpdateType] = useState<UpdateType>('none');

  return (
    <Modal
      title="Update Lead Assignments"
      open={visible}
      onCancel={onCancel}
      onOk={() => onConfirm(updateType)}
      okButtonProps={{ disabled: updateType === 'none' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <p>How would you like to update leads of type "{leadType}" assigned to {newOwnerName}?</p>
        <Radio.Group onChange={(e) => setUpdateType(e.target.value)} value={updateType}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Radio value="incoming">Update Only Upcoming Leads</Radio>
            <Radio value="existing">Update Only Existing Leads</Radio>
            <Radio value="both">Update Both Existing and Upcoming Leads</Radio>
          </div>
        </Radio.Group>
      </div>
    </Modal>
  );
};

const LeadAssignmentComponent: React.FC = () => {
  const [assignments, setAssignments] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [newLeadType, setNewLeadType] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState<{ leadType: string; userId: string } | null>(null);
  const [organizationUsers, setOrganizationUsers] = useState<Array<{ userId: string; firstName: string; lastName: string; email: string; role: string; organisationId: string }>>([]);
  const [userNameMap, setUserNameMap] = useState<{[key: string]: string}>({});
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: any) => state.authentication.user);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedLeadTypes, setSelectedLeadTypes] = useState<string[]>([]);
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
    } else if (retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        dispatch(getUserById());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser?.organisation, retryCount]);

  const columns: ColumnsType<LeadAssignment> = [
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
      render: (userId: string, record: LeadAssignment) => (
        <Select
          value={userId || undefined}
          style={{ width: '100%' }}
          onChange={(value) => handleAssignmentChange(record.leadType, value)}
          placeholder="Select a team member"
          showSearch
          filterOption={(input, option) => {
            const user = organizationUsers.find(u => u.userId === option?.value);
            if (!user) return false;
            
            const searchStr = `${user.firstName} ${user.lastName}`.toLowerCase();
            return searchStr.includes(input.toLowerCase());
          }}
        >
          {organizationUsers.map((user) => (
            <Option key={user.userId} value={user.userId}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>{`${user.firstName} ${user.lastName}`.trim()}</span>
                {user.role && (
                  <span style={{ fontSize: '11px', color: '#888' }}>{user.role}</span>
                )}
              </div>
            </Option>
          ))}
        </Select>
      ),
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
        .filter((user: any) => {
          const userOrgId = user.organisationId || user.organisation?.organisationId || user.organization?.id;
          return userOrgId === orgId;
        })
        .map((user: any) => ({
          userId: user.userId,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          role: user.role || '',
          organisationId: user.organisationId || user.organisation?.organisationId || user.organization?.id
        }));

      setOrganizationUsers(filteredUsers);

      const nameMap = filteredUsers.reduce((acc: {[key: string]: string}, user: any) => {
        acc[user.userId] = `${user.firstName} ${user.lastName}`.trim() || user.email || 'Unknown User';
        return acc;
      }, {});
      setUserNameMap(nameMap);

      if (filteredUsers.length === 0) {
        message.warning('No active users found in your organization');
      }
    } catch (error) {
      message.error('Failed to fetch team members');
      setOrganizationUsers([]);
      setUserNameMap({});
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leadAssignment');
      if (response.data?.data) {
        const assignments = response.data.data.map((assignment: LeadAssignment) => ({
          ...assignment,
          key: assignment.leadAssignmentId,
          userName: userNameMap[assignment.userId] || 'Unassigned'
        }));
        setAssignments(assignments);
      }
    } catch (error) {
      message.error('Failed to fetch lead assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfirm = async (updateType: UpdateType) => {
    if (!pendingUpdate) return;

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
          } else {
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
          } else {
            message.error('Failed to update one or more components');
          }
          break;

        case 'incoming':
          // Only update upcoming leads
          const incomingResponse = await api.put(`/leadAssignment/${encodedLeadType}`, payload);
          if (incomingResponse.data?.success) {
            message.success('Updated successfully');
            fetchAssignments(); // Refresh the assignments list
          } else {
            message.error('Failed to update incoming leads assignment');
          }
          break;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update';
      message.error(errorMessage);
    } finally {
      setIsUpdateModalVisible(false);
      setPendingUpdate(null);
    }
  };

  const handleAssignmentChange = async (leadType: string, userId: string) => {
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
    } catch (error) {
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
    } catch (error) {
      message.error('Failed to delete lead assignments');
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-content">
        <div className="subscription-header" style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="add-new-button"
          >
            Add New
          </Button>
          {selectedLeadTypes.length > 0 && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Delete ({selectedLeadTypes.length})
            </Button>
          )}
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={assignments}
            loading={loading}
            rowKey="leadAssignmentId"
            rowSelection={{
              type: 'checkbox',
              onChange: (_, selectedRows) => {
                setSelectedLeadTypes(selectedRows.map(row => row.leadType));
              },
              selectedRowKeys: assignments
                .filter(assignment => selectedLeadTypes.includes(assignment.leadType))
                .map(assignment => assignment.leadAssignmentId)
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} assignments`,
            }}
            scroll={{ x: true, y: 'calc(100vh - 300px)' }}
            className="custom-table"
          />
        </div>

        <Modal
          title="Add New Lead Type"
          open={isModalVisible}
          onOk={handleAddLeadType}
          onCancel={() => {
            setIsModalVisible(false);
            setNewLeadType('');
          }}
          className="custom-modal"
        >
          <div style={{ marginTop: 16 }}>
            <input
              type="text"
              value={newLeadType}
              onChange={(e) => setNewLeadType(e.target.value)}
              placeholder="Enter lead type"
              className="custom-input"
            />
          </div>
        </Modal>

        <UpdateModal
          visible={isUpdateModalVisible}
          onCancel={() => {
            setIsUpdateModalVisible(false);
            setPendingUpdate(null);
          }}
          onConfirm={handleUpdateConfirm}
          leadType={pendingUpdate?.leadType || ''}
          newOwnerName={pendingUpdate ? (userNameMap[pendingUpdate.userId] || 'Unknown User') : ''}
        />

        <DeleteModal
          visible={isDeleteModalVisible}
          onCancel={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDeleteConfirm}
          count={selectedLeadTypes.length}
        />
      </div>
    </div>
  );
};

export default LeadAssignmentComponent; 