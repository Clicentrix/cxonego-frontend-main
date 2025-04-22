export interface LeadAssignmentRule {
  id: string;
  ruleName: string;
  description?: string;
  status: boolean;
  priority: number;
  assignmentType: 'roundRobin' | 'loadBalancing' | 'manual' | 'territory';
  workingHours?: [string, string]; // Start and end time
  leadCap?: number;
  teamMembers: string[];
  excludedMembers?: string[];
  leadSources?: string[];
  territories?: string[];
  leadTypes?: string[];
  createdAt: string;
  lastModified: string;
}

export interface LeadAssignment {
  leadAssignmentId: string;
  leadType: string;
  userId: string;
  organisationId: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadAssignmentCreate {
  leadType: string;
  description?: string;
}

export interface LeadAssignmentUpdate {
  userId: string;
  organisationId: string;
} 