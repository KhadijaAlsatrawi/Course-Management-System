document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const message = urlParams.get('message');
    const type = urlParams.get('type') || 'success';

    if (message) {
        const toastElement = document.getElementById('dynamicToast');
        const toastBody = document.getElementById('dynamic-toast-body');

        if (toastElement && toastBody) {
            toastBody.innerText = message;

            toastElement.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');

            toastElement.classList.add(`text-bg-${type}`);

            const bootstrapToast = bootstrap.Toast.getOrCreateInstance(toastElement);
            bootstrapToast.show();

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

