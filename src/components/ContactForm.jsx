import {useState, useRef, useEffect} from 'react';
import {
    TextInput,
    Button,
    Separator,
    Frame,
    ScrollView,
    Toolbar,
    ProgressBar
} from 'react95';
import printerIcon from '../assets/windows98-icons/ico/printer.ico';
import recycleBinIcon from '../assets/windows98-icons/ico/recycle_bin_empty_cool.ico';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({name: '', email: '', subject: '', message: ''});
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', or null
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPrintTooltip, setShowPrintTooltip] = useState(false);
    const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
    const [sendProgress, setSendProgress] = useState(0);
    const printTooltipRef = useRef(null);
    const deleteTooltipRef = useRef(null);
    const printButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);

    const handlePrint = () => { // Create a printable version of the form content
        const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contact Form - Print</title>
          <style>
            body {
              font-family: 'ms_sans_serif', sans-serif;
              padding: 20px;
              font-size: 11px;
            }
            .print-header {
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .print-row {
              margin-bottom: 10px;
            }
            .print-label {
              font-weight: bold;
              display: inline-block;
              min-width: 80px;
            }
            .print-section {
              margin-top: 20px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Contact Form</h2>
          </div>
          <div class="print-row">
            <span class="print-label">From:</span>
            <span>${
            formData.email || 'Your Email Address'
        }</span>
          </div>
          <div class="print-row">
            <span class="print-label">To:</span>
            <span>hobelsbergeralex@gmail.com</span>
          </div>
          <div class="print-row">
            <span class="print-label">Subject:</span>
            <span>${
            formData.subject || '(No subject)'
        }</span>
          </div>
          <div class="print-section">
            <div class="print-label">Message:</div>
            <div style="margin-top: 10px; white-space: pre-wrap;">${
            formData.message || '(No message)'
        }</div>
          </div>
          <div class="print-section">
            <div class="print-row">
              <span class="print-label">Name:</span>
              <span>${
            formData.name || '(Not provided)'
        }</span>
            </div>
            <div class="print-row">
              <span class="print-label">Email:</span>
              <span>${
            formData.email || '(Not provided)'
        }</span>
            </div>
          </div>
        </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => { // Reset form to initial state
        setFormData({name: '', email: '', subject: '', message: ''});
        setStatus(null);
        setSending(false);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    // Position tooltips above buttons
    useEffect(() => {
        if (showPrintTooltip && printButtonRef.current && printTooltipRef.current) {
            const updatePosition = () => {
                if (! printButtonRef.current || ! printTooltipRef.current) 
                    return;
                


                const buttonRect = printButtonRef.current.getBoundingClientRect();
                const tooltipWidth = 100;
                const left = buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2);
                const top = buttonRect.top - 30;

                printTooltipRef.current.style.position = 'fixed';
                printTooltipRef.current.style.left = `${left}px`;
                printTooltipRef.current.style.top = `${top}px`;
                printTooltipRef.current.style.zIndex = '10003';
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);

            return() => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [showPrintTooltip]);

    useEffect(() => {
        if (showDeleteTooltip && deleteButtonRef.current && deleteTooltipRef.current) {
            const updatePosition = () => {
                if (! deleteButtonRef.current || ! deleteTooltipRef.current) 
                    return;
                


                const buttonRect = deleteButtonRef.current.getBoundingClientRect();
                const tooltipWidth = 110;
                const left = buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2);
                const top = buttonRect.top - 30;

                deleteTooltipRef.current.style.position = 'fixed';
                deleteTooltipRef.current.style.left = `${left}px`;
                deleteTooltipRef.current.style.top = `${top}px`;
                deleteTooltipRef.current.style.zIndex = '10003';
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);

            return() => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [showDeleteTooltip]);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    useEffect(() => {
        if (!sending) {
            setSendProgress(0);
            return;
        }

        const timer = setInterval(() => {
            setSendProgress(previousPercent => {
                if (previousPercent >= 100) {
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(previousPercent + diff, 100);
            });
        }, 300);

        return() => clearInterval(timer);
    }, [sending]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (! emailRegex.test(formData.email)) {
            setStatus('error');
            return;
        }

        setSending(true);
        setSendProgress(0);
        setStatus(null);

        try { // Use serverless function to send email
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name: formData.name,
                        email: formData.email,
                        subject: formData.subject || 'Contact Form Submission from Website',
                        message: formData.message
                    }
                )
            });

            if (response.ok) {
                setStatus('success');
                setFormData({name: '', email: '', subject: '', message: ''});
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
            {/* Toolbar */}
            <Toolbar className="contact-toolbar">
                <div style={
                    {
                        position: 'relative',
                        display: 'inline-block'
                    }
                }>

                    <Button ref={printButtonRef}
                        className="toolbar-button"
                        onClick={handlePrint}
                        onMouseEnter={
                            () => setShowPrintTooltip(true)
                        }
                        onMouseLeave={
                            () => setShowPrintTooltip(false)
                    }>
                        <img src={printerIcon}
                            alt="Print"
                            style={
                                {
                                    width: '16px',
                                    height: '16px',
                                    imageRendering: 'pixelated'
                                }
                            }/>
                    </Button>
                    {
                    showPrintTooltip && (
                        <div ref={printTooltipRef}
                            className="custom-tooltip"
                            style={
                                {
                                    position: 'fixed',
                                    background: '#ffffe1',
                                    border: '1px solid #000',
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    color: '#000',
                                    whiteSpace: 'nowrap',
                                    zIndex: 10003,
                                    pointerEvents: 'none',
                                    boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)'
                                }
                        }>
                            Print Message
                        </div>
                    )
                } </div>
                <Separator orientation='vertical' size='43px'/>
                <div style={
                    {
                        position: 'relative',
                        display: 'inline-block'
                    }
                }>
                    <Button ref={deleteButtonRef}
                        className="toolbar-button"
                        onClick={handleDelete}
                        onMouseEnter={
                            () => setShowDeleteTooltip(true)
                        }
                        onMouseLeave={
                            () => setShowDeleteTooltip(false)
                    }>
                        <img src={recycleBinIcon}
                            alt="Delete"
                            style={
                                {
                                    width: '16px',
                                    height: '16px',
                                    imageRendering: 'pixelated'
                                }
                            }/>
                    </Button>
                    {
                    showDeleteTooltip && (
                        <div ref={deleteTooltipRef}
                            className="custom-tooltip"
                            style={
                                {
                                    position: 'fixed',
                                    background: '#ffffe1',
                                    border: '1px solid #000',
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    color: '#000',
                                    whiteSpace: 'nowrap',
                                    zIndex: 10003,
                                    pointerEvents: 'none',
                                    boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)'
                                }
                        }>
                            Delete Message
                        </div>
                    )
                } </div>
            </Toolbar>

            {/* Form Content */}
            <ScrollView style={{ width: '100%', flex: 1, minHeight: 0 }}>
                    {/* Email Header */}
                    <div className="email-header">
                        <div className="header-row">
                            <label className="header-label">From:</label>
                            <div className="header-value">
                                {
                                formData.email || 'Your Email Address'
                            }</div>
                        </div>
                        <div className="header-row">
                            <label className="header-label">To:</label>
                            <div className="header-value">hobelsbergeralex@gmail.com</div>
                        </div>
                        <div className="header-row">
                            <label className="header-label">Subject:</label>
                            <TextInput variant="flat"
                                value={
                                    formData.subject
                                }
                                onChange={
                                    handleChange('subject')
                                }
                                placeholder="Enter subject..."
                                className="subject-input"/>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="message-body-container">
                        <TextInput variant="flat" multiline
                            rows={12}
                            value={
                                formData.message
                            }
                            onChange={
                                handleChange('message')
                            }
                            placeholder="Type your message here..."
                            className="message-input"
                            fullWidth/>
                    </div>

                    {/* Form Fields */}
                    <div className="form-fields-section">
                        <div className="form-field">
                            <label className="form-label">Your Name:</label>
                            <TextInput variant="flat"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange('name')
                                }
                                placeholder="Enter your name..."
                                fullWidth/>
                        </div>
                        <div className="form-field">
                            <label className="form-label">Your Email:</label>
                            <TextInput variant="flat"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange('email')
                                }
                                placeholder="your.email@example.com"
                                fullWidth/>
                        </div>
                    </div>

                    {/* Status Message */}
                    {
                    status === 'success' && (
                        <div className="status-message success">
                            ✓ Message sent successfully!
                        </div>
                    )
                }
                    {
                    status === 'error' && (
                        <div className="status-message error">
                            ✗ Failed to send message. Please check your inputs and try again.
                        </div>
                    )
                }

                    {/* Sending Progress */}
                    {
                    sending && (
                        <div style={
                            {
                                marginTop: '8px',
                                marginBottom: '8px'
                            }
                        }>
                            <ProgressBar value={
                                Math.floor(sendProgress)
                            }/>
                        </div>
                    )
                }

                    {/* Send Button */}
                    <div className="form-actions">
                        <Button onClick={handleSubmit}
                            disabled={sending}
                            className="send-button">
                            {
                            sending ? 'Sending...' : '📧 Send'
                        } </Button>
                    </div>
            </ScrollView>

            {/* Status Bar */}
            <div className="contact-status-bar">
                <span>Ready</span>
            </div>

            {/* Delete Confirmation Dialog */}
            {
            showDeleteConfirm && (
                <div className="delete-confirm-overlay"
                    onClick={cancelDelete}
                    style={
                        {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000
                        }
                }>
                    <Frame variant="window"
                        style={
                            {
                                width: '300px',
                                padding: '0',
                                backgroundColor: '#c0c0c0',
                                border: '2px outset #c0c0c0',
                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                            }
                        }
                        onClick={
                            (e) => e.stopPropagation()
                    }>
                        <div style={
                            {padding: '12px'}
                        }>
                            <div style={
                                {
                                    marginBottom: '16px',
                                    fontSize: '11px'
                                }
                            }>
                                Are you sure you want to delete this message?
                            </div>
                            <div style={
                                {
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '8px'
                                }
                            }>
                                <Button onClick={confirmDelete}
                                    style={
                                        {minWidth: '75px'}
                                }>
                                    OK
                                </Button>
                                <Button onClick={cancelDelete}
                                    style={
                                        {minWidth: '75px'}
                                }>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Frame>
                </div>
            )
        }
        </div>
    );
};

export default ContactForm;

