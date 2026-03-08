const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getAI = () => {
    if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

const symptomCheck = async (symptoms, age, gender, history) => {
    try {
        const ai = getAI();
        if (!ai) throw new Error('AI not configured');

        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a medical AI assistant. Based on the following patient information, provide a preliminary analysis.

Patient Information:
- Symptoms: ${symptoms.join(', ')}
- Age: ${age}
- Gender: ${gender}
- Medical History: ${history || 'None provided'}

Please respond ONLY with a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "possibleConditions": [
    {"condition": "Condition Name", "probability": "High/Medium/Low"}
  ],
  "riskLevel": "low/medium/high/critical",
  "suggestedTests": ["Test 1", "Test 2"],
  "recommendations": "Brief recommendations text",
  "disclaimer": "This is an AI-generated preliminary analysis. Always consult a qualified healthcare professional for accurate diagnosis."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('AI Symptom Check Error:', error.message);
        return {
            possibleConditions: [{ condition: 'AI analysis unavailable', probability: 'N/A' }],
            riskLevel: 'medium',
            suggestedTests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel'],
            recommendations: 'AI service temporarily unavailable. Please consult with the doctor for manual diagnosis.',
            disclaimer: 'AI service is currently unavailable. This is a fallback response.',
            fallback: true
        };
    }
};

const explainPrescription = async (prescription, patientName) => {
    try {
        const ai = getAI();
        if (!ai) throw new Error('AI not configured');

        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const medicinesText = prescription.medicines
            .map(m => `${m.name} - ${m.dosage}, ${m.frequency} for ${m.duration}`)
            .join('\n');

        const prompt = `You are a friendly medical AI assistant. Explain the following prescription in simple, easy-to-understand language for a patient.

Patient: ${patientName}
Diagnosis: ${prescription.diagnosis || 'Not specified'}
Medicines:
${medicinesText}
Instructions: ${prescription.instructions || 'None'}

Please respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "simpleExplanation": "Easy to understand explanation of the prescription and what each medicine does",
  "lifestyleRecommendations": ["Recommendation 1", "Recommendation 2"],
  "preventiveAdvice": "Preventive advice to avoid recurrence",
  "importantWarnings": ["Warning 1 if any"],
  "urduExplanation": "Brief explanation in Urdu/Roman Urdu for the patient"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('AI Prescription Explanation Error:', error.message);
        return {
            simpleExplanation: 'AI explanation is temporarily unavailable. Please ask your doctor to explain your prescription.',
            lifestyleRecommendations: ['Follow doctor instructions', 'Take medicines on time', 'Stay hydrated'],
            preventiveAdvice: 'Please consult your doctor for preventive advice.',
            importantWarnings: [],
            urduExplanation: 'AI service abhi available nahi hai. Apne doctor se prescription samjhein.',
            fallback: true
        };
    }
};

const riskFlagging = async (patientHistory) => {
    try {
        const ai = getAI();
        if (!ai) throw new Error('AI not configured');

        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a medical AI risk assessment system. Analyze the following patient history for risk patterns.

Patient History:
${JSON.stringify(patientHistory, null, 2)}

Please respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "riskFlags": [
    {"flag": "Description of risk", "severity": "high/medium/low", "recommendation": "What to do"}
  ],
  "overallRisk": "low/medium/high/critical",
  "patterns": ["Pattern 1 detected", "Pattern 2 detected"],
  "urgentActions": ["Action 1 if any"]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('AI Risk Flagging Error:', error.message);
        return {
            riskFlags: [],
            overallRisk: 'unknown',
            patterns: ['AI analysis unavailable'],
            urgentActions: [],
            fallback: true
        };
    }
};

const predictiveAnalytics = async (analyticsData) => {
    try {
        const ai = getAI();
        if (!ai) throw new Error('AI not configured');

        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a medical AI analytics system. Analyze the following clinic data and provide predictive insights.

Clinic Data:
${JSON.stringify(analyticsData, null, 2)}

Please respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "commonDiseases": [{"disease": "Name", "count": 0, "trend": "increasing/decreasing/stable"}],
  "patientLoadForecast": "Forecast description for next month",
  "doctorPerformance": [{"insight": "Performance insight"}],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "seasonalTrends": "Seasonal trend analysis"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(text);
    } catch (error) {
        console.error('AI Predictive Analytics Error:', error.message);
        return {
            commonDiseases: [],
            patientLoadForecast: 'AI analytics temporarily unavailable',
            doctorPerformance: [],
            recommendations: ['AI service is currently unavailable'],
            seasonalTrends: 'Unable to analyze',
            fallback: true
        };
    }
};

module.exports = { symptomCheck, explainPrescription, riskFlagging, predictiveAnalytics };
