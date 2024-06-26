import { useState, useEffect } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';


const ClassSuggestions = ({inputValue, handleClick, currentClassArray}) => {

  const [suggestions, setSuggestions] = useState([])
  const [classLibrary, setClassLibrary] = useEntityProp('root', 'site', 'bccfg_class_library')

  // Filter possible suggestions
  useEffect(() => {
    if(inputValue.length > 2){
      (async () => {
        // only classes that match input - we lowercase all just to include suggestions that are not case matched
        let filtered = classLibrary?.filter(item => {
          return item.toLowerCase().includes(inputValue.toLowerCase())
        })

        if (window.wp.hooks.hasFilter('siul.module.autocomplete')) {
          let tailwindClasses = await window.wp.hooks.applyFilters('siul.module.autocomplete', inputValue.toLowerCase())
          tailwindClasses = tailwindClasses.slice(0, 20).map(item => item.name)
        
          filtered = [...filtered, ...tailwindClasses]
        }

        // only classes that aren't already there
        filtered = filtered.filter(item => {
          return !currentClassArray().includes(item)
        })

        return filtered
      })().then(filtered => setSuggestions(filtered))
    } else {
      setSuggestions([])
    }

  }, [inputValue, classLibrary])

  return (
    <ul className='bccfg-suggestions'>
      {suggestions?.map(term => (
        <li key={term} onClick={() => handleClick(term)}>
          {term}
        </li>
      ))}
    </ul>   
  )
}

export default ClassSuggestions
