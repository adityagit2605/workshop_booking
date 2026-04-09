import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/client';
import SEO from '../components/SEO';
import '../pages/Login.css';
import './Register.css';

const TITLE_CHOICES = [
  { value: 'Professor', label: 'Prof.' },
  { value: 'Doctor', label: 'Dr.' },
  { value: 'Shriman', label: 'Shri' },
  { value: 'Shrimati', label: 'Smt' },
  { value: 'Kumari', label: 'Ku' },
  { value: 'Mr', label: 'Mr.' },
  { value: 'Mrs', label: 'Mrs.' },
  { value: 'Miss', label: 'Ms.' },
];

const DEPARTMENT_CHOICES = [
  { value: 'computer engineering', label: 'Computer Science' },
  { value: 'information technology', label: 'Information Technology' },
  { value: 'civil engineering', label: 'Civil Engineering' },
  { value: 'electrical engineering', label: 'Electrical Engineering' },
  { value: 'mechanical engineering', label: 'Mechanical Engineering' },
  { value: 'chemical engineering', label: 'Chemical Engineering' },
  { value: 'aerospace engineering', label: 'Aerospace Engineering' },
  { value: 'biosciences and bioengineering', label: 'Biosciences and BioEngineering' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'energy science and engineering', label: 'Energy Science and Engineering' },
];

const STATE_CHOICES = [
  { value: '', label: '---------' },
  { value: 'IN-AP', label: 'Andhra Pradesh' },
  { value: 'IN-AR', label: 'Arunachal Pradesh' },
  { value: 'IN-AS', label: 'Assam' },
  { value: 'IN-BR', label: 'Bihar' },
  { value: 'IN-CT', label: 'Chhattisgarh' },
  { value: 'IN-GA', label: 'Goa' },
  { value: 'IN-GJ', label: 'Gujarat' },
  { value: 'IN-HR', label: 'Haryana' },
  { value: 'IN-HP', label: 'Himachal Pradesh' },
  { value: 'IN-JK', label: 'Jammu and Kashmir' },
  { value: 'IN-JH', label: 'Jharkhand' },
  { value: 'IN-KA', label: 'Karnataka' },
  { value: 'IN-KL', label: 'Kerala' },
  { value: 'IN-MP', label: 'Madhya Pradesh' },
  { value: 'IN-MH', label: 'Maharashtra' },
  { value: 'IN-MN', label: 'Manipur' },
  { value: 'IN-ML', label: 'Meghalaya' },
  { value: 'IN-MZ', label: 'Mizoram' },
  { value: 'IN-NL', label: 'Nagaland' },
  { value: 'IN-OR', label: 'Odisha' },
  { value: 'IN-PB', label: 'Punjab' },
  { value: 'IN-RJ', label: 'Rajasthan' },
  { value: 'IN-SK', label: 'Sikkim' },
  { value: 'IN-TN', label: 'Tamil Nadu' },
  { value: 'IN-TG', label: 'Telangana' },
  { value: 'IN-TR', label: 'Tripura' },
  { value: 'IN-UT', label: 'Uttarakhand' },
  { value: 'IN-UP', label: 'Uttar Pradesh' },
  { value: 'IN-WB', label: 'West Bengal' },
  { value: 'IN-AN', label: 'Andaman and Nicobar Islands' },
  { value: 'IN-CH', label: 'Chandigarh' },
  { value: 'IN-DN', label: 'Dadra and Nagar Haveli' },
  { value: 'IN-DD', label: 'Daman and Diu' },
  { value: 'IN-DL', label: 'Delhi' },
  { value: 'IN-LD', label: 'Lakshadweep' },
  { value: 'IN-PY', label: 'Puducherry' },
];

const SOURCE_CHOICES = [
  { value: 'FOSSEE website', label: 'FOSSEE website' },
  { value: 'Google', label: 'Google' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'From other College', label: 'From other College' },
];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    title: 'Professor',
    first_name: '',
    last_name: '',
    phone_number: '',
    institute: '',
    department: 'computer engineering',
    location: '',
    state: 'IN-MH',
    how_did_you_hear_about_us: 'FOSSEE website',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (!form.confirm_password) errs.confirm_password = 'Please confirm your password';
    if (form.password && form.confirm_password && form.password !== form.confirm_password) {
      errs.confirm_password = 'Passwords do not match';
    }
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.phone_number.trim()) errs.phone_number = 'Phone number is required';
    else if (form.phone_number.trim().length !== 10) errs.phone_number = 'Phone number must be 10 digits';
    if (!form.institute.trim()) errs.institute = 'Institute is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await auth.register(form);
      navigate('/login', {
        state: { message: 'Registration successful! Check your email for activation.' }
      });
    } catch (err) {
      if (err.data?.errors) {
        const serverErrors = {};
        for (const [key, msgs] of Object.entries(err.data.errors)) {
          serverErrors[key] = Array.isArray(msgs) ? msgs.join(' ') : msgs;
        }
        setErrors(serverErrors);
      } else {
        setGlobalError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function renderFieldError(field) {
    if (!errors[field]) return null;
    return <span className="field-error">{errors[field]}</span>;
  }

  return (
    <>
      <SEO
        title="Register | FOSSEE Workshop Portal"
        description="Create a coordinator account on the FOSSEE Workshop Portal to book and manage technical workshops by IIT Bombay."
        keywords="FOSSEE register, coordinator registration, IIT Bombay workshops, open source education"
      />
      <div className="login-wrapper">
        <div className="register-page-container">

          {/* Left Side: Hero Card */}
          <div className="register-left-column">
            <div className="login-left-hero">
              <img src="/hero.jpg" alt="FOSSEE Workshop Hero" className="login-hero-image" />
              <h1 className="banner-title">
                Join the Community
              </h1>
            </div>
          </div>

          {/* Right Side: Registration Form Card */}
          <div className="register-right-card animate-fade-in-up">
            <div className="register-form-header">
              <h2>Coordinator Registration</h2>
              <p>Create your account to start organising workshops</p>
            </div>

            {globalError && (
              <div className="login-error animate-fade-in" id="register-error">
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" id="register-form" noValidate>

              {/* Username */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg_username">
                  Username <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="reg_username"
                    name="username"
                    className={`form-input ${errors.username ? 'input-error' : ''}`}
                    placeholder="Letters, digits, period and underscore only"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                {renderFieldError('username')}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg_email">
                  Email <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="reg_email"
                    name="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {renderFieldError('email')}
              </div>

              {/* Password Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_password">
                    Password <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reg_password"
                      name="password"
                      className={`form-input has-icon-right ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <span className="material-icons-round">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {renderFieldError('password')}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg_confirm_password">
                    Confirm Password <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="reg_confirm_password"
                      name="confirm_password"
                      className={`form-input has-icon-right ${errors.confirm_password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      value={form.confirm_password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex="-1"
                    >
                      <span className="material-icons-round">
                        {showConfirm ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {renderFieldError('confirm_password')}
                </div>
              </div>

              {/* Title + Name Row */}
              <div className="form-row">
                <div className="form-group" style={{ flex: '0 0 120px' }}>
                  <label className="form-label" htmlFor="reg_title">
                    Title <span className="required-star">*</span>
                  </label>
                  <select
                    id="reg_title"
                    name="title"
                    className="form-input"
                    value={form.title}
                    onChange={handleChange}
                  >
                    {TITLE_CHOICES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_first_name">
                    First Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg_first_name"
                    name="first_name"
                    className={`form-input ${errors.first_name ? 'input-error' : ''}`}
                    placeholder="First name"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                  {renderFieldError('first_name')}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_last_name">
                    Last Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg_last_name"
                    name="last_name"
                    className={`form-input ${errors.last_name ? 'input-error' : ''}`}
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                  {renderFieldError('last_name')}
                </div>
              </div>

              {/* Phone + Institute Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_phone">
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <input
                    type="tel"
                    id="reg_phone"
                    name="phone_number"
                    className={`form-input ${errors.phone_number ? 'input-error' : ''}`}
                    placeholder="9999999999"
                    maxLength={10}
                    value={form.phone_number}
                    onChange={handleChange}
                  />
                  {renderFieldError('phone_number')}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_institute">
                    Institute <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg_institute"
                    name="institute"
                    className={`form-input ${errors.institute ? 'input-error' : ''}`}
                    placeholder="Full name of your Institute"
                    value={form.institute}
                    onChange={handleChange}
                  />
                  {renderFieldError('institute')}
                </div>
              </div>

              {/* Department + Location Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_department">Department</label>
                  <select
                    id="reg_department"
                    name="department"
                    className="form-input"
                    value={form.department}
                    onChange={handleChange}
                  >
                    {DEPARTMENT_CHOICES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_location">
                    Location <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg_location"
                    name="location"
                    className={`form-input ${errors.location ? 'input-error' : ''}`}
                    placeholder="Place / City"
                    value={form.location}
                    onChange={handleChange}
                  />
                  {renderFieldError('location')}
                </div>
              </div>

              {/* State + Source Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_state">State</label>
                  <select
                    id="reg_state"
                    name="state"
                    className="form-input"
                    value={form.state}
                    onChange={handleChange}
                  >
                    {STATE_CHOICES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg_source">How did you hear about us?</label>
                  <select
                    id="reg_source"
                    name="how_did_you_hear_about_us"
                    className="form-input"
                    value={form.how_did_you_hear_about_us}
                    onChange={handleChange}
                  >
                    {SOURCE_CHOICES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                id="register-submit"
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="signup-prompt" style={{ marginTop: '1.5rem' }}>
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
