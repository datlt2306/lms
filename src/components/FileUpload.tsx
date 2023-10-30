'use client'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'
import toast from 'react-hot-toast'

type FileUpoadProps = {
    onChange: (url?: string) => void
    endpoint: keyof typeof ourFileRouter
}

const FileUpload = ({ onChange, endpoint }: FileUpoadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`)
            }}
        ></UploadDropzone>
    )
}

export default FileUpload
