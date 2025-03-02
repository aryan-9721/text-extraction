export async function extractFieldsWithGemini(base64Images, apiKey) {
  const fieldsToExtract = [
    "Patient Address 1", "Time Of Discharge", "Patient Address 2", "Claimed Amount",
    "Patient Mobile", "Accomodation Type", "Patient Bank Account No", "ICU Days",
    "Patient Bank Name", "Patiend Paid Amount", "Patient Bank Branch Name", "Bill NO",
    "Patient Bank Account Type", "Covid", "Patient Bank IFSC Code", "Patient Condition",
    "Patient EmailID", "Provisional/Final Diagnosis", "Patient PAN No", "Accident Case",
    "Patinet Aadhar No", "Death Case", "TreatingDoctorName", "Date of Death",
    "TreatingDoctorRegistrationNumber", "TimeOfDeath", "Claim Registered Mobile No", "Maternity",
    "Claim Registered Email ID", "Date of Delivery", "Claim Type", "HospitalName",
    "Received Date", "HospitalAddress", "Service Sub Type", "HospitalCity",
    "Hospitalization Type", "HospitalPhoneNumber", "Request Type", "HospitalGst",
    "DateOfAdmission", "HospitalEmailID", "TimeOfAdmission", "HospitalRegistrationNumber",
    "DateOfDischarge", "HospitalWebsite", "HospitalPAN", "HospitalPincode"
  ];

  const prompt = `
    Extract the following fields from the provided medical document images.
    Return ONLY a valid JSON object with the field names as keys and extracted values as values.
    If a field cannot be found, set its value to an empty string.

    Fields to extract:
    ${fieldsToExtract.join(', ')}

    Response format example:
    {
      "Patient Address 1": "extracted value",
      "Time Of Discharge": "extracted value",
      ...
    }
  `;

  try {
    // Prepare API request payload
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "application/pdf", 
                data: base64Images, // Base64-encoded pdf data
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    };

    // Make API call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const result = await response.json();
    
    // Extract JSON from response
    const textResponse = result.candidates[0]?.content?.parts[0]?.text;
    const jsonMatch = textResponse?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON from Gemini response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw new Error(`Failed to extract information: ${error.message}`);
  }
}
