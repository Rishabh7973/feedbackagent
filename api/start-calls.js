import Twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_NUMBER;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const PUBLIC_URL = process.env.PUBLIC_URL;

const client = new Twilio(accountSid, authToken);

export default async function handler(req, res) {
  try {
    console.log("🟢 STARTING CALLS...");
    console.log("GOOGLE_SCRIPT_URL:", GOOGLE_SCRIPT_URL);
    console.log("TWILIO_SID:", accountSid ? "✅ loaded" : "❌ missing");

    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getStudents`);
    console.log("Google Script Response Status:", response.status);

    const data = await response.text();
    console.log("📄 Raw Response:", data);

    let students;
    try {
      students = JSON.parse(data);
    } catch (err) {
      throw new Error("Invalid JSON from Google Script");
    }

    if (!Array.isArray(students) || students.length === 0) {
      throw new Error("No students found or invalid format");
    }

    for (const student of students) {
      if (!student.Phone) continue;

      console.log(`📞 Calling ${student.Name} (${student.Phone})...`);

      await client.calls.create({
        url: `${PUBLIC_URL}/api/voice?roll=${encodeURIComponent(student.RollNo)}&name=${encodeURIComponent(student.Name)}&section=${encodeURIComponent(student.Section)}`,
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
