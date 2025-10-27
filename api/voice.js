export default async function handler(req, res) {
  const { roll, name, section } = req.query;

  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">Hello ${name}. This is an automated feedback call for section ${section}.</Say>
      <Say>Question one: How was the clarity of the lecture?</Say>
      <Record
        maxLength="15"
        playBeep="true"
        action="${process.env.PUBLIC_URL}/api/record?roll=${roll}&name=${encodeURIComponent(name)}&section=${section}&question=Clarity"
      />
    </Response>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(twiml);
}
