const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        const password = '123456';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log('Password:', password);
        console.log('Hash:', hash);

        const isMatch = await bcrypt.compare(password, hash);
        console.log('Match result:', isMatch);

        const isNoMatch = await bcrypt.compare('wrongpassword', hash);
        console.log('No match result:', !isNoMatch);

        if (isMatch && !isNoMatch) {
            console.log('✅ bcryptjs is working correctly!');
            process.exit(0);
        } else {
            console.error('❌ bcryptjs logical failure!');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ bcryptjs Error:', error);
        process.exit(1);
    }
}

testBcrypt();
