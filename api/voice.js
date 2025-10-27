export default async function handler(req, res) {
  try {
    const { roll, name, section } = req.query;
    const digits = req.body.Digits;

    const feedbackText = digits === "1" ? "Satisfied" : "Not Satisfied";

    // Send to Google Sheet
    await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll, name, section, feedback: feedbackText }),
    });

    const twiml = `
      <Response>
        <Say voice="Polly.Aditi-Neural" language="hi-IN">
          धन्यवाद ${name}, आपका फीडबैक रिकॉर्ड कर लिया गया है। शुभ दिन।
        </Say>
        <Hangup/>
      </Response>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(twiml);
  } catch (err) {
    console.error("❌ Feedback error:", err);
    res.status(500).send("<Response><Say>Error saving feedback</Say></Response>");
  }
}
