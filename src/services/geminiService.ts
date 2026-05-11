/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCV(userData: {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  targetRole: string;
  template: 'Modern' | 'Traditional' | 'Creative';
}) {
  try {
    const templatePrompts = {
      Modern: "Clean, minimalist, and bold. Use strong headers and efficient use of space. Highly legible for tech-forward companies.",
      Traditional: "Standard business professional. Use clear, conservative formatting. Ideal for banking, oil & gas, and government agencies.",
      Creative: "Dynamic and expressive. Focus on personality and storytelling while remaining professional. Great for marketing, design, and media."
    };

    const prompt = `
      Create a PROFESSIONAL and READY-TO-USE CV for a job seeker. 
      Important: Output ONLY the polished text content. Do NOT wrap your response in markdown code blocks or use backticks at the start or end.
      Important: Do NOT include placeholder text like "(Replace with your...)" or "[Add skills]". If the user provided specific details, use them. If they are sparse, expand professionally based on the Target Role.
      
      USER DETAILS:
      Full Name: ${userData.fullName}
      Target Role: ${userData.targetRole}
      Email: ${userData.email}
      Phone: ${userData.phone}
      Education: ${userData.education}
      Work Experience: ${userData.experience}
      Skills: ${userData.skills}
      
      TEMPLATE STYLE: ${userData.template}
      STYLE GUIDELINES: ${templatePrompts[userData.template]}
      
      STRUCTURE:
      - Header: Name and Contact Info
      - Professional Summary: Achievement-oriented, tailored for Nigeria
      - Key Skills: Grouped logically
      - Professional Experience: Reverse chronological, use bullet points for achievements
      - Education: Degree and Institution
      
      Output the final document in plain markdown (using # for headers, * for bullets) but WITHOUT backticks.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No text content returned from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
}

export async function generateCoverLetter(userData: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  experienceSummary: string;
  keySkills: string;
  hiringManager?: string;
  companyValues?: string;
  tone: 'Professional' | 'Enthusiastic' | 'Confident';
}) {
  try {
    const prompt = `
      Write a highly tailored and professional cover letter for the Nigerian job market:
      
      APPLICANT DETAILS:
      Full Name: ${userData.fullName}
      Key Skills: ${userData.keySkills}
      Experience Summary: ${userData.experienceSummary}
      
      JOB DETAILS:
      Applying for: ${userData.jobTitle}
      At Company: ${userData.companyName}
      Hiring Manager (if known): ${userData.hiringManager || "Hiring Manager"}
      Company Values/Mission: ${userData.companyValues || "Not specified"}
      
      REQUIRED TONE: ${userData.tone}
      
      INSTRUCTIONS:
      1. Address the recipient formally (e.g., Dear ${userData.hiringManager || "Hiring Manager"}).
      2. Start with a strong opening paragraph mentioning the ${userData.jobTitle} role.
      3. Connect the applicant's experience (${userData.experienceSummary}) and skills (${userData.keySkills}) directly to the needs of ${userData.companyName}.
      4. If company values are provided (${userData.companyValues}), mention how the applicant aligns with them.
      5. Output in professional Markdown format with standard letter spacing.
      6. Ensure the closing is professional (e.g., Yours faithfully/sincerely for Nigerian standards).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No text content returned from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error("Error generating Cover Letter:", error);
    throw error;
  }
}

export async function getCareerAdviceSummaries() {
  // Optional: Use Gemini to generate dynamic advice if needed
  // For now, we'll use static data for stability
}
