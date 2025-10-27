import Twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_NUMBER;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

const client = new Twilio(accountSid, authToken);

export default async function handler(req, res) {
  try {
    // Fetch student list from Google Sheet (Apps Script Web App)
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const students = await response.json();

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found in Google Sheet" });
    }

    // Call each student
    for (const student of students) {
      if (!student.Phone) continue;
      await client.calls.create({
        url: `${process.env.PUBLIC_URL}/api/voice?roll=${encodeURIComponent(student.RollNo)}&name=${encodeURIComponent(student.Name)}&section=${encodeURIComponent(student.Section)}`,
        to: student.Phone,
        from: fromNumber,
      });
    }

    res.status(200).json({ success: true, message: "✅ Calls started successfully!" });
  } catch (err) {
    console.error("❌ Error starting calls:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
