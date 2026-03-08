async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@clinic.com', password: 'password123' })
        });
        const data = await res.json();
        console.log('Login:', data.token ? 'Success' : data);

        const anRes = await fetch('http://localhost:5000/api/analytics/doctor', {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });

        if (!anRes.ok) {
            console.error('Server Status:', anRes.status);
        }
        const anData = await anRes.json();
        console.log('Analytics Response:', JSON.stringify(anData, null, 2));
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}
test();
