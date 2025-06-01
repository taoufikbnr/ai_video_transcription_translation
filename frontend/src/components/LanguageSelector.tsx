import {languages} from "../data/languages";

const LanguageSelector = ({selectedLanguage, onSelect }:LanguageProps) => {

  return (
        <>
             <select
               value={selectedLanguage}
               required
               onChange={(e) => onSelect(e.target.value)}
               className="text-black w-full mt-1 py-2 border-1  border-gray-300  focus:outline-none rounded-md"
             >
               <option value="">Select a language</option>
               {languages.map((lang) => (
                 <option key={lang.name} value={lang.name}>
                   {lang.name}              
                 </option>
               ))}
             </select>         
        </>
  )
}

export default LanguageSelector