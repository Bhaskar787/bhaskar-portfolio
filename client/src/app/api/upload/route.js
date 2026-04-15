import {NextResponse} from 'next/server';
import cloudinary from 'cloudinary';

export async function POST(request){
    try {
        const data = await request.formData();
        const file = data.get("file")

        if(!file){
            return NextResponse.json({error: "No file uploaded"}, {status: 400})
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);


        const uploadRes = await new Promise ((resolve, reject) => { cloudinary.uploader.upload_stream({folder: "portfolio"}, (error, result) => {
            if(error) reject(error);
            else resolve(result);
        }).end(buffer)})

        return NextResponse.json({url: uploadRes.secure_url})
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({error: "Failed to upload file"}, {status: 500})
    }
}