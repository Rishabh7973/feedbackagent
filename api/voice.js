import fetch from "node-fetch";
import Twilio from "twilio";

export default async function handler(req, res) {
  const { roll, name, section } = req.query;
  const VoiceResponse = Twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  try {
    // Fetch data from Google Apps Script
    const facultyRes = await fetch(`${process.env.GOOGLE_SCRIPT_URL}?action=faculty&section=${section}`);
    const facultyList = await facultyRes.json();

    const questionRes = await fetch(`${process.env.GOOGLE_SCRIPT_URL}?action=questions`);
    const questions = await questionRes.json();

    response.say(`Namaste ${name}. Kripya feedback dein.`);

    for (const f of facultyList) {
      response.say(`${f.Faculty} ke ${f.Subject} ke liye feedback dein.`);
      for (let i = 0; i < questions.length; i++) {
        response.say(questions[i]);
        response.gather({
          input: "speech",
          action: `${process.env.GOOGLE_SCRIPT_URL}`,
          method: "POST"
        });
      }
    }

    response.say("Dhanyavaad! Aapka feedback record ho gaya hai.");
  } catch (error) {
    response.say("Kuch galti ho gayi hai, kripya fir se koshish karein.");
    console.error(error);
  }

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(response.toString());
}
