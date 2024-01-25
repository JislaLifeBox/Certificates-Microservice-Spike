const express = require('express')
const app = express()
const port = 3003
const PDFDocument = require('pdfkit');
const { jsPDF } = require("jspdf");
const fs = require('fs');
const PdfPrinter = require('pdfmake');

app.get('/pdfmake', (req, res) => {
  const fontDescriptors = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new PdfPrinter(fontDescriptors);

  const content = [
    {
        image: 'assets/Certificado_nuevo_diversidad.png',
        width: 842, // Width of the image (A4 landscape width)
        height: 595, // Height of the image (A4 landscape height)
    },
    {
        text: 'Microservicio de certificados',
        fontSize: 22,
        bold: true,
        alignment: 'center',
        color: 'white',
        absolutePosition: { x: 0, y: 300 }, // Adjust the y position as needed
        width: 595, // Width of the text box (A4 landscape width)
    },
  ];

  const docDefinition = {
    pageMargins: [0, 0, 0, 0], // Set all margins to 0
    content,
    defaultStyle: {
      font: 'Helvetica',
    },
    pageOrientation: 'landscape', // Set the layout to landscape
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');

  pdfDoc.pipe(res);
  pdfDoc.end();
});

app.get('/pdfKit', (req, res) => {
    const myDoc = new PDFDocument({bufferPages: true, layout: 'landscape'});
    
    let buffers = [];
    myDoc.on('data', buffers.push.bind(buffers));
    myDoc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=test.pdf',})
            .end(pdfData);
            
        });
    // Calculate the text width
    myDoc.fontSize(22)
    myDoc.fillColor('white')
    myDoc.font('Helvetica-Bold')
    const text = 'Microservicio de certificados';
    const textWidth = myDoc.widthOfString(text);
    const x = myDoc.page.width / 2 - (textWidth / 2);
    const y = 300; 

    myDoc.image('assets/Certificado_nuevo_diversidad.png', 0,0, {width: myDoc.page.width, height: myDoc.page.height});
    myDoc.text(`${text}`, x, y)
    myDoc.end();
})

app.get('/jsPdf', (req, res) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
    });

    // Load your image
    const imagePath = 'assets/Certificado_nuevo_diversidad.png';
    const imageData = fs.readFileSync(imagePath);
    const imageBase64 = imageData.toString('base64');

    // Add image to the PDF
    doc.addImage(imageBase64, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

    // Add text to the PDF
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    const text = 'Microservicio de certificados';
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.getWidth() / 2) - (textWidth / 2);
    const y = 200; 
    doc.text(text, x, 225);

    // Convert the PDF to a Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Set the appropriate headers
    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfBuffer),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=test.pdf'
    }).end(pdfBuffer);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})