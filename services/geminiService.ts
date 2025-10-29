import { GoogleGenAI } from "@google/genai";
import { Booking } from '../types';

export const generateBookingSummary = async (bookings: Booking[]): Promise<string> => {
  // Fix: Per coding guidelines, assume API_KEY is present and valid.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    As an administrative assistant for a school booking system, generate a concise summary report based on the following booking data.
    The report should highlight key statistics like the total number of bookings, breakdown by status (Approved, Pending, Cancelled), and which rooms are most frequently booked.
    Also, analyze the types of events (categories) being booked. If there are any cancelled bookings with reasons, mention them briefly.
    Do not just list the bookings. Provide a narrative summary.

    Booking Data (JSON):
    ${JSON.stringify(bookings, null, 2)}

    Example Output Format:
    **Daily Booking Summary**

    *   **Overall Activity:** There are a total of X bookings for today.
    *   **Status Overview:** Y bookings are approved, Z are pending review, and W have been cancelled.
    *   **Facility Usage:** The most popular facility is [Room Name] with N bookings.
    *   **Event Types:** The bookings are mainly for [Category], with [Number] events of this type.
    *   **Cancellations:** Note that a booking for [Room Name] was cancelled due to [Reason].
    *   **General Notes:** [Add any other insightful observation, e.g., "Peak booking times appear to be in the afternoon."]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while generating the report: ${error.message}`;
    }
    return "An unknown error occurred while generating the report.";
  }
};
