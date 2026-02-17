
const apiKey = 'AIzaSyBhvLK2EVqQkwJOZ9pWnU3IIoy5gNPo8LY';
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

async function verifyKey() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                returnSecureToken: true
            })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyKey();
