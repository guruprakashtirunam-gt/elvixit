document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');
    const generateBtn = document.getElementById('generateBtn');
    
    // States
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const resultState = document.getElementById('resultState');
    const errorState = document.getElementById('errorState');
    
    // Elements
    const resultSubject = document.getElementById('resultSubject');
    const resultBody = document.getElementById('resultBody');
    const errorMessage = document.getElementById('errorMessage');
    
    // Buttons
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Create Toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Copied to clipboard!';
    document.body.appendChild(toast);
    
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function setState(state) {
        emptyState.classList.add('hidden');
        loadingState.classList.add('hidden');
        resultState.classList.add('hidden');
        errorState.classList.add('hidden');
        
        // Remove animation class before re-adding
        resultState.classList.remove('fade-in');
        
        switch(state) {
            case 'empty':
                emptyState.classList.remove('hidden');
                copyBtn.disabled = true;
                downloadBtn.disabled = true;
                break;
            case 'loading':
                loadingState.classList.remove('hidden');
                copyBtn.disabled = true;
                downloadBtn.disabled = true;
                break;
            case 'result':
                resultState.classList.remove('hidden');
                resultState.classList.add('fade-in');
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
                break;
            case 'error':
                errorState.classList.remove('hidden');
                copyBtn.disabled = true;
                downloadBtn.disabled = true;
                break;
        }
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            emailType: document.getElementById('emailType').value,
            recipient: document.getElementById('recipient').value,
            tone: document.getElementById('tone').value,
            length: document.getElementById('length').value,
            additionalDetails: document.getElementById('additionalDetails').value
        };
        
        // Update UI
        setState('loading');
        generateBtn.disabled = true;
        
        try {
            const apiBaseUrl = (window.API_BASE_URL || '').replace(/\/$/, '');
            const response = await fetch(`${apiBaseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate email');
            }
            
            // Populate results
            resultSubject.value = data.subject;
            resultBody.value = data.body;
            
            setState('result');
        } catch (error) {
            errorMessage.textContent = error.message;
            setState('error');
        } finally {
            generateBtn.disabled = false;
        }
    });
    
    copyBtn.addEventListener('click', () => {
        const fullEmail = `Subject: ${resultSubject.value}\n\n${resultBody.value}`;
        navigator.clipboard.writeText(fullEmail).then(() => {
            showToast();
            // Pulse animation on button
            copyBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                copyBtn.style.transform = '';
            }, 150);
        });
    });
    
    downloadBtn.addEventListener('click', () => {
        const fullEmail = `Subject: ${resultSubject.value}\n\n${resultBody.value}`;
        const blob = new Blob([fullEmail], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_email.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
