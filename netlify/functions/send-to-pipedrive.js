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
    // Fetch form definition from Strapi
    const formDefinition = await fetchFormDefinition(formId);
    
    if (!formDefinition) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form not found in Strapi" }),
      };
    }

    // Validate submitted data
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

    // Build data
    const leadTitle = buildLeadTitleFromStrapi(formDefinition, submittedFields);
    const detailString = buildDetailStringFromStrapi(formDefinition, submittedFields);

    // Create Person in Pipedrive with proper labeling
    const personData = buildPersonData(formDefinition, submittedFields, formId);
    console.log('👤 Person data:', JSON.stringify(personData, null, 2));
    
    const personRes = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personData),
      }
    );

    const personJson = await personRes.json();
    console.log('👤 Person response:', personRes.status);
    
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

    // Create Lead in Pipedrive
    const leadData = await buildLeadData(formDefinition, submittedFields, personJson.data.id, leadTitle, formId);
    console.log('📋 Lead data:', JSON.stringify(leadData, null, 2));
    
    const leadRes = await fetch(
      `https://api.pipedrive.com/v1/leads?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }
    );

    const leadJson = await leadRes.json();
    console.log("📋 Lead response:", leadRes.status);
    
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

    // Add detailed note with all form data
    if (detailString) {
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
      console.log("📝 Note response:", noteRes.status);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        lead: leadJson.data,
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

// Fetch form definition from Strapi
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
    return (response.ok && data.data && data.data.length > 0) ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching form definition:', error);
    return null;
  }
}

// Validate form data against Strapi form definition
function validateFormData(formDefinition, submittedFields) {
  const errors = [];
  const formFields = formDefinition.attributes?.field || formDefinition.field || [];
  
  formFields.forEach(field => {
    if (field.required && (!submittedFields[field.name] || submittedFields[field.name] === '')) {
      errors.push(`${field.label || field.name} is required`);
    }
    
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

// Build lead title
function buildLeadTitleFromStrapi(formDefinition, submittedFields) {
  const formTitle = formDefinition.attributes?.title || formDefinition.title || 'Form Submission';
  const company = submittedFields.company || submittedFields.organization || 'New Lead';
  return `${formTitle}: ${company}`;
}

// Enhanced detail string with proper field type formatting
function buildDetailStringFromStrapi(formDefinition, submittedFields) {
  const details = [];
  const formFields = formDefinition.attributes?.field || formDefinition.field || [];
  
  // Only exclude source tracking fields - keep all form data
  const excludeFromDetails = ['source_channel', 'source_channel_id', 'labels'];
  
  // Create field metadata mapping
  const fieldMap = {};
  formFields.forEach(field => {
    fieldMap[field.name] = {
      label: field.label || formatFieldLabel(field.name),
      type: field.type || 'text',
      options: field.options || null
    };
  });
  
  // Process each submitted field with proper formatting
  Object.entries(submittedFields).forEach(([key, value]) => {
    if (!value || value === '' || excludeFromDetails.includes(key)) return;
    
    // Handle checkbox arrays (field names might have [] suffix)
    const cleanKey = key.replace('[]', '');
    const fieldInfo = fieldMap[cleanKey] || fieldMap[key] || { 
      label: formatFieldLabel(cleanKey), 
      type: 'text' 
    };
    
    const formattedEntry = formatFieldForNote(fieldInfo, key, value);
    if (formattedEntry) {
      details.push(formattedEntry);
    }
  });
  
  // Add form metadata
  if (details.length > 0) {
    details.push(`--- Submission Details ---`);
    details.push(`Form: ${formDefinition.attributes?.title || formDefinition.title}`);
    details.push(`Date: ${new Date().toLocaleString()}`);
  }
  
  return details.join('\n\n');
}

// Format individual fields based on type
function formatFieldForNote(fieldInfo, fieldName, value) {
  const { label, type } = fieldInfo;
  
  switch (type) {
    case 'textarea':
      // Multi-line text with line break after label
      return `${label}:\n${value}`;
      
    case 'checkbox':
      // Handle array values for checkboxes
      if (Array.isArray(value)) {
        return `${label}: ${value.join(', ')}`;
      }
      return `${label}: ${value}`;
      
    case 'radio':
    case 'select':
      // Single selection
      return `${label}: ${value}`;
      
    case 'file':
      // File uploads (if supported)
      return `${label}: ${value} (file)`;
      
    case 'date':
      // Format date nicely
      try {
        const date = new Date(value);
        return `${label}: ${date.toLocaleDateString()}`;
      } catch {
        return `${label}: ${value}`;
      }
      
    case 'datetime-local':
      // Format datetime
      try {
        const datetime = new Date(value);
        return `${label}: ${datetime.toLocaleString()}`;
      } catch {
        return `${label}: ${value}`;
      }
      
    case 'email':
      return `${label}: ${value}`;
      
    case 'tel':
      return `${label}: ${value}`;
      
    case 'url':
      return `${label}: ${value}`;
      
    case 'number':
      return `${label}: ${value}`;
      
    case 'hidden':
      // Skip hidden fields in notes
      return null;
      
    default:
      // Text and other simple fields
      return `${label}: ${value}`;
  }
}

// Build person data with name extraction and form-based labeling
function buildPersonData(formDefinition, submittedFields, formId) {
  const personData = {};
  
  // Handle name - use provided name or extract from email
  if (submittedFields.name) {
    personData.name = submittedFields.name;
  } else if (submittedFields.email) {
    const emailUsername = submittedFields.email.split('@')[0];
    const cleanedName = emailUsername
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    personData.name = cleanedName || 'Newsletter Subscriber';
  }
  
  if (submittedFields.email) {
    personData.email = [{ value: submittedFields.email, primary: true }];
  }
  if (submittedFields.phone) {
    personData.phone = [{ value: submittedFields.phone, primary: true }];
  }
  
  // Add person label for newsletter subscribers only
  if (formId === 'subscribeForm') {
    personData.label = 95;  // "News Subscriber" 
  }
  
  return personData;
}

// Build lead data with correct Pipedrive API field mappings
async function buildLeadData(formDefinition, submittedFields, personId, leadTitle, formId) {
  const leadData = {
    title: leadTitle,
    person_id: personId,
    origin: "API"
  };
  
  // Channel mapping (integer required)
  if (submittedFields.source_channel) {
    const channelMapping = {
      'Newsletter': 79,        // "Web forms" 
      'Contact Form': 82,      // "Web visitors"
      'Campaign': 83,          // "Campaigns"
      // Add more as needed
    };
    const channelId = channelMapping[submittedFields.source_channel];
    if (channelId) {
      leadData.channel = channelId;
    }
  }
  
  // Channel ID (string)
  if (submittedFields.source_channel_id) {
    leadData.channel_id = submittedFields.source_channel_id;
  }
  
  // Labels based on formId (which form was submitted)
  if (submittedFields.labels || formId) {
    const labelMappingByForm = {
      // Newsletter forms get "Warm" label
      'subscribeForm': '4ccf7818-7bdc-4722-b550-c7583fa68168',    // "Warm"
      
      // Contact forms get "Hot" label  
      'contactForm': '006b6abd-28c1-4eff-a062-52a5e9b0306c',      // "Hot"
      'demoForm': '006b6abd-28c1-4eff-a062-52a5e9b0306c',         // "Hot"
     
      // Job applications
      'careerForm': '7d3083a0-da00-11ed-aabd-f7c91e0125d9',       // "Job Applicant"
    };
    
    const labelId = labelMappingByForm[formId];
    if (labelId) {
      leadData.label_ids = [labelId];
    }
  }
  
  // Organization linking
  if (submittedFields.company) {
    const orgId = await getOrCreateOrganization(submittedFields.company);
    if (orgId) leadData.organization_id = orgId;
  }
  
  return leadData;
}

// Get or create organization
async function getOrCreateOrganization(companyName) {
  try {
    // Search for existing organization
    const searchRes = await fetch(
      `https://api.pipedrive.com/v1/organizations/search?term=${encodeURIComponent(companyName)}&api_token=${process.env.PIPEDRIVE_API_KEY}`
    );
    const searchJson = await searchRes.json();
    
    if (searchJson.success && searchJson.data && searchJson.data.items.length > 0) {
      return searchJson.data.items[0].item.id;
    }
    
    // Create new organization
    const createRes = await fetch(
      `https://api.pipedrive.com/v1/organizations?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName }),
      }
    );
    const createJson = await createRes.json();
    
    return createJson.success ? createJson.data.id : null;
  } catch (err) {
    console.error("Organization error:", err);
    return null;
  }
}

// Format field labels
function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}