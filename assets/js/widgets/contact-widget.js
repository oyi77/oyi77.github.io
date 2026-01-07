/**
 * Contact Widget - Floating contact button with quick actions
 * Black/White monochrome design
 */

(function () {
  'use strict';

  function createContactWidget() {
    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'contact-widget';
    widget.className = 'contact-widget';
    widget.setAttribute('aria-label', 'Contact options');

    // Create main button
    const mainButton = document.createElement('button');
    mainButton.className = 'contact-widget-button';
    mainButton.setAttribute('aria-label', 'Open contact menu');
    mainButton.innerHTML = '<span class="contact-btn">Contact</span>';

    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'contact-widget-menu';
    menu.setAttribute('aria-hidden', 'true');

    // Get Cal.com URL from config or use default
    const calComUrl = window.JEKYLL_DATA?.terminal?.contact_form?.cal_com_url || 'https://cal.com/oyi77';

    const contactOptions = [
      {
        label: 'Contact Form',
        action: () => {
          // Open contact form modal
          if (window.ContactFormHandler) {
            window.ContactFormHandler.show();
          } else {
            console.error('ContactFormHandler not loaded');
          }
        },
        icon: '✉'
      },
      {
        label: 'Schedule Call',
        action: () => {
          window.open(calComUrl, '_blank', 'noopener,noreferrer');
        },
        icon: '📅'
      }
    ];

    contactOptions.forEach(option => {
      const item = document.createElement('button');
      item.className = 'contact-widget-item';
      item.innerHTML = `<span class="contact-icon">${option.icon}</span><span>${option.label}</span>`;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        option.action();
        menu.setAttribute('aria-hidden', 'true');
        menu.classList.remove('show');
      });
      menu.appendChild(item);
    });

    // Availability badge
    const availability = document.createElement('div');
    availability.className = 'contact-availability';
    availability.innerHTML = '<span class="availability-dot"></span> Available for opportunities';
    widget.appendChild(availability);

    widget.appendChild(mainButton);
    widget.appendChild(menu);

    // Toggle menu
    let isOpen = false;
    mainButton.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.add('show');
        menu.setAttribute('aria-hidden', 'false');
        availability.classList.add('move-left');
      } else {
        menu.classList.remove('show');
        menu.setAttribute('aria-hidden', 'true');
        availability.classList.remove('move-left');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !widget.contains(e.target)) {
        isOpen = false;
        menu.classList.remove('show');
        menu.setAttribute('aria-hidden', 'true');
        availability.classList.remove('move-left');
      }
    });

    return widget;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const widget = createContactWidget();
      document.body.appendChild(widget);
    });
  } else {
    const widget = createContactWidget();
    document.body.appendChild(widget);
  }
})();

