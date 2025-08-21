const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Parse payload
  let formData = {};
  try {
    formData = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  // Extract formId and submitted fields
  const { formId, metaID, ...submittedFields } = formData;
  
  if (!formId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "formId is required" }),
    };
  }

  try {
    // Fetch form definition from Strapi by formId (which matches title field)
    const formDefinition = await fetchFormDefinition(formId);
    
    if (!formDefinition) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form not found in Strapi" }),
      };
    }

    // Validate submitted data against Strapi form definition
    const validation = validateFormData(formDefinition, submittedFields);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "Validation failed", 
          details: validation.errors 
        }),
      };
    }

    // Build lead title and details from Strapi form definition
    const leadTitle = buildLeadTitleFromStrapi(formDefinition, submittedFields);
    const detailString = buildDetailStringFromStrapi(formDefinition, submittedFields);

    // Create or retrieve Person in Pipedrive
    const personData = buildPersonData(formDefinition, submittedFields);
    console.log('👤 Person data being sent to Pipedrive:', JSON.stringify(personData, null, 2));
    
    const personRes = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personData),
      }
    );

    const personJson = await personRes.json();
    console.log('👤 Pipedrive person response:', personRes.status, JSON.stringify(personJson, null, 2));
    
    if (!personRes.ok || !personJson.success) {
      console.error("❌ Person creation error:", personJson);
      return {
        statusCode: personRes.status || 502,
        body: JSON.stringify({ 
          error: personJson.error || "Person creation failed", 
          details: personJson 
        }),
      };
    }
    const personId = personJson.data.id;

    // Create Lead with custom fields mapped from Strapi
    const leadData = await buildLeadData(formDefinition, submittedFields, personId, leadTitle);
    console.log('📋 Lead data being sent to Pipedrive:', JSON.stringify(leadData, null, 2));
    
    const leadRes = await fetch(
      `https://api.pipedrive.com/v1/leads?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }
    );

    const leadJson = await leadRes.json();
    console.log("📋 Lead creation response:", leadRes.status, JSON.stringify(leadJson, null, 2));
    
    if (!leadRes.ok || !leadJson.success) {
      console.error("❌ Lead creation error:", leadJson);
      return {
        statusCode: leadRes.status || 502,
        body: JSON.stringify({ 
          error: leadJson.error || "Lead creation failed", 
          details: leadJson 
        }),
      };
    }

    // Attach detailed note
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
      body: JSON.stringify({ 
        success: true, 
        lead: leadJson.data, 
        note: noteJson.data,
        formType: formDefinition.attributes?.title || formDefinition.title
      }),
    };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Unexpected error", 
        details: err.message || err 
      }),
    };
  }
};

// Fetch form definition from Strapi by title
async function fetchFormDefinition(title) {
  const strapiUrl = process.env.STRAPI_URL || 'https://energized-canvas-6b08f4eb08.strapiapp.com';
  const strapiToken = process.env.STRAPI_TOKEN || '258f2054cf8190d7cfc47d549014cad4d921f2354e6289703a83872d525846dfb01368684a7192f4db572dc23bd051758fe6cd3266a7f51f8b2540b870d9c0109079af749dc7efe3425c06c0a610beeb56de80d6318895a5822c1c311a5c2c66f983f55fbd6f0550394b4fd9a9bc5378a30295c8c344532f508547e6c25f81cb';
  
  try {
    const url = `${strapiUrl}/api/forms?filters[title][$eq]=${title}&populate=*`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.data && data.data.length > 0) {
      return data.data[0]; // Return first matching form
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching form definition:', error);
    return null;
  }
}

// Validate form data against Strapi form definition
function validateFormData(formDefinition, submittedFields) {
  const errors = [];
  
  // Get form fields from Strapi (adjust path based on your Strapi structure)
  const formFields = formDefinition.attributes?.fields || formDefinition.fields || [];
  
  // Check required fields
  formFields.forEach(field => {
    if (field.required && (!submittedFields[field.name] || submittedFields[field.name] === '')) {
      errors.push(`${field.label || field.name} is required`);
    }
    
    // Add type validation if needed
    if (submittedFields[field.name] && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(submittedFields[field.name])) {
        errors.push(`${field.label || field.name} must be a valid email address`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Build lead title using Strapi form definition
function buildLeadTitleFromStrapi(formDefinition, submittedFields) {
  const formTitle = formDefinition.attributes?.title || formDefinition.title || 'Form Submission';
  const company = submittedFields.company || submittedFields.organization || 'New Lead';
  
  return `${formTitle}: ${company}`;
}

// Build detail string using Strapi field definitions
function buildDetailStringFromStrapi(formDefinition, submittedFields) {
  const details = [];
  const formFields = formDefinition.attributes?.fields || formDefinition.fields || [];
  
  // Create a map of field names to labels from Strapi
  const fieldMap = {};
  formFields.forEach(field => {
    fieldMap[field.name] = field.label || formatFieldLabel(field.name);
  });
  
  // Build details using Strapi labels
  Object.entries(submittedFields).forEach(([key, value]) => {
    if (value && value !== '') {
      const label = fieldMap[key] || formatFieldLabel(key);
      details.push(`${label}: ${value}`);
    }
  });
  
  return details.join('\n\n');
}

// Build person data for Pipedrive
function buildPersonData(formDefinition, submittedFields) {
  const personData = {};
  
  // Standard mappings
  if (submittedFields.name) personData.name = submittedFields.name;
  if (submittedFields.email) {
    personData.email = [{ value: submittedFields.email, primary: true }];
  }
  if (submittedFields.phone) {
    personData.phone = [{ value: submittedFields.phone, primary: true }];
  }
  
  return personData;
}

// Build lead data with organization linking
async function buildLeadData(formDefinition, submittedFields, personId, leadTitle) {
  const leadData = {
    title: leadTitle,
    person_id: personId,
    origin: "API"  // Pipedrive requires this to be exactly "API"
  };
  
  // Link organization if company provided
  if (submittedFields.company) {
    const orgId = await getOrCreateOrganization(submittedFields.company);
    if (orgId) leadData.org_id = orgId;
  }
  
  // Map custom fields based on Strapi field definitions
  const customFields = mapCustomFields(formDefinition, submittedFields);
  Object.assign(leadData, customFields);
  
  return leadData;
}

// Map custom fields based on Strapi form definition
function mapCustomFields(formDefinition, submittedFields) {
  const customFields = {};
  const formFields = formDefinition.attributes?.fields || formDefinition.fields || [];
  
  formFields.forEach(field => {
    // Skip standard fields that are handled elsewhere
    const standardFields = ['name', 'email', 'phone', 'company', 'organization'];
    if (standardFields.includes(field.name)) return;
    
    const value = submittedFields[field.name];
    if (value) {
      // Map to Pipedrive custom field (you can configure this mapping)
      const pipedriveFieldName = field.pipedriveField || field.name;
      customFields[pipedriveFieldName] = value;
    }
  });
  
  return customFields;
}

// Helper function to format field labels
function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Helper function to get or create organization (same as before)
async function getOrCreateOrganization(companyName) {
  try {
    const searchRes = await fetch(
      `https://api.pipedrive.com/v1/organizations/search?term=${encodeURIComponent(companyName)}&api_token=${process.env.PIPEDRIVE_API_KEY}`
    );
    const searchJson = await searchRes.json();
    
    if (searchJson.success && searchJson.data && searchJson.data.items.length > 0) {
      return searchJson.data.items[0].item.id;
    }
    
    const createRes = await fetch(
      `https://api.pipedrive.com/v1/organizations?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName }),
      }
    );
    const createJson = await createRes.json();
    
    if (createJson.success) {
      return createJson.data.id;
    }
  } catch (err) {
    console.error("Organization creation error:", err);
  }
  
  return null;
}