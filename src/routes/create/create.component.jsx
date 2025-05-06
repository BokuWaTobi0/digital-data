import './create.styles.scss'
import { useState, useEffect } from 'react';
import { FaArrowRight, FaUserPlus, FaSave, FaArrowLeft, FaSearch, FaPlus, FaUser } from 'react-icons/fa';

// Default course options
const defaultCourses = [
    'BASIC', 
    'ADVANCE', 
    'SOUL', 
    'CRYSTAL', 
    'PSYCHIC SELF-DEFENCE', 
    'KRYASHAKTHI', 
    'ARHATIC YOGA', 
    'SPIRITUAL BUSINESS MANAGEMENT', 
    'BODY SCULPTING', 
    'RETREAT', 
    'LEVEL 1', 
    'LEVEL 2', 
    'LEVEL 3'
];

const Create = () => {
    const [step, setStep] = useState(1);
    const [batchData, setBatchData] = useState({
        course: '',
        place: '',
        venue: '',
        day: '',
        month: '',
        year: new Date().getFullYear()
    });
    
    const [personMode, setPersonMode] = useState('new');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        gender: 'male',
        mobileNumber: '',
        referenceBy: '',
        certificateNumber: ''
    });
    
    // Mock data for people and enrollments
    const [people, setPeople] = useState([
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
    ]);
    
    const [enrollments, setEnrollments] = useState([
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
        }
    ]);
    
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [currentEnrollments, setCurrentEnrollments] = useState([]);
    
    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatchData({
            ...batchData,
            [name]: value
        });
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalData({
            ...personalData,
            [name]: value
        });
    };

    const handleBatchSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };
    
    const searchPeople = () => {
        if (searchTerm.trim() === '') {
            setFilteredPeople([]);
            return;
        }
        
        const results = people.filter(person => 
            person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.mobileNumber.includes(searchTerm)
        );
        
        setFilteredPeople(results);
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchPeople();
    };
    
    const selectPerson = (person) => {
        setSelectedPerson(person);
        setPersonMode('existing');
        
        // Find current enrollments for this person
        const personEnrollments = enrollments.filter(enrollment => 
            enrollment.personId === person.id
        );
        setCurrentEnrollments(personEnrollments);
    };
    
    const switchToNewPerson = () => {
        setPersonMode('new');
        setSelectedPerson(null);
        setPersonalData({
            firstName: '',
            lastName: '',
            gender: 'male',
            mobileNumber: '',
            referenceBy: '',
            certificateNumber: ''
        });
    };

    const handlePersonalSubmit = (e) => {
        e.preventDefault();
        
        if (personMode === 'new') {
            // Create new person
            const newPerson = {
                id: Date.now(),
                firstName: personalData.firstName,
                lastName: personalData.lastName,
                gender: personalData.gender,
                mobileNumber: personalData.mobileNumber,
                referenceBy: personalData.referenceBy
            };
            
            // Create new enrollment
            const newEnrollment = {
                id: Date.now() + 1,
                personId: newPerson.id,
                certificateNumber: personalData.certificateNumber,
                ...batchData
            };
            
            setPeople([...people, newPerson]);
            setEnrollments([...enrollments, newEnrollment]);
            
            // Reset form
            setPersonalData({
                firstName: '',
                lastName: '',
                gender: 'male',
                mobileNumber: '',
                referenceBy: '',
                certificateNumber: ''
            });
            
            alert('New person and enrollment added successfully!');
        } else {
            // Create new enrollment for existing person
            const newEnrollment = {
                id: Date.now(),
                personId: selectedPerson.id,
                certificateNumber: personalData.certificateNumber,
                ...batchData
            };
            
            setEnrollments([...enrollments, newEnrollment]);
            setCurrentEnrollments([...currentEnrollments, newEnrollment]);
            
            // Reset certificate number only
            setPersonalData({
                ...personalData,
                certificateNumber: ''
            });
            
            alert('New enrollment added for existing person!');
        }
    };

    const goBack = () => {
        setStep(1);
    };
    
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPeople([]);
        }
    }, [searchTerm]);

    return (
        <div className='create-div'>
            <h1>Data Entry</h1>
            
            {step === 1 ? (
                // Step 1: Batch Information Form
                <div className='form-container'>
                    <h2>Batch Information</h2>
                    <p className='info-text'>Enter default information for this batch</p>
                    
                    <form onSubmit={handleBatchSubmit}>
                        <div className='form-group'>
                            <label>Course</label>
                            <select 
                                name='course' 
                                className='c-input'
                                value={batchData.course} 
                                onChange={handleBatchChange}
                                required
                            >
                                <option value=''>Select Course</option>
                                {defaultCourses.map((course, index) => (
                                    <option key={index} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className='form-group'>
                            <label>Place</label>
                            <input 
                                type='text' 
                                name='place' 
                                className='c-input'
                                value={batchData.place} 
                                onChange={handleBatchChange}
                                required
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label>Venue</label>
                            <input 
                                type='text' 
                                name='venue' 
                                className='c-input'
                                value={batchData.venue} 
                                onChange={handleBatchChange}
                                required
                            />
                        </div>
                        
                        <div className='date-group'>
                            <div className='form-group'>
                                <label>Day</label>
                                <input 
                                    type='number' 
                                    name='day' 
                                    className='c-input'
                                    min='1'
                                    max='31'
                                    value={batchData.day} 
                                    onChange={handleBatchChange}
                                    required
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label>Month</label>
                                <select 
                                    name='month' 
                                    className='c-input'
                                    value={batchData.month} 
                                    onChange={handleBatchChange}
                                    required
                                >
                                    <option value=''>Select Month</option>
                                    <option value='January'>January</option>
                                    <option value='February'>February</option>
                                    <option value='March'>March</option>
                                    <option value='April'>April</option>
                                    <option value='May'>May</option>
                                    <option value='June'>June</option>
                                    <option value='July'>July</option>
                                    <option value='August'>August</option>
                                    <option value='September'>September</option>
                                    <option value='October'>October</option>
                                    <option value='November'>November</option>
                                    <option value='December'>December</option>
                                </select>
                            </div>
                            
                            <div className='form-group'>
                                <label>Year</label>
                                <input 
                                    type='number' 
                                    name='year' 
                                    className='c-input'
                                    value={batchData.year} 
                                    onChange={handleBatchChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <button type='submit' className='c-btn next-btn'>
                            <span>Continue to Person Selection</span>
                            <FaArrowRight />
                        </button>
                    </form>
                </div>
            ) : (
                // Step 2: Person Selection and Information Form
                <div className='form-container'>
                    <div className='batch-info-display'>
                        <h3>Batch Information:</h3>
                        <p>
                            <strong>Course:</strong> {batchData.course} | 
                            <strong>Place:</strong> {batchData.place} | 
                            <strong>Venue:</strong> {batchData.venue} | 
                            <strong>Date:</strong> {batchData.day} {batchData.month} {batchData.year}
                        </p>
                        <button className='back-btn' onClick={goBack}>
                            <FaArrowLeft />
                            <span>Change Batch Info</span>
                        </button>
                    </div>
                    
                    <div className='person-selection'>
                        <h2>Person Selection</h2>
                        <div className='selection-tabs'>
                            <button 
                                className={`tab-btn ${personMode === 'new' ? 'active' : ''}`}
                                onClick={switchToNewPerson}
                            >
                                <FaPlus />
                                <span>Add New Person</span>
                            </button>
                            <button 
                                className={`tab-btn ${personMode === 'existing' ? 'active' : ''}`}
                                onClick={() => setPersonMode('existing')}
                            >
                                <FaUser />
                                <span>Select Existing Person</span>
                            </button>
                        </div>
                        
                        {personMode === 'existing' && (
                            <div className='existing-person'>
                                <form onSubmit={handleSearchSubmit} className='search-person-form'>
                                    <div className='search-person'>
                                        <input 
                                            type='text'
                                            placeholder='Search by name or mobile number...'
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className='search-input'
                                        />
                                        <button type='submit' className='search-btn'>
                                            <FaSearch />
                                            <span>Search</span>
                                        </button>
                                    </div>
                                </form>
                                
                                {filteredPeople.length > 0 ? (
                                    <div className='people-results'>
                                        <h3>Search Results</h3>
                                        <div className='people-list'>
                                            {filteredPeople.map(person => (
                                                <div 
                                                    key={person.id} 
                                                    className={`person-card ${selectedPerson && selectedPerson.id === person.id ? 'selected' : ''}`}
                                                    onClick={() => selectPerson(person)}
                                                >
                                                    <div className='person-name'>
                                                        {person.firstName} {person.lastName}
                                                    </div>
                                                    <div className='person-details'>
                                                        <span>{person.gender} | {person.mobileNumber}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : searchTerm ? (
                                    <div className='no-results'>
                                        <p>No people found. Try a different search or add a new person.</p>
                                    </div>
                                ) : null}
                                
                                {selectedPerson && (
                                    <div className='selected-person-details'>
                                        <h3>Selected Person</h3>
                                        <div className='details-card'>
                                            <p><strong>Name:</strong> {selectedPerson.firstName} {selectedPerson.lastName}</p>
                                            <p><strong>Gender:</strong> {selectedPerson.gender}</p>
                                            <p><strong>Mobile:</strong> {selectedPerson.mobileNumber}</p>
                                            <p><strong>Reference:</strong> {selectedPerson.referenceBy}</p>
                                        </div>
                                        
                                        {currentEnrollments.length > 0 && (
                                            <div className='current-enrollments'>
                                                <h4>Current Enrollments</h4>
                                                <ul>
                                                    {currentEnrollments.map(enrollment => (
                                                        <li key={enrollment.id}>
                                                            <strong>{enrollment.course}</strong> ({enrollment.month} {enrollment.year})
                                                            <span className='cert-num'>Cert: {enrollment.certificateNumber}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <form onSubmit={handlePersonalSubmit} className='certificate-form'>
                                            <div className='form-group'>
                                                <label>Certificate Number for this Course</label>
                                                <input 
                                                    type='text' 
                                                    name='certificateNumber' 
                                                    className='c-input'
                                                    value={personalData.certificateNumber} 
                                                    onChange={handlePersonalChange}
                                                    required
                                                />
                                            </div>
                                            
                                            <button type='submit' className='c-btn save-btn'>
                                                <FaPlus />
                                                <span>Add Enrollment</span>
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {personMode === 'new' && (
                            <div className='new-person'>
                                <h3>Personal Information</h3>
                                <p className='info-text'>Enter individual data for a new person</p>
                                
                                <form onSubmit={handlePersonalSubmit}>
                                    <div className='form-row'>
                                        <div className='form-group'>
                                            <label>First Name</label>
                                            <input 
                                                type='text' 
                                                name='firstName' 
                                                className='c-input'
                                                value={personalData.firstName} 
                                                onChange={handlePersonalChange}
                                                required
                                            />
                                        </div>
                                        
                                        <div className='form-group'>
                                            <label>Last Name</label>
                                            <input 
                                                type='text' 
                                                name='lastName' 
                                                className='c-input'
                                                value={personalData.lastName} 
                                                onChange={handlePersonalChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className='form-row'>
                                        <div className='form-group'>
                                            <label>Gender</label>
                                            <select 
                                                name='gender' 
                                                className='c-input'
                                                value={personalData.gender} 
                                                onChange={handlePersonalChange}
                                            >
                                                <option value='male'>Male</option>
                                                <option value='female'>Female</option>
                                                <option value='other'>Other</option>
                                            </select>
                                        </div>
                                        
                                        <div className='form-group'>
                                            <label>Mobile Number</label>
                                            <input 
                                                type='tel' 
                                                name='mobileNumber' 
                                                className='c-input'
                                                value={personalData.mobileNumber} 
                                                onChange={handlePersonalChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className='form-row'>
                                        <div className='form-group'>
                                            <label>Reference By</label>
                                            <input 
                                                type='text' 
                                                name='referenceBy' 
                                                className='c-input'
                                                value={personalData.referenceBy} 
                                                onChange={handlePersonalChange}
                                            />
                                        </div>
                                        
                                        <div className='form-group'>
                                            <label>Certificate Number</label>
                                            <input 
                                                type='text' 
                                                name='certificateNumber' 
                                                className='c-input'
                                                value={personalData.certificateNumber} 
                                                onChange={handlePersonalChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type='submit' className='c-btn save-btn'>
                                        <FaUserPlus />
                                        <span>Add Person & Enrollment</span>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Create;