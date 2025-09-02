import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";

const ApiForm = ({ 
  formId,
  onSuccess = null,
  onError = null,
  className = "space-y-4",
  layout = "vertical" // Add layout prop: "vertical" or "horizontal"
}) => {
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  // Fetch all forms from Strapi
  const data = useStaticQuery(graphql`
    query AllFormsQuery {
      allStrapiForm {
        nodes {
          title
          buttonText
          successMessage
          errorMessage
          endpoint
          field {
            name
            label
            placeholder
            type
            required
            order
            value
          }
        }
      }
    }
  `);

  // Find the form by title (formId)
  const formData = data.allStrapiForm.nodes.find(form => form.title === formId);

  // Handle case where form is not found
  if (!formData) {
    return (
      <div className="text-red-600 font-manrope bg-red-50 p-3 rounded">
        Error: Form "{formId}" not found. Please check your formId matches a Strapi form title.
      </div>
    );
  }

  // Extract form configuration from Strapi (with fallbacks only if Strapi fields are empty)
  const {
    buttonText,
    successMessage,
    errorMessage,
    endpoint,
    field: fields = []
  } = formData;

  // Strapi values take precedence, fallbacks only used if Strapi fields are empty/null
  const config = {
    buttonText: buttonText || "Submit",
    successMessage: successMessage || "Form submitted successfully!",
    errorMessage: errorMessage || "Submission failed. Please try again.",
    endpoint: endpoint || "/.netlify/functions/send-to-pipedrive"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    
    // Honeypot check
    if (form.get("company_website")) return;

    // Build payload dynamically - INCLUDE formId
    const payload = {
      formId: formId  // ADD THE FORM ID TO THE PAYLOAD
    };
    
    fields.forEach(field => {
      const value = form.get(field.name);
      if (value !== null && value !== undefined && value !== '') {
        payload[field.name] = value;
      }
    });

    // Debug log to see what's being sent
    console.log('Payload being sent:', payload);

    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Read raw response text and attempt JSON parse
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        console.warn("Invalid JSON response:", text);
      }

      if (res.ok) {
        setStatus({ loading: false, success: config.successMessage, error: null });
        if (onSuccess) onSuccess(payload, json);
      } else {
        throw new Error(json?.error || res.statusText);
      }
    } catch (err) {
      console.error("Submission error:", err);
      const finalErrorMessage = err.message || config.errorMessage;
      setStatus({ loading: false, success: null, error: finalErrorMessage });
      if (onError) onError(err, payload);
    }
  };

  // Sort fields by order
  const sortedFields = fields.sort((a, b) => (a.order || 0) - (b.order || 0));

  // Render different field types with layout-aware styling
  const renderField = (field, isHorizontal = false) => {
    const baseInputClasses = isHorizontal 
      ? "px-3 py-2 border border-gray-300 focus:outline-none focus:border-brandorange text-sm font-manrope"
      : "w-full border rounded px-4 py-2 mt-1";

    const commonProps = {
      name: field.name,
      required: field.required || false,
      placeholder: field.placeholder || "",
      className: baseInputClasses
    };

    // For horizontal email fields, add specific styling
    if (isHorizontal && field.type === 'email') {
      commonProps.className = "px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-brandorange text-sm font-manrope w-48 text-white";
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'password':
      case 'number':
      case 'url':
      case 'date':
      case 'datetime-local':
      case 'time':
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Choose an option...</option>
            {field.options?.choices?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.choices?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  required={field.required}
                  className="form-radio"
                />
                <span>{option.label || option.value}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.choices?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`${field.name}[]`}
                  value={option.value}
                  className="form-checkbox"
                />
                <span>{option.label || option.value}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            className="w-full border rounded px-4 py-2 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        );

      case 'hidden':
        return (
          <input
            type="hidden"
            name={field.name}
            value={field.value || ""}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type="text"
          />
        );
    }
  };

  // Determine form layout classes
  const isHorizontal = layout === "horizontal";
  const formClasses = isHorizontal ? "flex items-end gap-0" : "space-y-4";
  const buttonClasses = isHorizontal 
    ? "px-4 py-2 bg-white text-black hover:bg-brandorange hover:text-white rounded-r-lg transition-colors text-sm font-manrope font-medium"
    : "bg-brandblue font-manrope text-white px-6 py-2 rounded hover:bg-brandorange disabled:opacity-50 transition-colors";

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={formClasses}>
        {/* Messages - only show above form, not inline for horizontal */}
        {!isHorizontal && status.success && (
          <div className="text-green-600 font-manrope bg-green-50 p-3 rounded">
            {status.success}
          </div>
        )}
        {!isHorizontal && status.error && (
          <div className="text-red-600 font-manrope bg-red-50 p-3 rounded">
            {status.error}
          </div>
        )}

        {/* Fields */}
        {sortedFields.map((field, index) => (
          <div key={index}>
            {field.type !== 'hidden' && (
              <>
                {isHorizontal ? (
                  // Horizontal layout - no labels, direct field rendering
                  renderField(field, true)
                ) : (
                  // Vertical layout - with labels
                  <label className="block font-manrope font-semibold">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {renderField(field)}
                  </label>
                )}
              </>
            )}
            {field.type === 'hidden' && renderField(field)}
          </div>
        ))}

        {/* Honeypot field - hidden from users */}
        <input type="text" name="company_website" hidden />

        <button
          type="submit"
          disabled={status.loading}
          className={buttonClasses}
        >
          {status.loading ? "Submitting..." : config.buttonText}
        </button>
      </form>

      {/* Messages for horizontal layout - show below form */}
      {isHorizontal && status.success && (
        <div className="text-green-300 font-manrope bg-green-900/50 border border-green-700/50 p-3 rounded mt-4">
          {status.success}
        </div>
      )}
      {isHorizontal && status.error && (
        <div className="text-red-300 font-manrope bg-red-900/50 border border-red-700/50 p-3 rounded mt-4">
          {status.error}
        </div>
      )}
    </div>
  );
};

export default ApiForm;