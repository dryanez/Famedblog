import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';

// Configure worker - strictly needed for node? sometimes.
// pdfjs.GlobalWorkerOptions.workerSrc = '...'; 

async function run() {
    try {
        const loadingTask = pdfjs.getDocument("public/documents/famed-protokoll.pdf");
        const pdf = await loadingTask.promise;
        const outline = await pdf.getOutline();

        console.log("--- PDF Outline Structure ---");
        console.log(JSON.stringify(outline, null, 2));
    } catch (e) {
        console.error("Error reading PDF:", e);
    }
}

run();
