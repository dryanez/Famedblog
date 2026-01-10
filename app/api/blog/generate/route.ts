import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        console.log(`🤖 Generating blog post for topic: "${topic}"...`);

        // Path to python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'topic_research.py');

        // Spawn python process
        // Note: Using 'python3' - might need to be 'python' depending on environment
        return new Promise((resolve) => {
            const pythonProcess = spawn('python3', [
                scriptPath,
                '--topic', topic,
                '--json',
                '--no-save'
            ]);

            let outputData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                // console.log(`[Python Log]: ${data.toString()}`);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python script exited with code ${code}`);
                    console.error(`Error output: ${errorData}`);
                    resolve(NextResponse.json(
                        { error: 'Failed to generate content', details: errorData },
                        { status: 500 }
                    ));
                    return;
                }

                try {
                    // unexpected logs might be in stdout if we failed to redirect all logs to stderr in python
                    // find the JSON part
                    const jsonStart = outputData.indexOf('{');
                    const jsonEnd = outputData.lastIndexOf('}');

                    if (jsonStart === -1 || jsonEnd === -1) {
                        throw new Error('No JSON found in output');
                    }

                    const jsonStr = outputData.substring(jsonStart, jsonEnd + 1);
                    const result = JSON.parse(jsonStr);

                    resolve(NextResponse.json(result));
                } catch (e) {
                    console.error('Failed to parse Python output:', e);
                    resolve(NextResponse.json(
                        { error: 'Invalid response from AI agent', raw: outputData },
                        { status: 500 }
                    ));
                }
            });
        });

    } catch (error: any) {
        console.error('Generate API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
