declare type Status = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
declare type Results = { 
    transcription: string 
    translation: string 
}