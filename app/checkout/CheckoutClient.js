// app/checkout/CheckoutClient.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../ThemeProvider';

const getCatIcon = (cat) =>
  ({ Laptops: '💻', Mobiles: '📱', Audio: '🎧', Tablets: '📟', Gaming: '🎮', 'Smart Home': '🏠', Accessories: '🔌' }[cat] || '📦');

const STEPS = [
  { id: 1, label: 'Shipping', icon: '📦' },
  { id: 2, label: 'Payment', icon: '💳' },
  { id: 3, label: 'Confirm', icon: '✓' },
];

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: done ? '#10B981' : active ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : 'var(--bg-input)',
                border: `2px solid ${done ? '#10B981' : active ? '#6366F1' : 'var(--border-card)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.3s',
                boxShadow: active ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
              }}>
                {done ? '✓' : step.icon}
              </div>
              <span style={{ color: active ? 'var(--text-primary)' : done ? '#10B981' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, fontFamily: 'sans-serif' }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 'clamp(30px, 10vw, 80px)', height: 2, background: done ? '#10B981' : 'var(--border-card)', margin: '0 8px 20px', transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InputField({ label, id, type = 'text', value, onChange, placeholder, required, error, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5, pointerEvents: 'none' }}>{icon}</span>}
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: focused ? 'var(--bg-hover)' : 'var(--bg-input)',
            border: `1px solid ${error ? '#EF4444' : focused ? 'rgba(99,102,241,0.5)' : 'var(--border-subtle)'}`,
            borderRadius: 12,
            padding: `13px 16px 13px ${icon ? '44px' : '16px'}`,
            color: 'var(--text-primary)', fontSize: 14,
            fontFamily: 'sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
          }}
        />
      </div>
      {error && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 2 }}>{error}</p>}
    </div>
  );
}

export default function CheckoutClient() {
  const [cart, setCart] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { theme } = useTheme();

  const [shipping, setShipping] = useState({ address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' });
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '' });

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch { console.error('Failed to fetch cart'); }
    finally { setLoading(false); }
  };

  const validateShipping = () => {
    const e = {};
    if (!shipping.address.trim()) e.address = 'Address is required';
    if (!shipping.city.trim()) e.city = 'City is required';
    if (!shipping.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (!shipping.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (payment.method !== 'card') return true;
    const e = {};
    if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!payment.cardName.trim()) e.cardName = 'Name is required';
    if (!payment.expiry.trim()) e.expiry = 'Expiry is required';
    if (payment.cvv.length < 3) e.cvv = 'Invalid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) setStep(2);
    if (step === 2 && validatePayment()) setStep(3);
  };

  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleSubmit = async () => {
    setPlacing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...shipping, paymentMethod: payment.method }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Checkout failed. Please try again.');
        setPlacing(false);
        return;
      }

      if (data.paymentRequired && data.rzpOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert('Razorpay SDK failed to load. Are you online?');
          setPlacing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set in .env.local
          amount: data.amount,
          currency: data.currency,
          name: 'TechStore',
          description: 'Order Payment',
          order_id: data.rzpOrderId,
          handler: async function (response) {
            try {
              const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  dbOrderId: data.order._id
                })
              });
              if (verifyRes.ok) {
                router.push('/dashboard/user?order=success');
              } else {
                alert('Payment verification failed.');
                setPlacing(false);
              }
            } catch (err) {
              alert('Verification error.');
              setPlacing(false);
            }
          },
          prefill: {
            name: payment.cardName || 'Guest User',
            email: 'user@example.com',
            contact: shipping.phone
          },
          theme: {
            color: '#6366F1'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`Payment Failed: ${response.error.description}`);
          setPlacing(false);
        });
        rzp.open();
      } else {
        router.push('/dashboard/user?order=success');
      }
    } catch { 
      alert('An error occurred.'); 
      setPlacing(false);
    }
  };

  const fmtCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (val) => val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/').slice(0, 5);

  const subtotal = cart?.items?.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0) || 0;
  const itemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  if (loading) return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading checkout…</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder{color:var(--text-faint);}
        input:focus{outline:none;}
        select:focus{outline:none;}
        .checkout-select{
          background:var(--bg-input);
          border:1px solid var(--border-subtle);
          border-radius:12px;
          padding:13px 16px;
          color:var(--text-primary);
          font-size:14px;
          font-family: sans-serif;
          cursor:pointer;
          width:100%;
          transition:background 0.2s, border-color 0.2s;
        }
        .checkout-select:focus{
          border-color:rgba(99,102,241,0.5);
          box-shadow:0 0 0 3px rgba(99,102,241,0.1);
        }
        .checkout-select option{
          background:var(--bg-card);
          color:var(--text-primary);
        }
        .checkout-delivery-label{
          display:flex; align-items:center; gap:14px;
          padding:14px 16px;
          background:var(--bg-input);
          border:1px solid var(--border-subtle);
          border-radius:12px; cursor:pointer;
          transition:border-color 0.15s, background 0.15s;
        }
        .checkout-delivery-label:hover{
          background:var(--bg-hover);
          border-color:var(--border-card);
        }
        .checkout-pay-btn{
          background:var(--bg-input);
          border:1px solid var(--border-subtle);
          color:var(--text-muted);
          border-radius:12px; padding:12px 8px;
          display:flex; flex-direction:column; align-items:center; gap:4px;
          cursor:pointer; font-family: sans-serif; font-size:11px; font-weight:700;
          transition:all 0.15s;
        }
        .checkout-pay-btn.active{
          background:rgba(99,102,241,0.15);
          border-color:rgba(99,102,241,0.5);
          color:#818CF8;
          box-shadow:0 0 12px rgba(99,102,241,0.2);
        }
        .checkout-summary-item{
          background:var(--bg-input);
          border-radius:10px;
        }
        .checkout-review-box{
          background:var(--bg-input);
          border:1px solid var(--border-subtle);
          border-radius:14px;
          padding:18px 20px;
          margin-bottom:14px;
        }
        .checkout-back-btn{
          background:var(--bg-input);
          border:1px solid var(--border-subtle);
          color:var(--text-secondary);
          border-radius:14px; padding:14px 24px;
          font-size:14px; font-weight:700; cursor:pointer; font-family: sans-serif;
          transition:background 0.15s;
        }
        .checkout-back-btn:hover{ background:var(--bg-hover); }
      `}</style>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '0 0 80px' }}>

        {/* Header */}
        <div className="rsp-section-pad" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-card)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-faint)', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 600 }}>
                <Link href="/" style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>Home</Link>
                <span style={{ margin: '0 6px' }}>›</span>
                <Link href="/cart" style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>Cart</Link>
                <span style={{ margin: '0 6px' }}>›</span>
                <span style={{ color: 'var(--text-secondary)' }}>Checkout</span>
              </p>
              <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 900, fontFamily: 'sans-serif', marginTop: 4 }}>Checkout</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 12, fontWeight: 600, fontFamily: 'sans-serif' }}>
              <span>🔒</span> SSL Secured
            </div>
          </div>
        </div>

        <div className="rsp-page-pad" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <StepIndicator current={step} />

          <div className="rsp-grid-sidebar">

            {/* Left: Form */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 22, overflow: 'hidden', animation: 'fadeIn 0.4s ease', boxShadow: 'var(--shadow-card)' }}>

              {/* ── STEP 1: Shipping ─────────────────────────────────────────── */}
              {step === 1 && (
                <div className="rsp-page-pad">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                    <div>
                      <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 800, fontFamily: 'sans-serif' }}>Shipping Information</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <InputField label="Full Address" id="address" icon="🏠" value={shipping.address}
                      onChange={e => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="123 Main Street, Apt 4B" required error={errors.address} />

                    <div className="rsp-grid-2">
                      <InputField label="City" id="city" icon="🏙" value={shipping.city}
                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        placeholder="Mumbai" required error={errors.city} />
                      <InputField label="State / Province" id="state" value={shipping.state}
                        onChange={e => setShipping({ ...shipping, state: e.target.value })}
                        placeholder="Maharashtra" />
                    </div>

                    <div className="rsp-grid-2">
                      <InputField label="Postal Code" id="postalCode" icon="📮" value={shipping.postalCode}
                        onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                        placeholder="400001" required error={errors.postalCode} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>Country</label>
                        <select
                          className="checkout-select"
                          value={shipping.country}
                          onChange={e => setShipping({ ...shipping, country: e.target.value })}
                        >
                          <option value="India">🇮🇳 India</option>
                          <option value="US">🇺🇸 United States</option>
                          <option value="UK">🇬🇧 United Kingdom</option>
                          <option value="CA">🇨🇦 Canada</option>
                          <option value="AU">🇦🇺 Australia</option>
                        </select>
                      </div>
                    </div>

                    <InputField label="Phone Number" id="phone" type="tel" icon="📱" value={shipping.phone}
                      onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+91 98765 43210" required error={errors.phone} />

                    {/* Delivery option */}
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif', marginBottom: 10 }}>Delivery Method</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { id: 'standard', label: 'Standard Delivery', sub: '3-5 business days', price: 'Free', icon: '📦' },
                          { id: 'express', label: 'Express Delivery', sub: 'Next business day', price: '₹299', icon: '🚀' },
                        ].map(opt => (
                          <label key={opt.id} className="checkout-delivery-label">
                            <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} style={{ accentColor: '#6366F1', width: 16, height: 16 }} />
                            <span style={{ fontSize: 20 }}>{opt.icon}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif' }}>{opt.label}</p>
                              <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>{opt.sub}</p>
                            </div>
                            <span style={{ color: opt.price === 'Free' ? '#10B981' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif' }}>{opt.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Payment ──────────────────────────────────────────── */}
              {step === 2 && (
                <div className="rsp-page-pad" style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💳</div>
                    <div>
                      <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 800, fontFamily: 'sans-serif' }}>Payment Method</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Your payment info is fully encrypted</p>
                    </div>
                  </div>

                  {/* Method selector */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px,1fr))', gap: 8, marginBottom: 24 }}>
                    {[
                      { id: 'card', icon: '💳', label: 'Card' },
                      { id: 'upi', icon: '📲', label: 'UPI' },
                      { id: 'paypal', icon: '🅿', label: 'PayPal' },
                      { id: 'cod', icon: '💵', label: 'COD' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setPayment({ ...payment, method: m.id }); setErrors({}); }}
                        className={`checkout-pay-btn${payment.method === m.id ? ' active' : ''}`}
                      >
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {payment.method === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeIn 0.3s ease' }}>
                      <InputField label="Card Number" id="cardNumber" icon="💳"
                        value={payment.cardNumber}
                        onChange={e => setPayment({ ...payment, cardNumber: fmtCard(e.target.value) })}
                        placeholder="1234 5678 9012 3456" error={errors.cardNumber} />
                      <InputField label="Cardholder Name" id="cardName" icon="👤"
                        value={payment.cardName}
                        onChange={e => setPayment({ ...payment, cardName: e.target.value })}
                        placeholder="John Doe" error={errors.cardName} />
                      <div className="rsp-grid-2">
                        <InputField label="Expiry Date" id="expiry"
                          value={payment.expiry}
                          onChange={e => setPayment({ ...payment, expiry: fmtExp(e.target.value) })}
                          placeholder="MM/YY" error={errors.expiry} />
                        <InputField label="CVV" id="cvv" type="password" icon="🔑"
                          value={payment.cvv}
                          onChange={e => setPayment({ ...payment, cvv: e.target.value.slice(0, 4) })}
                          placeholder="•••" error={errors.cvv} />
                      </div>
                      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>🔒</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Your card details are encrypted with 256-bit SSL. We never store card numbers.</span>
                      </div>
                    </div>
                  )}

                  {payment.method === 'upi' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                      <InputField label="UPI ID" id="upi" icon="📲"
                        value={payment.cardName}
                        onChange={e => setPayment({ ...payment, cardName: e.target.value })}
                        placeholder="yourname@upi" />
                      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8 }}>You will receive a payment request on your UPI app after placing the order.</p>
                    </div>
                  )}

                  {payment.method === 'paypal' && (
                    <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(0,48,135,0.08)', border: '1px solid rgba(0,48,135,0.18)', borderRadius: 14, animation: 'fadeIn 0.3s ease' }}>
                      <span style={{ fontSize: 48 }}>🅿</span>
                      <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 13 }}>You'll be redirected to PayPal to complete your payment securely.</p>
                    </div>
                  )}

                  {payment.method === 'cod' && (
                    <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, animation: 'fadeIn 0.3s ease' }}>
                      <span style={{ fontSize: 48 }}>💵</span>
                      <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 13 }}>Pay with cash when your order is delivered. Additional ₹49 COD fee applies.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: Confirm ──────────────────────────────────────────── */}
              {step === 3 && (
                <div className="rsp-page-pad" style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</div>
                    <div>
                      <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 800, fontFamily: 'sans-serif' }}>Review & Confirm</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Double-check everything before placing your order</p>
                    </div>
                  </div>

                  {/* Shipping summary */}
                  <div className="checkout-review-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>Shipping to</p>
                      <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>Edit</button>
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontSize: 14 }}>{shipping.address}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{[shipping.city, shipping.state, shipping.postalCode, shipping.country].filter(Boolean).join(', ')}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{shipping.phone}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="checkout-review-box" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>Payment</p>
                      <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>Edit</button>
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {{ card: '💳', upi: '📲', paypal: '🅿', cod: '💵' }[payment.method]}
                      {payment.method === 'card' && payment.cardNumber ? ` •••• ${payment.cardNumber.slice(-4)}` : ` ${payment.method.toUpperCase()}`}
                    </p>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif', marginBottom: 4 }}>Items ({itemCount})</p>
                    {cart?.items?.map(item => (
                      <div key={item.product?._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 10 }}>
                        <span style={{ fontSize: 22 }}>{getCatIcon(item.product?.category)}</span>
                        <p style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 13, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.product?.name || item.product?.title}
                        </p>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>×{item.quantity}</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif' }}>
                          ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ padding: '0 16px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="checkout-back-btn">← Back</button>
                )}

                {step < 3 ? (
                  <button onClick={handleNextStep} style={{
                    flex: 1,
                    background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                    color: '#fff', border: 'none', borderRadius: 14,
                    padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'sans-serif',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                    transition: 'opacity 0.2s, transform 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                  >
                    {step === 1 ? 'Continue to Payment →' : 'Review Order →'}
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={placing || !cart?.items?.length} style={{
                    flex: 1,
                    background: placing ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg,#059669,#10B981)',
                    color: placing ? '#10B981' : '#fff',
                    border: placing ? '1px solid rgba(16,185,129,0.4)' : 'none',
                    borderRadius: 14, padding: '14px',
                    fontSize: 14, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer',
                    fontFamily: 'sans-serif',
                    boxShadow: placing ? 'none' : '0 8px 24px rgba(16,185,129,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.2s',
                  }}>
                    {placing ? (
                      <>
                        <span style={{ width: 16, height: 16, border: '2px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Placing Order…
                      </>
                    ) : '🎉 Place Order'}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Order summary */}
            <div style={{ position: 'sticky', top: 88, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 22, overflow: 'hidden', animation: 'fadeIn 0.5s ease', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-card)' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 800, fontFamily: 'sans-serif' }}>
                  Order Summary · {itemCount} item{itemCount !== 1 ? 's' : ''}
                </h2>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {cart?.items?.map(item => (
                    <div key={item.product?._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                        {getCatIcon(item.product?.category)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {item.product?.name || item.product?.title}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>Qty: {item.quantity}</p>
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, fontFamily: 'sans-serif', flexShrink: 0 }}>
                        ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Subtotal</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Shipping</span>
                    <span style={{ color: '#10B981', fontSize: 13, fontWeight: 600 }}>Free</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-card)', paddingTop: 14 }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 800, fontFamily: 'sans-serif' }}>Total</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 900, fontFamily: 'sans-serif' }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border-card)', paddingTop: 18 }}>
                  {[['🔒', 'Encrypted & secure'], ['↩️', '30-day easy returns'], ['🚀', 'Fast delivery'], ['🛡️', 'Buyer protection']].map(([icon, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ color: 'var(--text-faint)', fontSize: 11, fontWeight: 600, fontFamily: 'sans-serif' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}