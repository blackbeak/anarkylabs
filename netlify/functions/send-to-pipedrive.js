const fetch = require('node-fetch');

exports.handler = async (event) => {
  // parse payload
  let { name, email, company, phone, metaID } = {};
  try {
    ({ name, email, company, phone, metaID } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  // basic validation
  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name and email are required" }),
    };
  }

  
  // Define the lead title (customizable) and prepare the detail message
  const leadTitle = `Trial Signup: ${company || 'New lead'}`;
  const detailString = [
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Company: ${company}`,
    phone && `Phone: ${phone}`,
    metaID && `MetaID: ${metaID}`,
  ]
    .filter(Boolean)
    .join("\n\n"); 

  try {
    // Create or retrieve a Person in Pipedrive
    const personRes = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: [{ value: email, primary: true }],
        }),
      }
    );
    const personJson = await personRes.json();
    if (!personRes.ok || !personJson.success) {
      console.error("❌ Person creation error:", personJson);
      return {
        statusCode: personRes.status || 502,
        body: JSON.stringify({ error: personJson.error || "Person creation failed", details: personJson }),
      };
    }
    const personId = personJson.data.id;

    // Now create a Lead linked to that Person
    const leadRes = await fetch(
      `https://api.pipedrive.com/v1/leads?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: leadTitle,
          person_id: personId,
        }),
      }
    );
    const leadJson = await leadRes.json();
    console.log("⬅️ Lead creation response:", leadRes.status, leadJson);
    if (!leadRes.ok || !leadJson.success) {
      console.error("❌ Lead creation error:", leadJson);
      return {
        statusCode: leadRes.status || 502,
        body: JSON.stringify({ error: leadJson.error || "Lead creation failed", details: leadJson }),
      };
    }

    // Attach the detail message as a Note
    const noteRes = await fetch(
      `https://api.pipedrive.com/v1/notes?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: detailString,
          lead_id: leadJson.data.id,
        }),
      }
    );
    const noteJson = await noteRes.json();
    console.log("⬅️ Note creation response:", noteRes.status, noteJson);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, lead: leadJson.data, note: noteJson.data }),
    };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error", details: err.message || err }),
    };
  }
};