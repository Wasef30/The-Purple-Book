import { Chapter, Category } from './types';

export const CHAPTERS: Chapter[] = [
  {
    id: 'detection-engineering',
    title: 'Detection Engineering',
    category: Category.BLUE,
    description: 'Building high-fidelity alerts, Sigma rules, and hunting threats.',
    icon: 'ShieldAlert',
    promptTopic: 'Detection Engineering, SIEM architecture, and Threat Hunting methodologies including Sigma rules and TTP analysis'
  },
  {
    id: 'offensive-security',
    title: 'Offensive Security',
    category: Category.RED,
    description: 'Adversary simulation, red teaming operations, and exploit development.',
    icon: 'Sword',
    promptTopic: 'Offensive Security, Red Teaming, Adversary Simulation, and Exploit Development methodologies'
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security',
    category: Category.PURPLE,
    description: 'Securing AWS, Azure, and Kubernetes environments.',
    icon: 'Cloud',
    promptTopic: 'Cloud Security for AWS, Azure, and Kubernetes, including IaC security and container hardening'
  },
  {
    id: 'devsecops',
    title: 'DevSecOps & IaC',
    category: Category.BLUE,
    description: 'Integrating security into CI/CD pipelines and infrastructure code.',
    icon: 'Code',
    promptTopic: 'DevSecOps, Secure CI/CD pipelines, Infrastructure as Code (Terraform/Ansible) security, and shift-left strategies'
  },
  {
    id: 'grc-risk',
    title: 'GRC & Risk Mgmt',
    category: Category.GRC,
    description: 'Compliance frameworks (NIST, ISO), risk assessment, and governance.',
    icon: 'Scale',
    promptTopic: 'Governance, Risk, and Compliance (GRC), NIST CSF, ISO 27001, and Enterprise Risk Management'
  },
  {
    id: 'dfir',
    title: 'DFIR',
    category: Category.BLUE,
    description: 'Digital Forensics and Incident Response playbooks.',
    icon: 'Microscope',
    promptTopic: 'Digital Forensics, Incident Response (DFIR) lifecycles, memory forensics, and chain of custody'
  },
  {
    id: 'app-sec',
    title: 'AppSec & Secure SDLC',
    category: Category.PURPLE,
    description: 'Securing the software development lifecycle and application logic.',
    icon: 'Bug',
    promptTopic: 'Application Security (AppSec), OWASP Top 10, Secure SDLC, and threat modeling'
  },
  {
    id: 'threat-intel',
    title: 'Threat Intelligence',
    category: Category.PURPLE,
    description: 'Attribution, TTP tracking, and strategic intelligence.',
    icon: 'Globe',
    promptTopic: 'Cyber Threat Intelligence (CTI), attribution, TTP tracking, and Diamond Model analysis'
  },
  {
    id: 'human-factors',
    title: 'Human Factors',
    category: Category.RED,
    description: 'Social engineering, insider threats, and psychology.',
    icon: 'Users',
    promptTopic: 'Social Engineering, Insider Threats, Human Factors in security, and security awareness psychology'
  },
  {
    id: 'exec-strategy',
    title: 'Executive Strategy',
    category: Category.STRATEGY,
    description: 'Program development, CISO leadership, and board communication.',
    icon: 'Briefcase',
    promptTopic: 'CISO Strategy, Cybersecurity Program Development, Board Reporting, and Security Culture building'
  }
];

export const CATEGORY_COLORS = {
  [Category.RED]: 'text-cyber-red border-cyber-red bg-cyber-red/10',
  [Category.BLUE]: 'text-cyber-blue border-cyber-blue bg-cyber-blue/10',
  [Category.PURPLE]: 'text-cyber-purple border-cyber-purple bg-cyber-purple/10',
  [Category.GRC]: 'text-cyber-green border-cyber-green bg-cyber-green/10',
  [Category.STRATEGY]: 'text-amber-400 border-amber-400 bg-amber-400/10',
  [Category.GENERAL]: 'text-slate-400 border-slate-400 bg-slate-400/10'
};

export const CATEGORY_BG = {
  [Category.RED]: 'bg-cyber-red',
  [Category.BLUE]: 'bg-cyber-blue',
  [Category.PURPLE]: 'bg-cyber-purple',
  [Category.GRC]: 'bg-cyber-green',
  [Category.STRATEGY]: 'bg-amber-400',
  [Category.GENERAL]: 'bg-slate-400'
};
