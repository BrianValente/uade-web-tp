// @ts-check

const form = document.getElementById('contact-form');
if (!form) {
    throw new Error('Form not found');
}

/** @type {NodeListOf<HTMLInputElement>} */
const contactMethodInput = form.querySelectorAll('input[name="contact-method"]');
/** @type {HTMLLabelElement | null} */
const emailInputWrapper = form.querySelector('#email-input-wrapper');
/** @type {HTMLInputElement | null} */
const emailInput = emailInputWrapper?.querySelector('input') ?? null;

/**
 * Input of type 'datetime-local'.
 * @type {HTMLInputElement | null}
 * */
const scheduleInput = form.querySelector('input[name="schedule"]');

// Schedule should be a future date
if (scheduleInput) {
    scheduleInput.min = new Date().toISOString().slice(0, 16);
}

/**
 * @param {boolean} isVisible 
 */
const setEmailVisibility = (isVisible) => {
    if (!emailInputWrapper || !emailInput) return;

    emailInputWrapper.classList.toggle('hidden', !isVisible);
    emailInput.required = isVisible;
}

contactMethodInput.forEach((input) => {
    input.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) return;
        setEmailVisibility(e.target.value === 'email');
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    /** @type {HTMLInputElement | null} */
    const contactMethodInput = form.querySelector('input[name="contact-method"]:checked');

    /** @type {HTMLInputElement | null} */
    const nameInput = form.querySelector('input[name="name"]');

    /** @type {HTMLInputElement | null} */
    const emailInput = form.querySelector('input[name="email"]');

    /** @type {HTMLTextAreaElement | null} */
    const messageTextArea = form.querySelector('textarea');

    const contactMethod = contactMethodInput?.value;
    const name = nameInput?.value;
    const email = emailInput?.value;
    const message = messageTextArea?.value;

    alert(`
        Contact Method: ${contactMethod}
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `);
});
