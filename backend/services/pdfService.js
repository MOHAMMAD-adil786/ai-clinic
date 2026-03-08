const PDFDocument = require('pdfkit');

const generatePrescriptionPDF = (prescription) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers = [];

            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Header
            doc.fontSize(24).font('Helvetica-Bold').fillColor('#0ea5e9')
                .text('AI Clinic', { align: 'center' });
            doc.fontSize(10).font('Helvetica').fillColor('#666')
                .text('Smart Healthcare Management System', { align: 'center' });
            doc.moveDown(0.5);

            // Line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#0ea5e9').lineWidth(2).stroke();
            doc.moveDown(1);

            // Prescription Info
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#1e293b')
                .text('PRESCRIPTION', { align: 'center' });
            doc.moveDown(0.5);

            const dateStr = new Date(prescription.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            doc.fontSize(10).font('Helvetica').fillColor('#64748b')
                .text(`Date: ${dateStr}`, { align: 'right' });
            doc.text(`Prescription ID: ${prescription._id}`, { align: 'right' });
            doc.moveDown(1);

            // Patient Info Box
            doc.rect(50, doc.y, 495, 70).fillAndStroke('#f0f9ff', '#bae6fd');
            const boxY = doc.y + 10;
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#0369a1')
                .text('Patient Information', 65, boxY);
            doc.fontSize(10).font('Helvetica').fillColor('#1e293b');
            doc.text(`Name: ${prescription.patientId?.name || 'N/A'}`, 65, boxY + 18);
            doc.text(`Age: ${prescription.patientId?.age || 'N/A'} | Gender: ${prescription.patientId?.gender || 'N/A'}`, 65, boxY + 33);
            doc.text(`Contact: ${prescription.patientId?.contact || 'N/A'}`, 65, boxY + 48);

            doc.y = boxY + 80;

            // Doctor Info
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#0369a1')
                .text(`Dr. ${prescription.doctorId?.name || 'N/A'}`);
            doc.fontSize(10).font('Helvetica').fillColor('#64748b')
                .text(`Specialization: ${prescription.doctorId?.specialization || 'General'}`);
            doc.moveDown(1);

            // Diagnosis
            if (prescription.diagnosis) {
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('Diagnosis:');
                doc.fontSize(10).font('Helvetica').fillColor('#334155').text(prescription.diagnosis);
                doc.moveDown(0.8);
            }

            // Medicines Table
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('Medicines:');
            doc.moveDown(0.5);

            // Table Header
            const tableTop = doc.y;
            doc.rect(50, tableTop, 495, 22).fill('#0ea5e9');
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
            doc.text('Medicine', 60, tableTop + 6, { width: 140 });
            doc.text('Dosage', 200, tableTop + 6, { width: 100 });
            doc.text('Frequency', 310, tableTop + 6, { width: 100 });
            doc.text('Duration', 420, tableTop + 6, { width: 115 });

            let rowY = tableTop + 22;
            prescription.medicines.forEach((med, i) => {
                const bgColor = i % 2 === 0 ? '#f8fafc' : '#ffffff';
                doc.rect(50, rowY, 495, 22).fill(bgColor);
                doc.fontSize(9).font('Helvetica').fillColor('#334155');
                doc.text(med.name, 60, rowY + 6, { width: 140 });
                doc.text(med.dosage, 200, rowY + 6, { width: 100 });
                doc.text(med.frequency, 310, rowY + 6, { width: 100 });
                doc.text(med.duration, 420, rowY + 6, { width: 115 });
                rowY += 22;
            });

            doc.y = rowY + 15;

            // Instructions
            if (prescription.instructions) {
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('Instructions:');
                doc.fontSize(10).font('Helvetica').fillColor('#334155').text(prescription.instructions);
                doc.moveDown(1);
            }

            // AI Explanation
            if (prescription.aiExplanation) {
                doc.rect(50, doc.y, 495, 2).fill('#0ea5e9');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#0369a1').text('AI-Generated Explanation:');
                doc.fontSize(9).font('Helvetica').fillColor('#475569').text(prescription.aiExplanation);
                doc.moveDown(1);
            }

            // Footer
            doc.moveTo(50, 750).lineTo(545, 750).strokeColor('#e2e8f0').lineWidth(1).stroke();
            doc.fontSize(8).font('Helvetica').fillColor('#94a3b8')
                .text('Generated by AI Clinic Management System | This is a computer-generated prescription',
                    50, 760, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePrescriptionPDF };
