dayjs.locale('es');
dayjs.extend(window.dayjs_plugin_duration);
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_calendar);

const form = document.getElementById('contact-form');
if (!form) {
    throw new Error('Form not found');
}

// Add smooth scrolling to all <a> with href="#..."
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const contactMethodInputs = form.querySelectorAll('input[name="contact-method"]');
const emailInputWrapper = form.querySelector('#email-input-wrapper');
const nameInput = form.querySelector('input[name="name"]');
const emailInput = form.querySelector('input[name="email"]');
const serviceInput = form.querySelector('select[name="service"]');
const scheduleInput = form.querySelector('input[name="schedule"]');
const messageTextArea = form.querySelector('textarea');
const success = form.querySelector('#success');

// Schedule should be a future date
if (scheduleInput) {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    scheduleInput.min = date.toISOString().slice(0, 16);
}

const setEmailVisibility = (isVisible) => {
    if (!emailInputWrapper || !emailInput) return;

    emailInputWrapper.classList.toggle('hidden', !isVisible);
    emailInput.required = isVisible;
}

contactMethodInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) return;
        setEmailVisibility(e.target.value === 'email');
    });
});

const sendFormViaWhatsApp = () => {
    const name = nameInput.value;
    const service  = serviceInput.value;
    const message = messageTextArea.value;

    const date = dayjs(scheduleInput.value);
    const schedule = date.calendar(null, {
        sameDay: "[hoy a las] HH:mm [hs]", // The same day ( Today at 2:30 AM )
        nextDay: "[mañana] DD/MM [a las] HH:mm [hs]", // The next day ( Tomorrow at 2:30 AM )
        nextWeek: "[el día] dddd DD/MM [a las] HH:mm [hs]", // The next week ( Sunday at 2:30 AM )
        lastDay: "[ayer a las] HH:mm [hs]", // The day before ( Yesterday at 2:30 AM )
        lastWeek: "[el] dddd [anterior a las] HH:mm [hs]", // Last week ( Last Monday at 2:30 AM )
        sameElse: "[el día] DD/MM/YYYY [a las] HH:mm [hs]", // Everything else ( 17/10/2011 )
    });

    const finalMessage = `¡Hola! Soy ${name} y quiero pedir un turno para servicio de ${service}. Mi horario de preferencia es ${schedule}. ${message ? `\nMensaje adicional: ${message}` : ''}`;

    success.classList.add('show');

    window.open(`https://wa.me/5491124079850?text=${encodeURIComponent(finalMessage)}`, '_blank');
}

const sendFormViaAjax = async () => {
    const name = nameInput.value;
    const email = emailInput.value;
    const service  = serviceInput.value;
    const message = messageTextArea.value;
    const schedule = scheduleInput.value;

    try {
        await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, service, message, schedule }),
        });
    } catch (e) {
        alert('Hubo un error al enviar el formulario. Por favor, intentá nuevamente.');
        return;
    }

    success.classList.add('show');
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const contactMethodInput = form.querySelector('input[name="contact-method"]:checked');
    const contactMethod = contactMethodInput.value;
    
    if (contactMethod === 'whatsapp') {
        sendFormViaWhatsApp();
    } else {
        sendFormViaAjax();
    }
});
