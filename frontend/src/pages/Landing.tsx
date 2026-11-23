import { Link } from 'react-router';
import { useState } from 'react';
import { Building2, FileCheck2, Home, ReceiptText, Users } from 'lucide-react';
import './Landing.css';

const examples = [
  { unit: 'Room 1A', tenant: 'Maria Santos', rent: 6500, electricity: 1000, water: 300, people: 2, consumption: 80 },
  { unit: 'Room 2B', tenant: 'Daniel Reyes', rent: 8000, electricity: 1500, water: 450, people: 3, consumption: 120 },
];
const pesos = (amount: number) => `₱${amount.toLocaleString('en-PH')}`;

export default function Landing() {
  const [selected, setSelected] = useState(0);
  const bill = examples[selected];

  return (
    <div className="rental-landing">
      <a href="#main-content" className="rental-skip">Skip to content</a>
      <header className="rental-container rental-header">
        <Link to="/" className="rental-brand" aria-label="Rental Manager home"><Building2 aria-hidden="true" /><span>Rental Manager</span></Link>
        <nav aria-label="Main navigation"><Link to="/login" className="btn btn-ghost">Sign in</Link><Link to="/register" className="btn btn-primary">Sign up</Link></nav>
      </header>
      <main id="main-content" className="rental-container">
        <section className="rental-hero" aria-labelledby="landing-title">
          <div className="rental-intro">
            <h1 id="landing-title">Monthly bills,<br /><span>without the busywork.</span></h1>
            <p>Keep your units, tenants, and utility charges in one place. Prepare the month’s bills, check the details, and get back to your day.</p>
            <div className="rental-actions"><Link to="/register" className="btn btn-primary">Start your rental workspace</Link><a href="#bill-preview" className="btn btn-outline">See how it looks</a></div>
            <p className="rental-intro-note">Made for landlords. Ready on desktop and mobile.</p>
          </div>
          <section id="bill-preview" className="rental-preview" aria-label="Sample monthly bill">
            <div className="rental-preview-top"><div><ReceiptText aria-hidden="true" /><h2>A clear bill, every month.</h2></div><span>Sample workspace</span></div>
            <div className="rental-unit-tabs" aria-label="Choose a sample unit">
              {examples.map((example, index) => <button key={example.unit} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}><Home size={16} aria-hidden="true" />{example.unit}</button>)}
            </div>
            <div className="rental-bill" aria-live="polite" aria-atomic="true">
              <div className="rental-bill-heading"><div><h3>{bill.unit}</h3><p>{bill.tenant} · {bill.people} people</p></div><span className="rental-draft">Draft</span></div>
              <div className="rental-bill-month">November 2026</div>
              <dl className="rental-charges">
                <div><dt>Monthly rent</dt><dd>{pesos(bill.rent)}</dd></div>
                <div><dt>Electricity <small>{bill.consumption} kWh × ₱12.50</small></dt><dd>{pesos(bill.electricity)}</dd></div>
                <div><dt>Water <small>{bill.people} people × ₱150</small></dt><dd>{pesos(bill.water)}</dd></div>
                <div className="rental-total"><dt>Total amount</dt><dd>{pesos(bill.rent + bill.electricity + bill.water)}</dd></div>
              </dl>
              <p className="rental-bill-note"><FileCheck2 size={16} aria-hidden="true" />Review the details before you confirm.</p>
            </div>
          </section>
        </section>
        <section className="rental-features" aria-label="Manage your monthly rentals">
          <article><Home aria-hidden="true" /><h2>A home for every unit.</h2><p>Keep rent, tenant details, and billing history together. See which units are occupied and which are ready for someone new.</p></article>
          <article><ReceiptText aria-hidden="true" /><h2>Less time doing the sums.</h2><p>Add the meter reading. Electricity, water, and rent come together in a bill you can review before confirming.</p></article>
          <article><Users aria-hidden="true" /><h2>Something clear to share.</h2><p>Turn a bill into a downloadable image, with the charges laid out clearly for your tenant.</p></article>
        </section>
        <section className="rental-closing" aria-labelledby="closing-title"><div><h2 id="closing-title">Keep the next billing day simple.</h2><p>Your units and bills, ready when you are.</p></div><Link to="/register" className="btn btn-primary">Create an account</Link></section>
      </main>
      <footer className="rental-container rental-footer"><span>Rental Manager</span><p>A little less paperwork. A little more peace of mind.</p><Link to="/login">Sign in to your workspace</Link></footer>
    </div>
  );
}
