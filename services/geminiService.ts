import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ContentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `You are the AI Tactician for "The Purple Book", a unified playbook for Red, Blue, and Purple teams.
Your mission is to generate elite-level cybersecurity content that bridges the gap between offensive operations and defensive strategy.

RULES:
1. **Technical Precision**: Use industry-standard terminology (MITRE ATT&CK, OODA Loop, IoCs, TTPs).
2. **Actionable Intelligence**: Every section must have a "Takeaway" or "Action Item".
3. **Format**: Use clean Markdown. Use code blocks for configs (YAML, JSON), scripts (Python, Bash), and query languages (SPL, KQL).
4. **Tone**: Authoritative, concise, and operational.
5. **No Fluff**: Avoid generic intros. Get straight to the tactics.

Do not wrap the entire response in a markdown block. Return raw markdown.`;

export const generateChapterContent = async (topic: string, type: ContentType): Promise<string> => {
  let prompt = '';

  switch (type) {
    case 'guide':
      prompt = `MISSION: Create a Field Manual / Strategic Guide on "${topic}".
      
      STRUCTURE:
      # Executive Brief
      - Bottom Line Up Front (BLUF)
      - Strategic Relevance
      
      # Technical Architecture
      - Core Components
      - Attack Surface Analysis
      
      # Essential Tools & Platforms
      - List key tools and platforms relevant to this specific topic.${topic.toLowerCase().includes('detection') ? ' (Include SIEMs, EDRs, and Hunting tools like Sigma/YARA)' : ''}
      
      # Operational Tactics
      - Red Team Perspective (How to break it)
      - Blue Team Perspective (How to detect/defend)
      
      # Hardening & Remediation
      - Best Practices (Include config snippets)
      
      # Future Vectors
      - Emerging threats in this domain`;
      break;
    case 'case-study':
      prompt = `MISSION: Declassify a Real-World Breach Scenario related to "${topic}".
      
      STRUCTURE:
      # Incident Report: [Create a realistic codename, e.g., OPERATION DARK CLOUD]
      
      ## 1. Target Profile
      - Industry, Tech Stack, Security Posture
      
      ## 2. The Kill Chain (Timeline)
      - **Initial Access**: How they got in.
      - **Persistence & Escalation**: How they stayed and moved up.
      - **Lateral Movement**: Mapping the network.
      - **Exfiltration/Impact**: The damage done.
      
      ## 3. Detection Gap Analysis
      - Why traditional controls failed.
      - What logs were missing.
      
      ## 4. Post-Incident Response
      - Containment strategy.
      - Forensic artifacts found (Show fake logs/hashes).
      
      ## 5. Lessons Learned
      - Immediate fixes vs. Long-term strategy.`;
      break;
    case 'lab':
      prompt = `MISSION: Design a Tactical Lab Exercise for "${topic}".
      TARGET AUDIENCE: Security Engineers / Pentesters.
      
      STRUCTURE:
      # Lab Directive: [Title]
      
      ## Objective
      - Specific skill to master (e.g., "Exploiting S3 misconfigurations" or "Writing Sigma rules for Kerberoasting").
      
      ## Environment Setup
      - Required Tools (Kali, SIEM, Cloud Shell).
      - Initial access/credentials (Simulated).
      
      ## Execution Phase (Step-by-Step)
      1. **Reconnaissance**: Commands to run.
      2. **Exploitation / Analysis**: The core task. Provide code snippets.
      3. **Verification**: How to confirm success.
      
      ## Blue Team Counter-Measure
      - How to detect this specific activity in logs.
      
      ## Challenge
      - A final task for the user to solve on their own.`;
      break;
    case 'diagram':
      prompt = `MISSION: Generate a Network Architecture Topology for "${topic}" as a JSON object.
      
      REQUIREMENTS:
      - Return ONLY valid JSON. No markdown formatting, no text before or after.
      - The JSON must match this schema:
      {
        "title": "string",
        "description": "string (brief overview)",
        "nodes": [
          { "id": "string", "label": "string", "type": "firewall|server|database|user|cloud|shield|router|endpoint", "layer": number (0-4), "details": "string (technical specs/vulnerabilities)" }
        ],
        "connections": [
          { "from": "node_id", "to": "node_id", "label": "optional string (protocol/port)" }
        ]
      }
      
      LOGIC:
      - Layer 0: External / Internet / Attacker
      - Layer 1: Perimeter / DMZ / Load Balancers
      - Layer 2: Application / Internal Network
      - Layer 3: Data / Storage / Sensitive
      - Layer 4: Management / Admin / Deep Secure
      - Create a realistic flow relevant to ${topic}. Include specific ports/protocols in connection labels.
      `;
      break;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: type === 'diagram' ? "You are a Network Architect. Output strictly valid JSON." : SYSTEM_INSTRUCTION,
        temperature: type === 'diagram' ? 0.2 : 0.4, // Lower temp for JSON structure
        responseMimeType: type === 'diagram' ? "application/json" : "text/plain",
      }
    });
    
    return response.text || "MISSION FAILED: Content generation error.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "CONNECTION SEVERED: Unable to reach command server. Check API Key.";
  }
};

export const generateChatResponse = async (history: {role: string, content: string}[], userMessage: string, currentContextTopic: string): Promise<string> => {
  try {
    const contextPrompt = `CURRENT MISSION CONTEXT: User is studying "${currentContextTopic}". 
    Provide tactical support. Answer brief and precise. Use military/cyber jargon appropriately.`;
    
    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: `${contextPrompt}\n\nINQUIRY: ${userMessage}` }]
      }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents, 
      config: {
        systemInstruction: "You are 'The Purple Book' AI Advisor. Your role is to clarify concepts, suggest tools, and provide command syntax. Be brief.",
      }
    });

    return response.text || "Signal lost.";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Uplink offline.";
  }
};