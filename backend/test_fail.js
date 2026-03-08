async function test() {
    try {
        console.log('Testing with wrong password...');
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'doc@clinic.com', password: 'wrongpassword' })
        });
        console.log('Status (wrong password):', res.status);
        const data = await res.json();
        console.log('Response:', data);

        console.log('\nTesting with non-existent user...');
        const res2 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'none@clinic.com', password: 'password123' })
        });
        console.log('Status (non-existent):', res2.status);
        const data2 = await res2.json();
        console.log('Response:', data2);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}
test();
