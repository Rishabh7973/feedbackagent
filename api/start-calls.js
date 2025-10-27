// import Twilio from "twilio";

// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const fromNumber = process.env.TWILIO_NUMBER;
// const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// const client = new Twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   try {
//     // Example student list — can be fetched from Google Sheet later
//     const students = [
//       { RollNo: "23BCS101", Name: "Rishabh Tiwari", Section: "CSE-6A", Phone: "+91XXXXXXXXXX" },
//       { RollNo: "23BCS102", Name: "Aman Verma", Section: "CSE-6A", Phone: "+91XXXXXXXXXX" }
//     ];

//     for (const student of students) {
//       await client.calls.create({
//         url: `${process.env.PUBLIC_URL}/api/voice?roll=${student.RollNo}&name=${encodeURIComponent(student.Name)}&section=${student.Section}`,
//         to: student.Phone,
//         from: fromNumber
//       });
//     }

//     res.status(200).send("✅ Calls started successfully!");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("❌ Error starting calls.");
//   }
// }

import twilio from "twilio";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: "Missing 'to' number" });
    }

    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    console.log("FROM number:", process.env.TWILIO_NUMBER); // for debugging

    const call = await client.calls.create({
      twiml: '<Response><Say>Hello, this is your feedback test call!</Say></Response>',
      to,
      from: process.env.TWILIO_NUMBER,
    });

    res.status(200).json({ success: true, sid: call.sid });
  } catch (err) {
    console.error("Twilio Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}


