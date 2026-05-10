
/**
 * Returns a user-friendly error message based on the caught error.
 * @param {Error} error - The caught error object.
 * @returns {string} Human-readable error message.
 */
function getErrorMessage(error) {
    let errorMessage = 'Network error';
    if (error instanceof TypeError) {
        errorMessage = 'There was an issue with the request or network connection.';
    } else if (error instanceof SyntaxError) {
        errorMessage = 'Response was not valid JSON.';
    } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to the server.';
    }
    return errorMessage;
}

/**
 * Extracts form data and returns it as a plain object.
 * @param {HTMLFormElement} form - The form element to extract data from.
 * @returns {Object} Object containing form field values.
 */
function getFormData(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

/**
 * Sends a POST request to the API with JSON data and CSRF token.
 *
 * @param {string} endpoint - API endpoint to call.
 * @param {Object} data - Data to send in the request body.
 * @returns {Promise<{ok: boolean, status: number|string, data: any, message?: string}>}
 */
async function postData(endpoint, data) {
    await ensureCsrfCookie();

    const csrfToken = getCookie('csrftoken');
    const headers = {
        'Content-Type': 'application/json',
    };

    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data: responseData,
        };
    } catch (error) {
        return {
            ok: false,
            status: 'error',
            message: getErrorMessage(error),
        };
    }
}

/**
 * Sends a GET request to fetch protected video data.
 *
 * @returns {Promise<Response>} Fetch response object.
 */
async function getData() {
    return await fetch(`${API_BASE_URL}video/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

/**
 * Sends a GET request to activate a user account.
 *
 * @param {string} uidb64 - Base64 encoded user ID.
 * @param {string} token - Activation token.
 * @returns {Promise<Response>} Fetch response object.
 */
async function getActivationData(uidb64, token) {
    return await fetch(`${API_BASE_URL}activate/${uidb64}/${token}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

/**
 * Redirects the user to the registration page after validating the email.
 * Stores the entered email in localStorage.
 * @param {Event} event - The click event from the "Register" button/link.
 */
function goToRegister(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (validateEmail(document.getElementById("email"))) {
        localStorage.setItem('email', email);
        window.location.href = "./pages/auth/register.html";
    } else {
        showToastMessage(true, ["Please enter a valid email address"]);
    }
}

/**
 * Returns a cookie value by name.
 *
 * @param {string} name - Cookie name.
 * @returns {string} Cookie value or empty string.
 */
function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(';') : [];

    for (let cookie of cookies) {
        const trimmedCookie = cookie.trim();

        if (trimmedCookie.startsWith(`${name}=`)) {
            return decodeURIComponent(trimmedCookie.substring(name.length + 1));
        }
    }

    return '';
}

/**
 * Requests a CSRF cookie from the backend.
 *
 * @returns {Promise<void>}
 */
async function ensureCsrfCookie() {
    await fetch(`${API_BASE_URL}${CSRF_URL}`, {
        method: 'GET',
        credentials: 'include',
    });
}

