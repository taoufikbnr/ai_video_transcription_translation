declare type Status = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
type StatusProps = {
  status: Status;
};
declare type Results = { 
    transcription: string 
    translation: string 
}
declare type LanguageProps = {
  selectedLanguage:string
  onSelect:Dispatch<React.SetStateAction<string>>
}