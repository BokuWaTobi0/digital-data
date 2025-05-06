import './search.styles.scss'
import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaUserCircle } from 'react-icons/fa';

// Default course options - keeping in sync with create component
const defaultCourses = [
    'Basic', 
    'Advance', 
    'Soul', 
    'Crystal', 
    'Psychic Self-Defence', 
    'Kryashakthi', 
    'Arhatic Yoga', 
    'Spiritual Business Management', 
    'Body Sculpting', 
    'Retreat', 
    'Level 1', 
    'Level 2', 
    'Level 3'
];

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        course: '',
        place: '',
        month: '',
        year: '',
        certificateNumber: ''
    });
    
    // Mock data for demonstration - same data structure as in Create component
    const [results, setResults] = useState([]);
    
    // Separate data for people and enrollments
    const people = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            mobileNumber: '1234567890',
            referenceBy: 'Jane Smith'
        },
        {
            id: 2,
            firstName: 'Alice',
            lastName: 'Johnson',
            gender: 'female',
            mobileNumber: '9876543210',
            referenceBy: 'Bob Williams'
        }
    ];
    
    const enrollments = [
        {
            id: 1,
            personId: 1,
            course: 'Basic',
            place: 'New York',
            venue: 'Tech Hub',
            day: '15',
            month: 'June',
            year: '2023',
            certificateNumber: 'CERT001'
        },
        {
            id: 2,
            personId: 2,
            course: 'Advance',
            place: 'San Francisco',
            venue: 'Code Center',
            day: '22',
            month: 'July',
            year: '2023',
            certificateNumber: 'CERT002'
        },
        {
            id: 3,
            personId: 1,
            course: 'Soul',
            place: 'Chicago',
            venue: 'Data Center',
            day: '10',
            month: 'August',
            year: '2023',
            certificateNumber: 'CERT003'
        }
    ];
    
    const handleSearch = (e) => {
        e.preventDefault();
        
        // First filter enrollments based on filters
        const filteredEnrollments = enrollments.filter(enrollment => {
            const matchesFilters = 
                (filters.course === '' || enrollment.course === filters.course) &&
                (filters.place === '' || enrollment.place === filters.place) &&
                (filters.month === '' || enrollment.month === filters.month) &&
                (filters.year === '' || enrollment.year === filters.year) &&
                (filters.certificateNumber === '' || 
                    enrollment.certificateNumber.toLowerCase().includes(filters.certificateNumber.toLowerCase()));
                
            return matchesFilters;
        });
        
        // Get unique personIds from filtered enrollments
        const enrollmentPersonIds = [...new Set(filteredEnrollments.map(e => e.personId))];
        
        // Filter people based on search term and enrollment match
        const filteredPeople = people.filter(person => {
            const matchesSearch = 
                searchTerm === '' || 
                person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.mobileNumber.includes(searchTerm);
                
            // Include this person if they match the search term OR 
            // if their enrollments match the filters and there's no search term
            const personEnrollments = filteredEnrollments.filter(e => e.personId === person.id);
            
            return (matchesSearch && (searchTerm !== '' || personEnrollments.length > 0)) || 
                  (searchTerm === '' && enrollmentPersonIds.includes(person.id));
        });
        
        // Combine data for display
        const combinedResults = filteredPeople.map(person => {
            const personEnrollments = filteredEnrollments.filter(
                enrollment => enrollment.personId === person.id
            );
            return {
                ...person,
                enrollments: personEnrollments
            };
        });
        
        setResults(combinedResults);
    };
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };
    
    const clearFilters = () => {
        setFilters({
            course: '',
            place: '',
            month: '',
            year: '',
            certificateNumber: ''
        });
    };
    
    // Get unique place, month, and year options from enrollments data
    const placeOptions = [...new Set(enrollments.map(entry => entry.place))];
    const monthOptions = [...new Set(enrollments.map(entry => entry.month))];
    const yearOptions = [...new Set(enrollments.map(entry => entry.year))];
    
    return (
        <div className='search-div'>
            <h1>Search Data</h1>
            
            <div className='search-container'>
                <form onSubmit={handleSearch}>
                    <div className='search-bar'>
                        <input 
                            type='text' 
                            placeholder='Search by name or mobile number...' 
                            className='search-input'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type='submit' className='search-button'>
                            <FaSearch />
                            <span>Search</span>
                        </button>
                        <button 
                            type='button' 
                            className={`filter-button ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                        </button>
                    </div>
                    
                    {showFilters && (
                        <div className='filters-container'>
                            <div className='filters-header'>
                                <h3>Filters</h3>
                                <button type='button' className='clear-filters' onClick={clearFilters}>
                                    <FaTimes />
                                    <span>Clear</span>
                                </button>
                            </div>
                            
                            <div className='filters-grid'>
                                <div className='filter-group'>
                                    <label>Course</label>
                                    <select 
                                        name='course'
                                        value={filters.course}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Courses</option>
                                        {defaultCourses.map((course, index) => (
                                            <option key={index} value={course}>{course}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='filter-group'>
                                    <label>Place</label>
                                    <select 
                                        name='place'
                                        value={filters.place}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Places</option>
                                        {placeOptions.map((place, index) => (
                                            <option key={index} value={place}>{place}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='filter-group'>
                                    <label>Month</label>
                                    <select 
                                        name='month'
                                        value={filters.month}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Months</option>
                                        {monthOptions.map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='filter-group'>
                                    <label>Year</label>
                                    <select 
                                        name='year'
                                        value={filters.year}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Years</option>
                                        {yearOptions.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='filter-group'>
                                    <label>Certificate Number</label>
                                    <input 
                                        type='text'
                                        name='certificateNumber'
                                        placeholder='Enter certificate #'
                                        value={filters.certificateNumber}
                                        onChange={handleFilterChange}
                                        className='filter-input'
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            
            <div className='results-container'>
                {results.length > 0 ? (
                    <>
                        <h2>Search Results ({results.length})</h2>
                        <div className='results-grid'>
                            {results.map(person => (
                                <div key={person.id} className='result-card'>
                                    <div className='result-header'>
                                        <h3>{person.firstName} {person.lastName}</h3>
                                        <div className='person-info'>
                                            <span>{person.gender}</span>
                                            <span>{person.mobileNumber}</span>
                                        </div>
                                    </div>
                                    
                                    <div className='person-enrollments'>
                                        <h4>Course Enrollments ({person.enrollments.length})</h4>
                                        
                                        {person.enrollments.map(enrollment => (
                                            <div key={enrollment.id} className='enrollment-item'>
                                                <div className='enrollment-header'>
                                                    <span className='course-name'>{enrollment.course}</span>
                                                    <span className='certificate'>#{enrollment.certificateNumber}</span>
                                                </div>
                                                
                                                <div className='enrollment-details'>
                                                    <div className='detail-row'>
                                                        <span className='label'>Place:</span>
                                                        <span className='value'>{enrollment.place}</span>
                                                    </div>
                                                    <div className='detail-row'>
                                                        <span className='label'>Venue:</span>
                                                        <span className='value'>{enrollment.venue}</span>
                                                    </div>
                                                    <div className='detail-row'>
                                                        <span className='label'>Date:</span>
                                                        <span className='value'>{enrollment.day} {enrollment.month} {enrollment.year}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className='person-footer'>
                                        <span>Reference: {person.referenceBy}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : searchTerm || Object.values(filters).some(f => f !== '') ? (
                    <div className='no-results'>
                        <p>No results found. Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className='search-prompt'>
                        <FaSearch className='prompt-icon' />
                        <p>Enter a search term or apply filters to find entries</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;