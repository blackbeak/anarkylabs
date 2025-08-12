import React from "react"
import { Link } from "gatsby"
import { StaticImage }  from "gatsby-plugin-image"

// import ConsentManager from "../components/consent"

const Footer = () => {
const currentYear = new Date().getFullYear()

return (
  <footer className="py-6 bg-black text-gray-50 font-manrope">
	<div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-6 divide-opacity-30">
		<div className="grid grid-cols-12">
			<div className="pb-6 col-span-full md:pb-0 md:col-span-6">
				<div className="flex justify-center space-x-3 md:justify-start">
					<div className="flex items-center justify-center">
          <Link to="/">
                <StaticImage src="../images/whiteA.png" className="w-12" alt="From Anarky Labs with love" />
          </Link>
					</div>
				</div>
			</div>
			<div className="col-span-6 text-center md:text-left md:col-span-2">
				<p className="pb-1 text-lg font-medium text-brandorange">Use Cases</p>
				<ul className="text-white">
					<li>
					<Link to="/case/law-enforcement" className="hover:text-brandorange">Law Enforcement</Link>
					</li>
					<li>
                    <Link to="/case/fire-departments" className="hover:text-brandorange">Fire Departments</Link>
                    </li>
					<li>
         			 <Link to="/case/drone-pilot-academies" className="hover:text-brandorange">Drone Academies</Link>
					</li>
					
				</ul>
			</div>
			<div className="col-span-6 text-center md:text-left md:col-span-2">
				<p className="pb-1 text-lg font-medium text-brandorange">About</p>
				<ul>
				<li>
          			<Link to="/features" className="hover:text-brandorange">Features</Link>
				</li>
				<li>
          			<Link to="/shop-index" className="hover:text-brandorange">Shop</Link>
				</li>
                <li>
          			<Link to="/faq" className="hover:text-brandorange">FAQs</Link>
				</li>
				<li>
          			<Link to="/blog" className="hover:text-brandorange">News</Link>
				</li>
				<li>
          			<Link to="/about" className="hover:text-brandorange">About</Link>
				</li>
				<li>
          			<Link to="/contact" className="hover:text-brandorange">Contact</Link>
				</li>
				</ul>
			</div>
			<div className="col-span-6 text-center md:text-left md:col-span-2">
				<p className="pb-1 text-lg font-medium text-brandorange">Legal</p>
				<ul>
				<li><Link to="/legal/terms" className="hover:text-brandorange">
					Terms and conditions
				</Link>
				</li>
				<li><Link to="/legal/license" className="hover:text-brandorange">
					License agreement
				</Link>
				</li>
				<li><Link to="/legal/privacy" className="hover:text-brandorange">
					Privacy policy
				</Link>
				</li>
				<li><Link to="/legal/cookies" className="hover:text-brandorange">
					Cookie policy
				</Link>
				</li>
			
				</ul>
			</div>
		</div>
		<div className="grid justify-center pt-6 lg:justify-between">
			{/* Copyright Notice & Patents (Aligned Left) */}
			<div className="flex flex-col self-center text-sm text-center md:text-left md:items-start">
				<span>
				Copyright &copy; {currentYear} Anarky Labs Oy. All rights reserved. Company ID: FI31228403. See also 
				<a href="https://airhud.io/" className="underline hover:text-brandorange"> AirHUD.io</a>
				</span>
			</div>
			<div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
				<a href="mailto:info@airskill.io" title="Email" className="flex items-center justify-center w-10 h-10 rounded-full bg-brandorange text-gray-900">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
					</svg>
				</a>
				
				<a href="https://www.linkedin.com/company/airskill-simulator" title="LinkedIn" className="flex items-center justify-center w-10 h-10 rounded-full bg-brandorange text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
				</a>
				<a href="https://facebook.com/airhud" title="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-brandorange text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd"/>
                </svg>

          </a>
                <a href="https://www.instagram.com/airhud_by_anarky_labs/" title="Instagram" className="flex items-center justify-center w-10 h-10 rounded-full bg-brandorange text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd"/>
                </svg>
				</a>
                <a href="https://www.youtube.com/@airhud" title="YouTube" className="flex items-center justify-center w-10 h-10 rounded-full bg-brandorange text-gray-900">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clipRule="evenodd"/>
                </svg>
                </a>
			</div>
		</div>
	</div>

</footer>

  )
}

export default Footer





