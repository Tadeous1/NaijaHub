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
}) {
  try {
    const prompt = `
      Create a professional CV for a job seeker with the following details:
      Full Name: ${userData.fullName}
      Target Role: ${userData.targetRole}
      Education: ${userData.education}
      Work Experience: ${userData.experience}
      Skills: ${userData.skills}
      
      The output should be in Markdown format, well-structured with clear headings, bullet points, and a professional tone. 
      Focus on making it achievement-oriented and tailored for the Nigerian job market.
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
}) {
  try {
    const prompt = `
      Write a professional and compelling cover letter for:
      Name: ${userData.fullName}
      Applying for: ${userData.jobTitle}
      At Company: ${userData.companyName}
      Experience Background: ${userData.experienceSummary}
      Key Skills: ${userData.keySkills}
      
      The output should be in Markdown format, following a standard business letter structure.
      It should be persuasive, enthusiastic, and professionally tailored for Nigerian employers.
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
