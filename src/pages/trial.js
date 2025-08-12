import React, { useState } from "react";
import Markdown from "../components/markdown";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

export const Head = ({ data }) => {
  const { headline, summary } = data.strapiTrial;
  return <Seo title={headline} description={summary} />;
};

export default function TrialPage({ data }) {
  const trial = data.strapiTrial;
  const headerImage = getImage(
    trial.heroImage.localFile.childImageSharp.gatsbyImageData
  );
  const { headline, summary } = trial;
  const bodyText = trial.body.data.body;

  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    if (form.get("company_website")) return; // honeypot

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      phone: form.get("phone"),
      metaID: form.get("MetaID"),
    };

    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch("/.netlify/functions/send-to-pipedrive", {
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
        setStatus({ loading: false, success: "Your trial request was submitted!", error: null });
      } else {
        throw new Error(json?.error || res.statusText);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({ loading: false, success: null, error: "Submission failed. Please try again." });
    }
  };

  return (
    <Layout>
      <div className="relative w-full">
        {headerImage && (
          <GatsbyImage
            image={headerImage}
            alt="Header Image"
            className="w-full h-[500px] object-cover"
          />
        )}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(circle, rgba(46, 50, 82, 0.8) 0%, rgba(0, 0, 0, 1) 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 text-white">
            <h1 className="text-3xl lg:text-5xl font-bold font-manrope">{headline}</h1>
            <p className="text-lg font-manrope mt-2">{summary}</p>
          </div>
        </div>
      </div>

      <div className="container px-6 mx-auto py-12 lg:flex lg:space-x-16">
        <form onSubmit={handleSubmit} className="lg:w-1/2 w-full space-y-4">
          {status.success && <div className="text-green-600">{status.success}</div>}
          {status.error && <div className="text-red-600">{status.error}</div>}

          <label className="block font-manrope font-semibold">
            Name (Required)
            <input
              name="name"
              required
              className="w-full border rounded px-4 py-2 mt-1"
            />
          </label>

          <label className="block font-manrope font-semibold">
            Email (Required)
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-4 py-2 mt-1"
            />
          </label>

          <label className="block font-manrope font-semibold">
            Company (Required)
            <input
              name="company"
              required
              className="w-full border rounded px-4 py-2 mt-1"
            />
          </label>

          <label className="block font-manrope font-semibold">
            Phone (Optional)
            <input
              name="phone"
              type="tel"
              className="w-full border rounded px-4 py-2 mt-1"
            />
          </label>

          <label className="block font-manrope font-semibold">
            Meta ID (Required)
            <input
              name="MetaID"
              type="text"
              required
              className="w-full border rounded px-4 py-2 mt-1"
            />
          </label>

          <input type="text" name="company_website" hidden />

          <button
            type="submit"
            disabled={status.loading}
            className="bg-brandblue font-manrope text-white px-6 py-2 rounded hover:bg-brandorange disabled:opacity-50"
          >
            {status.loading ? "Submitting..." : "Sign up for trial"}
          </button>
        </form>

        <div className="mt-8 lg:mt-0 lg:w-1/2 w-full prose prose-lg font-manrope max-w-none">
          <Markdown>{bodyText}</Markdown>
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query trialQuery {
    strapiTrial {
      body {
        data {
          body
        }
      }
      heroImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      headline
      summary
    }
  }
`;
