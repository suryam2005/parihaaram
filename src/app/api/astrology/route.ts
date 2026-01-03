import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const { dob, tob, lat, lon } = await req.json();

        // 1. Convert IST (GMT+5:30) to UTC
        const [year, month, day] = dob.split("-").map(Number);
        const [hour, minute] = tob.split(":").map(Number);

        const localDate = new Date(year, month - 1, day, hour, minute);
        // Subtract 5.5 hours for UTC
        const utcDate = new Date(localDate.getTime() - (5.5 * 60 * 60 * 1000));

        const uY = utcDate.getFullYear();
        const uM = utcDate.getMonth() + 1;
        const uD = utcDate.getDate();
        const uH = utcDate.getHours();
        const uMn = utcDate.getMinutes();

        const scriptPath = path.join(process.cwd(), "calculate_jathagam.py");
        const pythonPath = path.join(process.cwd(), "venv", "bin", "python3");

        const command = `"${pythonPath}" "${scriptPath}" ${uY} ${uM} ${uD} ${uH} ${uMn} ${lat} ${lon}`;

        const result: any = await new Promise((resolve, reject) => {
            exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                try {
                    // Find the JSON part if there's any other noise
                    const output = stdout.trim();
                    resolve(JSON.parse(output));
                } catch (e) {
                    reject(new Error(`Invalid Python output: ${stdout}`));
                }
            });
        });

        if (result.error) {
            throw new Error(result.error);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Astrology API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
