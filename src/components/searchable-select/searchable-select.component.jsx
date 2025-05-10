import  { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './searchable-select.styles.scss';

const SearchableSelect = ({ label, options, value, onChange, name }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const fgRef=useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSelect = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
    setShowOptions(false);
    setSearchTerm('');
  };

  useEffect(()=>{
    if(showOptions){
        const handleClickOutside=(event)=>{
            if(fgRef.current && !fgRef.current.contains(event.target)){
                setShowOptions(false);
            }
        }
        document.addEventListener('click',handleClickOutside);
        return ()=>document.removeEventListener('click',handleClickOutside);
    }
  },[showOptions])

  return (
    <div className="filter-group" ref={fgRef}>
      <label>{label}</label>
      <div className="custom-dropdown">
        <div
          className="selected-option"
          onClick={() => setShowOptions(prev => !prev)}
        >
          {value || `Select ${label.toLowerCase()}`}
        </div>
        {showOptions && (
          <div className="dropdown-menu">
            <input
              type="search"
              className="search-input"
              placeholder={`Search ${label.toLowerCase()}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="options-list">
              <li onClick={() => handleSelect('')}>All {label}</li>
              {filteredOptions.map((opt, idx) => (
                <li key={idx} onClick={() => handleSelect(opt)}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

SearchableSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SearchableSelect;
