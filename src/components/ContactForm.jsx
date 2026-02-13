import { useState } from 'react';
import { TextInput, Button } from 'react95';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // Use serverless function to send email
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Contact Form Submission from Website',
          message: formData.message
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-form-container">
      {/* Menu Bar */}
      <div className="contact-menu-bar">
        <button className="menu-item">File</button>
        <button className="menu-item">Edit</button>
        <button className="menu-item">View</button>
        <button className="menu-item">Insert</button>
        <button className="menu-item">Format</button>
        <button className="menu-item">Tools</button>
        <button className="menu-item">Compose</button>
        <button className="menu-item">Help</button>
      </div>

      {/* Toolbar */}
      <div className="contact-toolbar">
        <button className="toolbar-button" title="Save">
          <span className="toolbar-icon">💾</span>
        </button>
        <button className="toolbar-button" title="Print">
          <span className="toolbar-icon">🖨</span>
        </button>
        <button className="toolbar-button" title="Delete">
          <span className="toolbar-icon">🗑</span>
        </button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-button" title="Reply">
          <span className="toolbar-icon">↩</span>
        </button>
        <button className="toolbar-button" title="Forward">
          <span className="toolbar-icon">↪</span>
        </button>
        <button className="toolbar-button" title="Move">
          <span className="toolbar-icon">📁</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="contact-form-content">
        {/* Email Header */}
        <div className="email-header">
          <div className="header-row">
            <label className="header-label">From:</label>
            <div className="header-value">{formData.email || 'Your Email Address'}</div>
          </div>
          <div className="header-row">
            <label className="header-label">To:</label>
            <div className="header-value">hobelsbergeralex@gmail.com</div>
          </div>
          <div className="header-row">
            <label className="header-label">Subject:</label>
            <TextInput
              variant="flat"
              value={formData.subject}
              onChange={handleChange('subject')}
              placeholder="Enter subject..."
              className="subject-input"
            />
          </div>
        </div>

        {/* Message Body */}
        <div className="message-body-container">
          <TextInput
            variant="flat"
            multiline
            rows={12}
            value={formData.message}
            onChange={handleChange('message')}
            placeholder="Type your message here..."
            className="message-input"
            fullWidth
          />
        </div>

        {/* Form Fields */}
        <div className="form-fields-section">
          <div className="form-field">
            <label className="form-label">Your Name:</label>
            <TextInput
              variant="flat"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter your name..."
              fullWidth
            />
          </div>
          <div className="form-field">
            <label className="form-label">Your Email:</label>
            <TextInput
              variant="flat"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="your.email@example.com"
              fullWidth
            />
          </div>
        </div>

        {/* Status Message */}
        {status === 'success' && (
          <div className="status-message success">
            ✓ Message sent successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="status-message error">
            ✗ Failed to send message. Please check your inputs and try again.
          </div>
        )}

        {/* Send Button */}
        <div className="form-actions">
          <Button 
            onClick={handleSubmit}
            disabled={sending}
            className="send-button"
          >
            {sending ? 'Sending...' : '📧 Send'}
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="contact-status-bar">
        <span>Ready</span>
      </div>
    </div>
  );
};

export default ContactForm;

