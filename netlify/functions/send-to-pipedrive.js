const fetch = require('node-fetch');

// ===========================================
// SERVER-SIDE SPAM PROTECTION
// ===========================================

// In-memory rate limiting storage
const submissionLog = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3; // Reduced from 5 to 3 for stricter control
const MIN_TIME_BETWEEN_SUBMISSIONS = 60 * 1000; // 60 seconds between submissions from same IP

// Disposable email domains (expand as needed based on your spam patterns)
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
  'yopmail.com', 'maildrop.cc', 'dispostable.com', 'getairmail.com',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
  'guerrillamail.de', 'spam4.me', 'tempinbox.com', 'tmpeml.info'
];

// Spam keywords (customize based on your spam patterns)
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'crypto', 'bitcoin', 'casino', 'lottery', 'winner',
  'click here', 'buy now', 'limited time', 'act now', 'pharmacy',
  'weight loss', 'work from home', 'make money fast', 'free money',
  'nigerian prince', 'inheritance', 'bank transfer', 'wire transfer'
];

exports.handler = async (event) => {
  // Get client IP for rate limiting
  const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   event.headers['client-ip'] || 
                   'unknown';

  console.log(`📨 Form submission from IP: ${clientIP}`);

  // Parse payload
  let formData = {};
  try {
    formData = JSON.parse(event.body);
  } catch {
    console.log('❌ Invalid JSON');
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { formId, metaID, ...submittedFields } = formData;
  
  if (!formId) {
    console.log('❌ Missing formId');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "formId is required" }),
    };
  }

  // ===========================================
  // SPAM PROTECTION CHECKS
  // ===========================================

  try {
    // 1. RATE LIMITING - Check hourly limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log(`🚫 SPAM BLOCKED: Rate limit exceeded for IP ${clientIP} (${rateLimitResult.count} submissions in last hour)`);
      return {
        statusCode: 429,
        body: JSON.stringify({ 
          error: "Too many submissions. Please try again later.",
          details: "Rate limit exceeded"
        }),
      };
    }

    // 2. TIME-BASED CHECK - Minimum time between submissions
    const lastSubmissionTime = getLastSubmissionTime(clientIP);
    if (lastSubmissionTime) {
      const timeSinceLastSubmission = Date.now() - lastSubmissionTime;
      if (timeSinceLastSubmission < MIN_TIME_BETWEEN_SUBMISSIONS) {
        const waitTime = Math.ceil((MIN_TIME_BETWEEN_SUBMISSIONS - timeSinceLastSubmission) / 1000);
        console.log(`🚫 SPAM BLOCKED: Submission too fast from IP ${clientIP} (${timeSinceLastSubmission}ms since last submission)`);
        return {
          statusCode: 429,
          body: JSON.stringify({ 
            error: `Please wait ${waitTime} seconds before submitting again.`,
            details: "Submission rate too high"
          }),
        };
      }
    }

    // 3. EMAIL VALIDATION - Check for disposable emails
    if (submittedFields.email) {
      const emailValidation = validateEmail(submittedFields.email);
      if (!emailValidation.valid) {
        console.log(`🚫 SPAM BLOCKED: Invalid email from IP ${clientIP} - ${emailValidation.reason}`);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: "Please use a valid email address.",
            details: emailValidation.reason
          }),
        };
      }
    }

    // 4. CONTENT ANALYSIS - Check for spam keywords
    const contentAnalysis = analyzeContent(submittedFields);
    if (contentAnalysis.isSpam) {
      console.log(`🚫 SPAM BLOCKED: Spam content detected from IP ${clientIP} - ${contentAnalysis.reason}`);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "Your submission contains inappropriate content.",
          details: contentAnalysis.reason
        }),
      };
    }

    // 5. DUPLICATE DETECTION - Check for identical recent submissions
    const duplicateCheck = checkForDuplicates(clientIP, submittedFields);
    if (duplicateCheck.isDuplicate) {
      console.log(`🚫 SPAM BLOCKED: Duplicate submission from IP ${clientIP}`);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "This submission was already received.",
          details: "Duplicate submission detected"
        }),
      };
    }

    // Record submission for rate limiting
    recordSubmission(clientIP, submittedFields);
    console.log(`✅ Spam checks passed for IP ${clientIP}`);

    // Fetch form definition from Strapi
    const formDefinition = await fetchFormDefinition(formId);
    
    if (!formDefinition) {
      console.log(`❌ Form not found: ${formId}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form not found in Strapi" }),
      };
    }

    // Validate submitted data
    const validation = validateFormData(formDefinition, submittedFields);
    if (!validation.isValid) {
      console.log(`❌ Validation failed:`, validation.errors);
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

    // Add spam check metadata to notes
    const spamCheckInfo = `\n\n--- Submission Metadata ---\n` +
      `IP: ${clientIP}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Form: ${formId}`;

    // Create Person in Pipedrive
    const personData = buildPersonData(formDefinition, submittedFields, formId);
    console.log('👤 Creating person in Pipedrive');
    
    const personRes = await fetch(
      `https://api.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personData),
      }
    );

    const personJson = await personRes.json();
    
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

    console.log(`✅ Person created: ${personJson.data.id}`);

    // Create Lead in Pipedrive
    const leadData = await buildLeadData(formDefinition, submittedFields, personJson.data.id, leadTitle, formId);
    console.log('📋 Creating lead in Pipedrive');
    
    const leadRes = await fetch(
      `https://api.pipedrive.com/v1/leads?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }
    );

    const leadJson = await leadRes.json();
    
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

    console.log(`✅ Lead created: ${leadJson.data.id}`);

    // Add detailed note with form data + spam check metadata
    if (detailString) {
      const noteRes = await fetch(
        `https://api.pipedrive.com/v1/notes?api_token=${process.env.PIPEDRIVE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: detailString + spamCheckInfo,
            lead_id: leadJson.data.id,
          }),
        }
      );
      await noteRes.json();
      console.log("📝 Note added to lead");
    }

    console.log(`✅ SUBMISSION ACCEPTED from IP ${clientIP}`);

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

// ===========================================
// SPAM PROTECTION FUNCTIONS
// ===========================================

function checkRateLimit(ip) {
  const now = Date.now();
  const submissions = submissionLog.get(ip) || [];
  
  // Remove submissions outside the time window
  const recentSubmissions = submissions.filter(sub => 
    now - sub.timestamp < RATE_LIMIT_WINDOW
  );
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return { 
      allowed: false, 
      count: recentSubmissions.length,
      remaining: 0 
    };
  }
  
  return { 
    allowed: true, 
    count: recentSubmissions.length,
    remaining: MAX_SUBMISSIONS_PER_HOUR - recentSubmissions.length 
  };
}

function getLastSubmissionTime(ip) {
  const submissions = submissionLog.get(ip) || [];
  if (submissions.length === 0) return null;
  
  // Get most recent submission
  const sorted = submissions.sort((a, b) => b.timestamp - a.timestamp);
  return sorted[0].timestamp;
}

function recordSubmission(ip, data) {
  const now = Date.now();
  const submissions = submissionLog.get(ip) || [];
  
  submissions.push({
    timestamp: now,
    email: data.email,
    dataHash: generateDataHash(data)
  });
  
  submissionLog.set(ip, submissions);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    cleanupOldSubmissions();
  }
}

function generateDataHash(data) {
  // Simple hash of email + message for duplicate detection
  const key = `${data.email || ''}_${data.message || ''}_${data.name || ''}`;
  return key.toLowerCase().replace(/\s/g, '');
}

function checkForDuplicates(ip, data) {
  const submissions = submissionLog.get(ip) || [];
  const dataHash = generateDataHash(data);
  const now = Date.now();
  const DUPLICATE_WINDOW = 10 * 60 * 1000; // 10 minutes
  
  // Check for identical submission in last 10 minutes
  const duplicate = submissions.find(sub => 
    sub.dataHash === dataHash && 
    (now - sub.timestamp) < DUPLICATE_WINDOW
  );
  
  return { isDuplicate: !!duplicate };
}

function cleanupOldSubmissions() {
  const now = Date.now();
  for (const [ip, submissions] of submissionLog.entries()) {
    const recent = submissions.filter(sub => 
      now - sub.timestamp < RATE_LIMIT_WINDOW
    );
    if (recent.length === 0) {
      submissionLog.delete(ip);
    } else {
      submissionLog.set(ip, recent);
    }
  }
}

function validateEmail(email) {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }
  
  // Check for disposable email domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /^[a-z0-9]{20,}@/,     // Very long random username
    /^test.*@/i,            // Test emails
    /^spam.*@/i,            // Spam emails
    /^noreply.*@/i,         // No-reply emails
    /^\d+@/,                // Only numbers before @
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { valid: false, reason: 'Suspicious email pattern detected' };
  }
  
  return { valid: true };
}

function analyzeContent(fields) {
  const allText = Object.values(fields)
    .filter(v => typeof v === 'string')
    .join(' ')
    .toLowerCase();
  
  // Check individual fields for random gibberish (like VZaMVfznSuhvAotgUiqa)
  // Skip phone, email, and other numeric/formatted fields
  const fieldsToCheck = ['name', 'message', 'company', 'subject', 'comments'];
  
  for (const [fieldName, value] of Object.entries(fields)) {
    // Only check text fields (not phone, email, etc.)
    const shouldCheck = fieldsToCheck.some(f => fieldName.toLowerCase().includes(f));
    
    if (shouldCheck && typeof value === 'string' && value.length > 10) {
      // Skip if field is mostly numbers (like a phone in wrong field)
      const digitRatio = (value.match(/\d/g) || []).length / value.length;
      if (digitRatio > 0.5) continue; // Skip fields that are >50% digits
      
      const gibberishCheck = isGibberish(value);
      if (gibberishCheck.isGibberish) {
        return { 
          isSpam: true, 
          reason: `Random character pattern detected in ${fieldName}: ${gibberishCheck.reason}` 
        };
      }
    }
  }
  
  // Check for spam keywords
  const foundKeywords = SPAM_KEYWORDS.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  if (foundKeywords.length > 0) {
    return { 
      isSpam: true, 
      reason: `Spam keywords detected: ${foundKeywords.join(', ')}` 
    };
  }
  
  // Check for excessive URLs
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = allText.match(urlPattern) || [];
  if (urls.length > 2) {
    return { 
      isSpam: true, 
      reason: `Excessive URLs detected (${urls.length})` 
    };
  }
  
  // Check for excessive special characters
  const specialCharRatio = (allText.match(/[^a-z0-9\s]/gi) || []).length / allText.length;
  if (specialCharRatio > 0.3 && allText.length > 20) {
    return { 
      isSpam: true, 
      reason: `Excessive special characters (${(specialCharRatio * 100).toFixed(1)}%)` 
    };
  }
  
  // Check for repeated characters (spam pattern)
  if (/(.)\1{5,}/.test(allText)) {
    return { 
      isSpam: true, 
      reason: 'Repeated character pattern detected' 
    };
  }
  
  return { isSpam: false };
}

function isGibberish(text) {
  // Remove common patterns that might look random but aren't
  const cleanText = text.trim();
  
  // Skip if too short (15 chars minimum for gibberish check)
  if (cleanText.length < 15) {
    return { isGibberish: false };
  }
  
  // Skip if it's mostly spaces (likely a real sentence)
  const spaceRatio = (cleanText.match(/\s/g) || []).length / cleanText.length;
  if (spaceRatio > 0.15) {
    return { isGibberish: false }; // Real sentences have spaces
  }
  
  // Check 1: Excessive consonant sequences (like "VZaMVfznSuhvAotgUiqa")
  // Real words rarely have more than 3 consonants in a row
  const consonantPattern = /[bcdfghjklmnpqrstvwxyz]{4,}/gi;
  const consonantMatches = cleanText.match(consonantPattern) || [];
  if (consonantMatches.length > 0) {
    return { 
      isGibberish: true, 
      reason: `Excessive consonant sequences: ${consonantMatches.join(', ')}` 
    };
  }
  
  // Check 2: Mixed case randomness (like VZaMVfznSuhvAotgUiqa - alternating upper/lower)
  // Count case changes
  let caseChanges = 0;
  for (let i = 1; i < cleanText.length; i++) {
    const prevChar = cleanText[i-1];
    const currChar = cleanText[i];
    if (prevChar !== prevChar.toLowerCase() && currChar === currChar.toLowerCase()) {
      caseChanges++;
    } else if (prevChar === prevChar.toLowerCase() && currChar !== currChar.toLowerCase()) {
      caseChanges++;
    }
  }
  // If more than 40% of characters are case changes, it's likely random
  const caseChangeRatio = caseChanges / cleanText.length;
  if (caseChangeRatio > 0.4) {
    return { 
      isGibberish: true, 
      reason: `Excessive case changes (${(caseChangeRatio * 100).toFixed(0)}%)` 
    };
  }
  
  // Check 3: Vowel ratio - English text is typically 35-45% vowels
  const vowels = cleanText.match(/[aeiou]/gi) || [];
  const vowelRatio = vowels.length / cleanText.replace(/\s/g, '').length;
  
  // Too few vowels (<15%) or too many (>70%) suggests random text
  if (vowelRatio < 0.15 || vowelRatio > 0.70) {
    return { 
      isGibberish: true, 
      reason: `Abnormal vowel ratio (${(vowelRatio * 100).toFixed(0)}%)` 
    };
  }
  
  // Check 4: Character entropy (randomness)
  // Random strings have high entropy, real text has patterns
  const charFrequency = {};
  for (const char of cleanText.toLowerCase()) {
    if (char.match(/[a-z]/)) {
      charFrequency[char] = (charFrequency[char] || 0) + 1;
    }
  }
  
  const totalChars = Object.values(charFrequency).reduce((a, b) => a + b, 0);
  let entropy = 0;
  for (const count of Object.values(charFrequency)) {
    const probability = count / totalChars;
    entropy -= probability * Math.log2(probability);
  }
  
  // High entropy (>4.2) suggests random characters
  if (entropy > 4.2 && cleanText.length > 15) {
    return { 
      isGibberish: true, 
      reason: `High character randomness (entropy: ${entropy.toFixed(2)})` 
    };
  }
  
  // Check 5: No recognizable word patterns
  // Split by spaces and check if any "words" look real
  const words = cleanText.split(/\s+/);
  let gibberishWords = 0;
  
  for (const word of words) {
    if (word.length > 5) {
      // Check if word has any common bigrams (letter pairs)
      const commonBigrams = ['th', 'he', 'in', 'er', 'an', 'ed', 'nd', 'to', 'en', 'at', 'on', 'or'];
      const hasBigram = commonBigrams.some(bigram => word.toLowerCase().includes(bigram));
      
      if (!hasBigram) {
        gibberishWords++;
      }
    }
  }
  
  // If more than 70% of words have no common bigrams, likely gibberish
  if (words.length > 0 && (gibberishWords / words.length) > 0.7) {
    return { 
      isGibberish: true, 
      reason: `No recognizable word patterns (${gibberishWords}/${words.length} words are gibberish)` 
    };
  }
  
  return { isGibberish: false };
}

// ===========================================
// EXISTING FUNCTIONS (Keep as-is)
// ===========================================

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

function buildLeadTitleFromStrapi(formDefinition, submittedFields) {
  const formTitle = formDefinition.attributes?.title || formDefinition.title || 'Form Submission';
  const company = submittedFields.company || submittedFields.organization || 'New Lead';
  return `${formTitle}: ${company}`;
}

function buildDetailStringFromStrapi(formDefinition, submittedFields) {
  const details = [];
  const formFields = formDefinition.attributes?.field || formDefinition.field || [];
  
  const excludeFromDetails = ['source_channel', 'source_channel_id', 'labels'];
  
  const fieldMap = {};
  formFields.forEach(field => {
    fieldMap[field.name] = {
      label: field.label || formatFieldLabel(field.name),
      type: field.type || 'text',
      options: field.options || null
    };
  });
  
  Object.entries(submittedFields).forEach(([key, value]) => {
    if (!value || value === '' || excludeFromDetails.includes(key)) return;
    
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
  
  if (details.length > 0) {
    details.push(`--- Submission Details ---`);
    details.push(`Form: ${formDefinition.attributes?.title || formDefinition.title}`);
    details.push(`Date: ${new Date().toLocaleString()}`);
  }
  
  return details.join('\n\n');
}

function formatFieldForNote(fieldInfo, fieldName, value) {
  const { label, type } = fieldInfo;
  
  switch (type) {
    case 'textarea':
      return `${label}:\n${value}`;
    case 'checkbox':
      if (Array.isArray(value)) {
        return `${label}: ${value.join(', ')}`;
      }
      return `${label}: ${value}`;
    case 'date':
      try {
        const date = new Date(value);
        return `${label}: ${date.toLocaleDateString()}`;
      } catch {
        return `${label}: ${value}`;
      }
    case 'datetime-local':
      try {
        const datetime = new Date(value);
        return `${label}: ${datetime.toLocaleString()}`;
      } catch {
        return `${label}: ${value}`;
      }
    case 'hidden':
      return null;
    default:
      return `${label}: ${value}`;
  }
}

function buildPersonData(formDefinition, submittedFields, formId) {
  const personData = {};
  
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
  
  if (formId === 'subscribeForm') {
    personData.label = 95;
  }
  
  return personData;
}

async function buildLeadData(formDefinition, submittedFields, personId, leadTitle, formId) {
  const leadData = {
    title: leadTitle,
    person_id: personId,
    origin: "API"
  };
  
  if (submittedFields.source_channel) {
    const channelMapping = {
      'Newsletter': 79,
      'Contact Form': 82,
      'Campaign': 83,
    };
    const channelId = channelMapping[submittedFields.source_channel];
    if (channelId) {
      leadData.channel = channelId;
    }
  }
  
  if (submittedFields.source_channel_id) {
    leadData.channel_id = submittedFields.source_channel_id;
  }
  
  if (submittedFields.labels || formId) {
    const labelMappingByForm = {
      'subscribeForm': '4ccf7818-7bdc-4722-b550-c7583fa68168',
      'contactForm': '006b6abd-28c1-4eff-a062-52a5e9b0306c',
      'demoForm': '006b6abd-28c1-4eff-a062-52a5e9b0306c',
      'careerForm': '7d3083a0-da00-11ed-aabd-f7c91e0125d9',
    };
    
    const labelId = labelMappingByForm[formId];
    if (labelId) {
      leadData.label_ids = [labelId];
    }
  }
  
  if (submittedFields.company) {
    const orgId = await getOrCreateOrganization(submittedFields.company);
    if (orgId) leadData.organization_id = orgId;
  }
  
  return leadData;
}

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
    
    return createJson.success ? createJson.data.id : null;
  } catch (err) {
    console.error("Organization error:", err);
    return null;
  }
}

function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}