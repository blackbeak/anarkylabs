import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

export default function ShopIndex({ data }) {
  const versions = data.allStrapiVersion.nodes;

  return (
    <Layout>
      <Seo title="Shop" />
      <div className="bg-black py-16">
      <div className="container mx-auto px-6 text-left">
        <h1 className="text-4xl font-bold text-white font-manrope">Online Shop</h1>
        <p className="text-lg text-brandorange mt-2 font-manrope">
          Select kits depending on your preference or requirements or just simply licenses if you have your own compatible hardware.
        </p>
      </div>
    </div>
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        {versions.map((version, index) => {
          const productImage = getImage(version.productPicture.localFile.childImageSharp.gatsbyImageData);
          return (
            <Link
              to={`/product/${version.versionName}`}
              key={version.id}
              className="w-full border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 group block hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-3">
                  <GatsbyImage image={productImage} alt={version.headline} className="rounded-lg" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold font-manrope group-hover:text-brandorange transition duration-300">
                    {version.headline}
                  </h2>
                  <p className="text-lg text-gray-700 mt-2 font-manrope">{version.versionDescription}</p>
                  <p className="text-xl text-brandorange font-semibold mt-4 font-manrope">€{version.annualPrice}</p>
                  <span className="text-sm font-manrope text-gray-700 group-hover:text-brandorange transition duration-300 mt-2">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
    </Layout>
  );
}

export const query = graphql`
  query {
    allStrapiVersion(filter: { publish: { eq: true } }, sort: { order: ASC }) {
      nodes {
        id
        headline
        versionDescription
        versionName
        annualPrice
        productPicture {
          localFile {
            childImageSharp {
              gatsbyImageData(width: 300)
            }
          }
        }
      }
    }
  }
`;