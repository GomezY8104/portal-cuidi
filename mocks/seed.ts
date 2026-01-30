
import { UserRole, RequestStatus } from '../types';

// --- USUARIOS DEL SISTEMA (Perfiles de Login) ---
export const MOCK_USERS = [
  // Admins & Pros
  { id: '1', name: 'Admin Global', email: 'admin@cuidi.gov.br', role: UserRole.SYSTEM_ADMIN, orgId: 'global', nodeName: 'Ministério da Saúde' },
  { id: '2', name: 'Dr. Ricardo', email: 'ricardo@hospital.br', role: UserRole.NODE_ADMIN, orgId: 'node-01', nodeName: 'Hospital Central', registryNumber: 'CRM-SP 123456' },
  { id: '4', name: 'Regulador Central', email: 'reg@pref.br', role: UserRole.REGULATOR, orgId: 'node-01', nodeName: 'Complexo Regulador', registryNumber: 'CRM-SP 998877' },
  { id: '5', name: 'Enf. Joana', email: 'joana@ubs.br', role: UserRole.APS, orgId: 'node-02', nodeName: 'UBS Norte', registryNumber: 'COREN-SP 112233' },
  { id: '6', name: 'Enf. Carla Lima', email: 'carla@upa.br', role: UserRole.UPA, orgId: 'node-03', nodeName: 'UPA Unidade Norte', registryNumber: 'COREN-SP 445566' },
  { id: '7', name: 'Dr. Alberto', email: 'alberto@especialidades.br', role: UserRole.PROVIDER, orgId: 'node-04', nodeName: 'Hospital de Especialidades', registryNumber: 'CRM-SP 554433', specialty: 'CARDIOLOGIA' },

  // --- PACIENTES (Perfiles para Demo) ---
  { id: 'p1', name: 'Maria Aparecida da Silva', email: 'maria@gmail.com', role: UserRole.PATIENT, orgId: 'pat-01', nodeName: 'Minha Saúde' },
  { id: 'p2', name: 'João Carlos Pereira', email: 'joao@gmail.com', role: UserRole.PATIENT, orgId: 'pat-02', nodeName: 'Minha Saúde' },
  { id: 'p3', name: 'Ana Julia Fontes', email: 'ana.julia@outlook.com', role: UserRole.PATIENT, orgId: 'pat-03', nodeName: 'Minha Saúde' },
  { id: 'p4', name: 'Carlos Eduardo Souza', email: 'cadu@uol.com.br', role: UserRole.PATIENT, orgId: 'pat-04', nodeName: 'Minha Saúde' },
  { id: 'p5', name: 'Fernanda Lima', email: 'nanda@gmail.com', role: UserRole.PATIENT, orgId: 'pat-05', nodeName: 'Minha Saúde' },
  { id: 'p6', name: 'Roberto Alves', email: 'beto@bol.com.br', role: UserRole.PATIENT, orgId: 'pat-06', nodeName: 'Minha Saúde' },
];

export const MOCK_DOC_REQUESTS = [
  { 
    id: 'req-101', 
    requester: 'Complexo Regulador Estadual', 
    documentType: 'Documento de Identidade com Foto', 
    status: 'PENDING', 
    priority: 'HIGH', 
    description: 'Necessário para validação de cirurgia eletiva agendada.',
    dueDate: '2024-11-20'
  },
  { 
    id: 'req-102', 
    requester: 'Hospital das Clínicas - SP', 
    documentType: 'Comprovante de Residência Atualizado', 
    status: 'PENDING', 
    priority: 'MEDIUM',
    description: 'Atualização de cadastro para prontuário eletrônico federado.',
    dueDate: '2024-11-25'
  }
];

export const MOCK_PATIENTS = [
  { 
    id: 'p1', 
    name: 'Maria Aparecida da Silva', 
    socialName: '',
    cpf: '123.456.789-00', 
    birthDate: '1975-05-12', 
    cns: '700001234567890', 
    phone: '(11) 98888-7777', 
    emergencyContact: '(11) 99999-1111 (Filho)',
    gender: 'FEMININO',
    bloodType: 'O+',
    address: 'Rua das Palmeiras, 123, Jd. Primavera, São Paulo - SP'
  },
  { 
    id: 'p2', 
    name: 'João Carlos Pereira', 
    socialName: '',
    cpf: '987.654.321-11', 
    birthDate: '1982-10-20', 
    cns: '700009876543210', 
    phone: '(11) 97777-6666', 
    emergencyContact: '(11) 98888-2222 (Esposa)',
    gender: 'MASCULINO',
    bloodType: 'A+',
    address: 'Av. Central, 500, Apto 42, Centro, Osasco - SP'
  },
  { 
    id: 'p3', 
    name: 'Ana Julia Fontes', 
    socialName: 'Julia Fontes',
    cpf: '456.789.123-22', 
    birthDate: '1995-03-15', 
    cns: '700004561237890', 
    phone: '(21) 99999-1111', 
    emergencyContact: '(21) 97777-3333 (Mãe)',
    gender: 'FEMININO',
    bloodType: 'B-',
    address: 'Rua das Flores, 88, Copacabana, Rio de Janeiro - RJ'
  },
  { 
    id: 'p4', 
    name: 'Carlos Eduardo Souza', 
    socialName: '',
    cpf: '321.654.987-33', 
    birthDate: '1960-12-05', 
    cns: '700001112223334', 
    phone: '(31) 98888-2222', 
    emergencyContact: 'Não informado',
    gender: 'MASCULINO',
    bloodType: 'AB+',
    address: 'Alameda dos Anjos, 10, Serra, Belo Horizonte - MG'
  },
  { 
    id: 'p5', 
    name: 'Fernanda Lima', 
    socialName: '',
    cpf: '789.123.456-44', 
    birthDate: '1988-07-22', 
    cns: '700005554443332', 
    phone: '(41) 97777-3333', 
    emergencyContact: '(41) 96666-5555 (Irmão)',
    gender: 'FEMININO',
    bloodType: 'O-',
    address: 'Rua XV de Novembro, 200, Centro, Curitiba - PR'
  },
  { 
    id: 'p6', 
    name: 'Roberto Alves', 
    socialName: '',
    cpf: '159.357.258-55', 
    birthDate: '2010-01-30', 
    cns: '700009998887776', 
    phone: '(11) 96666-4444', 
    emergencyContact: '(11) 95555-3333 (Pai)',
    gender: 'MASCULINO',
    bloodType: 'A-',
    address: 'Rua da Esperança, 45, Vila Nova, Santos - SP'
  },
];

// Dados centralizados de Casos (Processos)
export const MOCK_PROVIDER_CASES = [
  { 
    id: 'ENC-2024-891', 
    patientId: 'p1',
    patientName: 'MARIA APARECIDA DA SILVA', 
    age: 49,
    gender: 'FEMININO', 
    origin: 'APS SUL', 
    originType: 'APS', 
    specialty: 'CARDIOLOGIA CIRÚRGICA', 
    condition: 'ANGINA ESTÁVEL',
    title: 'Cateterismo Cardíaco',
    description: 'Paciente com histórico de dor precordial aos esforços moderados. Teste ergométrico positivo para isquemia. Solicita-se cateterismo para avaliação anatômica.',
    priority: 'ALTA', 
    modality: 'PRESENCIAL', 
    sla: 'EM ANÁLISE', 
    status: 'EM_ANALISE', 
    internalStatus: 'UNDER_TECHNICAL_REVIEW',
    date: '15/10/2024',
    daysQueue: 5,
    entity: 'Complexo Regulador Estadual - SP',
    hasMessages: true,
    messages: [
        { sender: 'REGULADOR', text: 'Sra. Maria, precisamos que anexe o último teste ergométrico.', time: 'Ontem, 14:00' }
    ]
  },
  { 
    id: 'ENC-2024-702', 
    patientId: 'p1',
    patientName: 'MARIA APARECIDA DA SILVA', 
    age: 49, 
    gender: 'FEMININO',
    origin: 'APS SUL', 
    originType: 'APS', 
    specialty: 'OFTALMOLOGIA', 
    condition: 'RETINOPATIA DIABÉTICA',
    title: 'Consulta Especializada - Retina',
    description: 'Paciente diabética tipo 2 há 10 anos, refere baixa acuidade visual progressiva. Fundo de olho sugere retinopatia proliferativa.',
    priority: 'MÉDIA', 
    modality: 'AMBULATORIAL', 
    sla: 'AGENDADO', 
    status: 'AGENDADO', 
    internalStatus: 'SCHEDULED',
    date: '01/10/2024',
    daysQueue: 12,
    entity: 'Regulação Municipal',
    hasMessages: false,
    appointment: {
        date: '28/10/2024',
        time: '09:30',
        doctor: 'Dr. Pedro Visão',
        unit: 'Instituto de Olhos SP',
        address: 'Av. Brasil, 1500 - Jardins, São Paulo',
        instructions: 'Chegar com 15 minutos de antecedência. Levar óculos atuais.'
    }
  },
  { 
    id: 'UPA-901', 
    patientId: 'p6',
    patientName: 'ROBERTO ALVES', 
    age: 14, 
    gender: 'MASCULINO',
    origin: 'UPA CENTRO', 
    originType: 'UPA', 
    specialty: 'ORTOPEDIA', 
    condition: 'FRATURA TIBIA/FIBULA',
    title: 'Fratura de Tíbia',
    description: 'Trauma direto em membro inferior direito após queda de bicicleta. Deformidade visível, pulso pedioso presente. Imobilizado.',
    priority: 'EMERGÊNCIA', 
    modality: 'HOSPITALAR', 
    sla: 'CRÍTICO', 
    status: 'RECEBIDO', 
    internalStatus: 'EMERGENCY_IN_ATTENDANCE',
    date: 'Hoje, 08:00',
    daysQueue: 0,
    entity: 'Hospital de Trauma Norte',
    hasMessages: true,
    messages: [
        { sender: 'SISTEMA', text: 'Transporte de ambulância solicitado.', time: 'Hoje, 08:15' }
    ]
  },
  { 
    id: 'ENC-204', 
    patientId: 'p3',
    patientName: 'ANA JULIA FONTES', 
    age: 29, 
    gender: 'FEMININO',
    origin: 'APS LESTE', 
    originType: 'APS', 
    specialty: 'NEUROLOGIA', 
    condition: 'CEFALEIA REFRATÁRIA',
    title: 'Investigação Cefaleia Crônica',
    description: 'Cefaleia diária há 3 meses, sem resposta a analgésicos comuns. Sem sinais de alarme neurológico. Solicito avaliação.',
    priority: 'MÉDIA', 
    modality: 'AMBULATORIAL', 
    sla: 'FILA', 
    status: 'PENDENTE', 
    internalStatus: 'REFERRED',
    date: '12/10/2024',
    daysQueue: 18,
    entity: 'Central de Regulação Leste',
    hasMessages: false
  },
  { 
    id: 'ENC-205', 
    patientId: 'p4',
    patientName: 'CARLOS EDUARDO SOUZA', 
    age: 63, 
    gender: 'MASCULINO',
    origin: 'HOSPITAL DO CÂNCER', 
    originType: 'HOSPITAL', 
    specialty: 'ONCOLOGIA', 
    condition: 'CA PRÓSTATA',
    title: 'Quimioterapia Ciclo 2',
    description: 'Continuidade de tratamento oncológico. Ciclo 2/6. Paciente apresenta boa tolerância.',
    priority: 'ALTA', 
    modality: 'AMBULATORIAL', 
    sla: 'AGENDADO', 
    status: 'AGENDADO', 
    internalStatus: 'SCHEDULED',
    date: '20/10/2024',
    daysQueue: 2,
    entity: 'Centro de Oncologia Estadual',
    hasMessages: true,
    messages: [
        { sender: 'ENFERMAGEM', text: 'Seu agendamento foi confirmado. Lembre-se do jejum de 4 horas.', time: 'Hoje, 09:00' }
    ],
    appointment: {
        date: '30/10/2024',
        time: '08:00',
        doctor: 'Dra. Silvia Oncologista',
        unit: 'Centro de Oncologia Estadual',
        address: 'Rua da Saúde, 500 - Bloco C',
        instructions: 'Trazer exames de sangue recentes.'
    }
  },
  { 
    id: 'ENC-206', 
    patientId: 'p5',
    patientName: 'FERNANDA LIMA', 
    age: 36, 
    gender: 'FEMININO',
    origin: 'UBS CENTRO', 
    originType: 'APS', 
    specialty: 'GINECOLOGIA', 
    condition: 'GESTAÇÃO ALTO RISCO',
    title: 'Pré-Natal Alto Risco',
    description: 'Gestante G3P2A0, 12 semanas. Histórico de pré-eclâmpsia grave. PA atual 150/95 mmHg. Encaminhamento prioritário.',
    priority: 'ALTA', 
    modality: 'AMBULATORIAL', 
    sla: 'EM ANÁLISE', 
    status: 'EM_ANALISE', 
    internalStatus: 'UNDER_TECHNICAL_REVIEW',
    date: '22/10/2024',
    daysQueue: 1,
    entity: 'Maternidade Escola',
    hasMessages: false
  }
];
