
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { AppLayout } from './components/Layout';
import { ToastContainer } from './components/ui/ToastContainer';
import { LandingPage } from './features/Landing/Landing';
import { LoginPage } from './features/Auth/Login';
import { ForgotPage } from './features/Auth/Forgot';
import { OrgSignupPage } from './features/OrgSignup/OrgSignup';
import { InviteAcceptPage } from './features/Auth/InviteAccept';
import { UserManagementPage } from './features/NodeAdmin/UserManagement';
import { NodesManagementPage } from './features/SystemAdmin/NodesManagement';
import { CatalogsPage } from './features/SystemAdmin/Catalogs';
import { GlobalAuditPage } from './features/SystemAdmin/GlobalAudit';
import { LocalPoliciesPage } from './features/Federation/LocalPolicies';
import { InvitesManagementPage } from './features/NodeAdmin/InvitesManagement';
import { GlobalDashboardPage } from './features/SystemAdmin/Dashboard';
import { GlobalAnalyticsPage } from './features/SystemAdmin/Analytics';
import { CodeAuditPage } from './features/SystemAdmin/CodeAudit';
import { NodeDashboardPage } from './features/NodeAdmin/Dashboard';
import { PatientDashboardPage } from './features/Patient/Dashboard';
import { PatientConsentsPage } from './features/Patient/Consents';
import { PatientAccessLogPage } from './features/Patient/AccessLog';
import { WorkTrayPage } from './features/Professional/WorkTray';
import { NewCasePage } from './features/Professional/NewCase';
import { CaseDetailPage } from './features/Professional/CaseDetail';
import { ApsManagerDashboard } from './features/Professional/ApsManagerDashboard';

import { ClinicalHistoryPage } from './features/Patient/ClinicalHistory';
import { ExamResultsPage } from './features/Patient/ExamResults';
import { PrescriptionsPage } from './features/Patient/Prescriptions';
import { RestrictedAccessRequestPage } from './features/Professional/RestrictedAccessRequest';
import { RegulationQueuePage } from './features/Professional/RegulationQueue';
import { RegulationCaseDetailPage } from './features/Professional/RegulationCaseDetail';
import { FederatedSearchPage } from './features/Professional/FederatedSearchPage';
import { OrchestrationPage } from './features/Professional/OrchestrationPage';
import { TechnicalConfigPage } from './features/NodeAdmin/TechnicalConfig';
import { HelpCenterPage } from './features/Shared/HelpCenter';
import { UserProfilePage } from './features/Shared/UserProfile';
import { NotificationsCenterPage } from './features/Shared/NotificationsCenter';
import { FederationReportsPage } from './features/Shared/FederationReports';

import { LedgerDetailPage } from './features/Shared/LedgerDetail';
import { TerritoryManagementPage } from './features/SystemAdmin/TerritoryManagement';
import { DeviceManagementPage } from './features/NodeAdmin/DeviceManagement';
import { EmergencyProfilePage } from './features/Patient/EmergencyProfile';
import { TelemedicinePage } from './features/Professional/Telemedicine';
import { SecurityCenterPage } from './features/Shared/SecurityCenter';
import { ComplianceDashboardPage } from './features/SystemAdmin/ComplianceDashboard';
import { AuditReportsPage } from './features/NodeAdmin/AuditReports';
import { ChangelogPage } from './features/Shared/Changelog';

import { PatientDocumentsPage } from './features/Patient/Documents';
import { RegulationCasesPage } from './features/Patient/RegulationCases';
import { PatientFederatedSearchPage } from './features/Patient/PatientFederatedSearchPage';
import { PatientSupportPage } from './features/Patient/Support'; // Nova Página

// UPA Imports
import { UpaWorkTrayPage } from './features/Professional/UpaWorkTray';
import { NewUpaCasePage } from './features/Professional/NewUpaCase';
import { UpaCaseDetailPage } from './features/Professional/UpaCaseDetail';

// Provider Imports
import { ProviderWorkTrayPage } from './features/Professional/ProviderWorkTray';
import { ProviderCaseDetailPage } from './features/Professional/ProviderCaseDetail';
import { ProviderAttendancePage } from './features/Professional/ProviderAttendance';
import { ProviderFeedbackPage } from './features/Professional/ProviderFeedback';
import { ProviderFederatedSearchPage } from './features/Professional/ProviderFederatedSearchPage';
import { ProviderRegulationFlowPage } from './features/Professional/ProviderRegulationFlowPage';

import { 
  AboutPage, ApiDocsPage, NetworkStatusPage, 
  LegalPage, ContactPage 
} from './features/Shared/StaticContent';

import { GovernanceDecisionDrawer } from './components/Drawers/GovernanceDecisionDrawer';
import { UploadDocumentDrawer } from './components/Drawers/UploadDocumentDrawer';
import { ClinicalDetailDrawer } from './components/Drawers/ClinicalDetailDrawer';
import { CaseSummaryDrawer } from './components/Drawers/CaseSummaryDrawer';
import { DocumentMetadataDrawer } from './components/Drawers/DocumentMetadataDrawer';
import { LedgerAuditDrawer } from './components/Drawers/LedgerAuditDrawer';
import { PolicyWizardDrawer } from './components/Drawers/PolicyWizardDrawer';
import { UserDetailDrawer } from './components/Drawers/UserDetailDrawer';
import { FederatedSearchDrawer } from './components/Drawers/FederatedSearchDrawer'; 
import { SystemAdminDrawers } from './components/Drawers/SystemAdminDrawers';

import { SocialAuthModal } from './components/Modals/SocialAuthModal';
import { EditProfileModal } from './components/Modals/EditProfileModal';
import { ExamViewModal } from './components/Modals/ExamViewModal';
import { SecurityModals } from './components/Modals/SecurityModals';
import { ConsentModals } from './components/Modals/ConsentModals';
import { RegisterPatientModal } from './components/Modals/RegisterPatientModal';
import { NotifyCitizenModal } from './components/Modals/NotifyCitizenModal';
import { RegulationActionModals } from './components/Modals/RegulationActionModals';
import { JustificationModal } from './components/Modals/JustificationModal';
import { ProviderActionModals } from './components/Modals/ProviderActionModals';
import { NodeAdminModals } from './components/Modals/NodeAdminModals';
import { SystemAdminModals } from './components/Modals/SystemAdminModals';
import { PatientScheduleModal } from './components/Modals/PatientScheduleModal';
import { NewProcedureModal } from './components/Modals/NewProcedureModal'; 
import { EmergencyRequestModal } from './components/Modals/EmergencyRequestModal'; 
import { ConfirmationModal, InputModal } from './components/Modals/GenericModals'; // Novos Modais
import { Shield, X } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, activeDrawer, closeDrawer, activeModal, closeModal } = useAppStore();

  const renderModalContent = () => {
    switch (activeModal) {
      case 'SocialAuthModal':
        return <SocialAuthModal />;
      case 'EditProfileModal':
        return <EditProfileModal />;
      case 'ExamViewModal':
        return <ExamViewModal />;
      case 'MFASetupModal':
      case 'PasskeyModal':
      case 'DeleteAccountModal':
        return <SecurityModals />;
      case 'NewConsentModal':
      case 'EditConsentModal':
      case 'GlobalConsentRulesModal':
      case 'RevokeConsentModal':
        return <ConsentModals />;
      case 'RegisterPatientModal':
        return <RegisterPatientModal />;
      case 'NotifyCitizenModal':
        return <NotifyCitizenModal />;
      case 'ReturnCaseModal':
      case 'EligibilityModal':
      case 'NotificationRecusalModal':
      case 'DocRequestModal':
        return <RegulationActionModals />;
      case 'JustificationModal':
        return <JustificationModal />;
      case 'ProviderAcceptModal':
      case 'ProviderRejectModal':
      case 'ProviderFeedbackModal':
      case 'ProviderScheduleModal':
      case 'ProviderDocRequestModal':
        return <ProviderActionModals />;
      case 'InviteUserModal':
      case 'EditEndpointModal':
        return <NodeAdminModals />;
      case 'RegisterNodeModal':
      case 'CreateTerritoryModal':
      case 'GlobalDirectiveModal':
      case 'GenerateReportModal':
      case 'NodeDetailModal':
      case 'TerritoryDetailModal':
      case 'AuditTraceModal':
      case 'PolicyEditorModal':
        return <SystemAdminModals />;
      case 'PatientScheduleModal':
        return <PatientScheduleModal />;
      case 'NewProcedureModal': 
        return <NewProcedureModal />;
      case 'EmergencyRequestModal': 
        return <EmergencyRequestModal />;
      case 'ConfirmationModal': // Novo
        return <ConfirmationModal />;
      case 'InputModal': // Novo
        return <InputModal />;
      default:
        return <div className="p-8 text-sm font-bold">Funcionalidade {activeModal} em desenvolvimento.</div>;
    }
  };

  return (
    <HashRouter>
      <ToastContainer /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard-redirect" replace /> : <LoginPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/org-signup" element={<OrgSignupPage />} />
        <Route path="/invite/:token" element={<InviteAcceptPage />} />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
        <Route path="/network-status" element={<NetworkStatusPage />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />

        <Route path="/dashboard-redirect" element={
          isAuthenticated ? (
            useAppStore.getState().user?.role === 'SYSTEM_ADMIN' ? <Navigate to="/system" replace /> :
            useAppStore.getState().user?.role === 'NODE_ADMIN' ? <Navigate to="/node-admin" replace /> :
            useAppStore.getState().user?.role === 'UPA' ? <Navigate to="/upa" replace /> :
            useAppStore.getState().user?.role === 'APS' ? <Navigate to="/aps" replace /> :
            useAppStore.getState().user?.role === 'REGULATOR' ? <Navigate to="/regulator" replace /> :
            useAppStore.getState().user?.role === 'PROVIDER' ? <Navigate to="/provider" replace /> :
            <Navigate to="/patient" replace />
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/system" element={<AppLayout><GlobalDashboardPage /></AppLayout>} />
        <Route path="/system/nodes" element={<AppLayout><NodesManagementPage /></AppLayout>} />
        <Route path="/system/catalogs" element={<AppLayout><CatalogsPage /></AppLayout>} />
        <Route path="/system/audit" element={<AppLayout><GlobalAuditPage /></AppLayout>} />
        <Route path="/system/code-audit" element={<AppLayout><CodeAuditPage /></AppLayout>} />
        <Route path="/system/territories" element={<AppLayout><TerritoryManagementPage /></AppLayout>} />
        <Route path="/system/compliance" element={<AppLayout><ComplianceDashboardPage /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><GlobalAnalyticsPage /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><FederationReportsPage /></AppLayout>} />

        <Route path="/node-admin" element={<AppLayout><NodeDashboardPage /></AppLayout>} />
        <Route path="/node-admin/users" element={<AppLayout><UserManagementPage /></AppLayout>} />
        <Route path="/node-admin/invites" element={<AppLayout><InvitesManagementPage /></AppLayout>} />
        <Route path="/node-admin/config" element={<AppLayout><TechnicalConfigPage /></AppLayout>} />
        <Route path="/node-admin/devices" element={<AppLayout><DeviceManagementPage /></AppLayout>} />
        <Route path="/node-admin/audit-reports" element={<AppLayout><AuditReportsPage /></AppLayout>} />
        
        <Route path="/federation/policies" element={<AppLayout><LocalPoliciesPage /></AppLayout>} />
        <Route path="/ledger/:id" element={<AppLayout><LedgerDetailPage /></AppLayout>} />
        
        <Route path="/patient" element={<AppLayout><PatientDashboardPage /></AppLayout>} />
        <Route path="/patient/history" element={<AppLayout><ClinicalHistoryPage /></AppLayout>} />
        <Route path="/patient/exams" element={<AppLayout><ExamResultsPage /></AppLayout>} />
        <Route path="/patient/prescriptions" element={<AppLayout><PrescriptionsPage /></AppLayout>} />
        <Route path="/patient/consents" element={<AppLayout><PatientConsentsPage /></AppLayout>} />
        <Route path="/patient/access-log" element={<AppLayout><PatientAccessLogPage /></AppLayout>} />
        <Route path="/patient/emergency" element={<AppLayout><EmergencyProfilePage /></AppLayout>} />
        <Route path="/patient/documents" element={<AppLayout><PatientDocumentsPage /></AppLayout>} />
        <Route path="/patient/documents/search" element={<AppLayout><ProviderFederatedSearchPage /></AppLayout>} />
        <Route path="/patient/cases" element={<AppLayout><RegulationCasesPage /></AppLayout>} />
        <Route path="/patient/providers" element={<AppLayout><PatientFederatedSearchPage /></AppLayout>} />
        <Route path="/patient/support" element={<AppLayout><PatientSupportPage /></AppLayout>} />
        
        <Route path="/aps" element={<AppLayout><WorkTrayPage /></AppLayout>} />
        <Route path="/aps/new-case" element={<AppLayout><NewCasePage /></AppLayout>} />
        <Route path="/aps/case/:id" element={<AppLayout><CaseDetailPage /></AppLayout>} />
        <Route path="/aps/case/:id/search" element={<AppLayout><ProviderFederatedSearchPage /></AppLayout>} />
        <Route path="/aps/dashboard" element={<AppLayout><ApsManagerDashboard /></AppLayout>} />
        
        <Route path="/upa" element={<AppLayout><UpaWorkTrayPage /></AppLayout>} />
        <Route path="/upa/new-case" element={<AppLayout><NewUpaCasePage /></AppLayout>} />
        <Route path="/upa/case/:id" element={<AppLayout><UpaCaseDetailPage /></AppLayout>} />
        <Route path="/upa/case/:id/search" element={<AppLayout><ProviderFederatedSearchPage /></AppLayout>} />

        <Route path="/provider" element={<AppLayout><ProviderWorkTrayPage /></AppLayout>} />
        <Route path="/provider/regulation-flow/:id" element={<AppLayout><ProviderRegulationFlowPage /></AppLayout>} />
        <Route path="/provider/case/:id" element={<AppLayout><ProviderCaseDetailPage /></AppLayout>} />
        <Route path="/provider/case/:id/attendance" element={<AppLayout><ProviderAttendancePage /></AppLayout>} />
        <Route path="/provider/case/:id/feedback" element={<AppLayout><ProviderFeedbackPage /></AppLayout>} />
        <Route path="/provider/case/:id/search" element={<AppLayout><ProviderFederatedSearchPage /></AppLayout>} />
        
        <Route path="/regulator" element={<AppLayout><RegulationQueuePage /></AppLayout>} />
        <Route path="/regulator/case/:id" element={<AppLayout><RegulationCaseDetailPage /></AppLayout>} />
        <Route path="/regulator/case/:id/search" element={<AppLayout><FederatedSearchPage /></AppLayout> } />
        <Route path="/regulator/case/:id/orchestrate" element={<AppLayout><OrchestrationPage /></AppLayout> } />
        
        <Route path="/telemedicine" element={<AppLayout><TelemedicinePage /></AppLayout>} />
        <Route path="/restricted-request" element={<AppLayout><RestrictedAccessRequestPage /></AppLayout>} />
        
        <Route path="/profile" element={<AppLayout><UserProfilePage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsCenterPage /></AppLayout>} />
        <Route path="/security" element={<AppLayout><SecurityCenterPage /></AppLayout>} />
        <Route path="/help" element={<AppLayout><HelpCenterPage /></AppLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeDrawer}></div>
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full animate-in slide-in-from-right duration-500 border-l border-slate-200">
            <button onClick={closeDrawer} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full text-slate-400 z-10">
              <X size={28} />
            </button>
            <div className="h-full overflow-y-auto">
              {activeDrawer === 'GovernanceDecisionDrawer' && <GovernanceDecisionDrawer />}
              {activeDrawer === 'UploadDocumentDrawer' && <UploadDocumentDrawer />}
              {activeDrawer === 'ClinicalDetailDrawer' && <ClinicalDetailDrawer />}
              {activeDrawer === 'CaseSummaryDrawer' && <CaseSummaryDrawer />}
              {activeDrawer === 'DocumentMetadataDrawer' && <DocumentMetadataDrawer />}
              {activeDrawer === 'LedgerAuditDrawer' && <LedgerAuditDrawer />}
              {activeDrawer === 'PolicyWizardDrawer' && <PolicyWizardDrawer />}
              {activeDrawer === 'UserDetailDrawer' && <UserDetailDrawer />}
              {activeDrawer === 'FederatedSearchDrawer' && <FederatedSearchDrawer />}
              {['NodeDetailDrawer', 'GlobalEventDetailDrawer', 'TerritoryRulesDrawer'].includes(activeDrawer) && <SystemAdminDrawers />}
            </div>
          </div>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={closeModal}></div>
           <div className={`relative w-full overflow-hidden animate-in zoom-in duration-300 ${
             ['NewProcedureModal', 'AuditTraceModal', 'NodeDetailModal', 'TerritoryDetailModal', 'PolicyEditorModal'].includes(activeModal) ? 'max-w-4xl' : 'max-w-xl'
           }`}>
              {renderModalContent()}
           </div>
        </div>
      )}
    </HashRouter>
  );
};

export default App;
