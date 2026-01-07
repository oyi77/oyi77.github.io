/**
 * Contact Form Handler
 * Handles anonymous contact form submissions via Formspree (primary) and EmailJS (backup)
 */

(function() {
  'use strict';

  // Configuration - Get from Jekyll data or use defaults
  const CONFIG = {
    formspree: {
      endpoint: window.JEKYLL_DATA?.terminal?.contact_form?.formspree_endpoint || 'https://formspree.io/f/xlgdqlpz',
      formId: window.JEKYLL_DATA?.terminal?.contact_form?.formspree_id || 'xlgdqlpz'
    },
    emailjs: {
      publicKey: window.JEKYLL_DATA?.terminal?.contact_form?.emailjs_public_key || 'BfrEVgwmh9hSgxrPC',
      serviceId: '', // Will be set when EmailJS is configured
      templateId: '' // Will be set when EmailJS is configured
    },
    anonymousEmail: window.JEKYLL_DATA?.terminal?.contact_form?.anonymous_email || 'xji1d0d1@oyi77.anonaddy.me'
  };

  /**
   * Create and show contact form modal
   */
  function createContactFormModal() {
    // Check if modal already exists
    let modal = document.getElementById('contact-form-modal');
    if (modal) {
      modal.classList.add('show');
      return modal;
    }

    // Create modal overlay
    modal = document.createElement('div');
    modal.id = 'contact-form-modal';
    modal.className = 'contact-form-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'contact-form-title');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="contact-form-modal-content">
        <div class="contact-form-modal-header">
          <h3 id="contact-form-title">Get in Touch</h3>
          <button class="contact-form-close" aria-label="Close contact form">&times;</button>
        </div>
        <div class="contact-form-modal-body">
          <form id="contact-form" novalidate>
            <div class="form-group">
              <label for="contact-name">Your Name *</label>
              <input type="text" id="contact-name" name="name" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="contact-email">Your Email *</label>
              <input type="email" id="contact-email" name="email" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="contact-company">Company</label>
              <input type="text" id="contact-company" name="company">
            </div>
            <div class="form-group">
              <label for="contact-role">Role/Position</label>
              <input type="text" id="contact-role" name="role">
            </div>
            <div class="form-group">
              <label for="contact-message">Message *</label>
              <textarea id="contact-message" name="message" rows="5" required aria-required="true"></textarea>
            </div>
            <div id="contact-form-status" class="form-status" role="alert" aria-live="polite"></div>
            <div class="form-actions">
              <button type="submit" id="contact-submit" class="btn-submit">Send Message</button>
              <button type="button" class="btn-cancel contact-form-close">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeButtons = modal.querySelectorAll('.contact-form-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => closeContactFormModal());
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeContactFormModal();
      }
    });

    // Handle form submission
    const form = modal.querySelector('#contact-form');
    form.addEventListener('submit', handleFormSubmit);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeContactFormModal();
      }
    });

    return modal;
  }

  /**
   * Show contact form modal
   */
  function showContactFormModal() {
    const modal = createContactFormModal();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    const firstInput = modal.querySelector('#contact-name');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Close contact form modal
   */
  function closeContactFormModal() {
    const modal = document.getElementById('contact-form-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      
      // Reset form after animation
      setTimeout(() => {
        const form = modal.querySelector('#contact-form');
        if (form) {
          form.reset();
          const status = modal.querySelector('#contact-form-status');
          if (status) {
            status.textContent = '';
            status.className = 'form-status';
          }
        }
      }, 300);
    }
  }

  /**
   * Handle form submission
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('#contact-submit');
    const statusDiv = form.querySelector('#contact-form-status');
    
    // Get form data
    const formData = {
      name: form.querySelector('#contact-name').value.trim(),
      email: form.querySelector('#contact-email').value.trim(),
      company: form.querySelector('#contact-company').value.trim(),
      role: form.querySelector('#contact-role').value.trim(),
      message: form.querySelector('#contact-message').value.trim()
    };

    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      showStatus(statusDiv, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showStatus(statusDiv, 'Please enter a valid email address.', 'error');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showStatus(statusDiv, 'Sending message...', 'info');

    try {
      // Try Formspree first
      const success = await submitToFormspree(formData);
      
      if (success) {
        showStatus(statusDiv, 'Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
        form.reset();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          closeContactFormModal();
        }, 2000);
      } else {
        // Fallback to EmailJS if available
        if (typeof emailjs !== 'undefined') {
          const emailjsSuccess = await submitToEmailJS(formData);
          if (emailjsSuccess) {
            showStatus(statusDiv, 'Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
            form.reset();
            setTimeout(() => closeContactFormModal(), 2000);
          } else {
            throw new Error('Failed to send message. Please try again later.');
          }
        } else {
          throw new Error('Failed to send message. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showStatus(statusDiv, 'Sorry, there was an error sending your message. Please try again later or use the scheduling link to book a call.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  }

  /**
   * Submit to Formspree
   */
  async function submitToFormspree(formData) {
    const payload = {
      name: formData.name,
      email: formData.email,
      company: formData.company || '',
      role: formData.role || '',
      message: formData.message,
      _replyto: formData.email,
      _subject: formData.company 
        ? `Job Opportunity: ${formData.role || 'Position'} at ${formData.company}`
        : `Contact Form: ${formData.name}`
    };

    try {
      const response = await fetch(CONFIG.formspree.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok && (data.ok || response.status === 200)) {
        return true;
      } else {
        console.error('Formspree error:', data);
        return false;
      }
    } catch (error) {
      console.error('Formspree submission error:', error);
      return false;
    }
  }

  /**
   * Submit to EmailJS (backup)
   */
  async function submitToEmailJS(formData) {
    if (typeof emailjs === 'undefined') {
      // Load EmailJS SDK if not available
      await loadEmailJSSDK();
    }

    if (typeof emailjs === 'undefined' || !CONFIG.emailjs.serviceId || !CONFIG.emailjs.templateId) {
      return false;
    }

    try {
      emailjs.init(CONFIG.emailjs.publicKey);
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not specified',
        role: formData.role || 'Not specified',
        message: formData.message,
        to_email: CONFIG.anonymousEmail
      };

      const response = await emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('EmailJS submission error:', error);
      return false;
    }
  }

  /**
   * Load EmailJS SDK
   */
  function loadEmailJSSDK() {
    return new Promise((resolve, reject) => {
      if (typeof emailjs !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
      document.head.appendChild(script);
    });
  }

  /**
   * Show status message
   */
  function showStatus(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `form-status form-status-${type}`;
    element.setAttribute('role', 'alert');
  }

  /**
   * Validate email
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Export functions to global scope
  window.ContactFormHandler = {
    show: showContactFormModal,
    close: closeContactFormModal
  };

  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Form will be created on demand when show() is called
    });
  }
})();

