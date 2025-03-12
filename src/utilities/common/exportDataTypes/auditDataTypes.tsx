export type Audit = {
  auditId: string;
  createdAt: string | null;
  updatedAt: string | null;
  owner: OwnerOrModifier | null;
  subject: string | null;
  auditType: string | null;
  description: string | null;
};

export type Pagination = {
  page: number;
  total: number;
};

export type OwnerOrModifier = {
  firstName: string | null;
  lastName: string | null;
};

export type AuditChange = {
  change: string | null;
  label: string | null;
};

export type AuditData = {
  audit: Audit | null;
  changes: AuditChange[];
  modifierDetails: OwnerOrModifier;
};
