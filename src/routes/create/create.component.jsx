import './create.styles.scss'
import { Fragment, useState,useRef } from 'react';
import { FaArrowRight, FaUserPlus,  FaArrowLeft, FaPlus } from 'react-icons/fa';
import Loader from '../../components/loader/loader.component';
import { firestoreDb, realtimeDb } from '../../firebase';
import { useToast } from '../../contexts/toast.context';
import { collection, addDoc } from 'firebase/firestore';
import { ref, update } from 'firebase/database';


const defaultCourses = [
    'BASIC', 
    'ADVANCE', 
    'SOUL', 
    'CRYSTAL', 
    'PSYCHIC SELF-DEFENCE', 
    'KRYASHAKTHI', 
    'ARHATIC YOGA', 
    // 'SPIRITUAL BUSINESS MANAGEMENT', 
    'BODY SCULPTING', 
    'RETREAT', 
    'LEVEL 1', 
    'LEVEL 2', 
    'LEVEL 3'
];

const Create = () => {
    const [step, setStep] = useState(1);
    const firstNameInputRef = useRef(null);
    const [batchData, setBatchData] = useState({
        course: '',
        // place: '',
        venue: '',
        day: '',
        month: '',
        year: new Date().getFullYear()
    });
    const {showToast}=useToast();
    
    const [personMode, setPersonMode] = useState('new');
    const [isLoading,setIsLoading]=useState(false);
    
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        gender: 'male',
        mobileNumber: '',
        referenceBy: '',
        certificateNumber: '',
        address:''
    });
    
    
    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatchData({
            ...batchData,
            [name]: value.toUpperCase()
        });
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalData({
            ...personalData,
            [name]: value.toUpperCase()
        });
    };

    const handleBatchSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };
    
    const switchToNewPerson = () => {
        setPersonMode('new');
        setPersonalData({
            firstName: '',
            lastName: '',
            gender: 'male',
            mobileNumber: '',
            referenceBy: '',
            certificateNumber: ''
        });
    };

    const handlePersonalSubmit = async(e) => {
        e.preventDefault();
        if (personMode === 'new') {
            const newPerson = {
                firstName: personalData.firstName, 
                lastName: personalData.lastName,
                gender: personalData.gender,
                mobileNumber: personalData.mobileNumber,
                referenceBy: personalData.referenceBy,
                certificateNumber:personalData.certificateNumber,
                address:personalData.address
            };
            const record={
                firstName: personalData.firstName.toLowerCase().trim(),
                lastName: personalData.lastName.toLowerCase().trim(),
                gender: personalData.gender.toLowerCase().trim(),
                mobileNumber: personalData.mobileNumber.trim() || '0000000000',
                address:personalData.address.toLowerCase().trim(),
                courseDetails:[{
                    course:batchData.course.toLowerCase().trim(),
                    venue:batchData.venue.toLowerCase().trim(),
                    day:batchData.day.trim(),
                    month:batchData.month.toLowerCase().trim(),
                    year:batchData.year.toString().toLowerCase().trim(),
                    referenceBy:personalData.referenceBy.toLowerCase().trim(),
                    certificateNumber:personalData.certificateNumber.toString().trim()
                }]
            }
            
            if(Object.values(newPerson).length<6 || Object.values(batchData).length<5) {
                showToast('some details are missing, try re-entering batch and person details',6000)
                return
            }
            try{
                setIsLoading(true)
                const personRef = await addDoc(collection(firestoreDb,'persons'),record);
                const id = personRef.id;

                //rtdb 
                const updates={}
                //yearsData path
                updates[`yearsData/${record.courseDetails[0].year}/${record.courseDetails[0].month}/${record.courseDetails[0].course}/${record.courseDetails[0].venue}/${id}`]=true;

                //allYears path
                updates[`allYears/${record.courseDetails[0].year}`]=true;

                //allVenues path
                updates[`allVenues/${record.courseDetails[0].venue}`]=true;

                await update(ref(realtimeDb),updates);

                setPersonalData({
                    firstName: '',
                    lastName: '',
                    gender: 'male',
                    mobileNumber: '',
                    referenceBy: '',
                    certificateNumber: '',
                    address:''
                });
                firstNameInputRef?.current?.focus();
                showToast('Added successfully')
            }catch(e){
                console.error(e)
                showToast('Error adding person try again later')
                alert('error try again later')
            }finally{
                setIsLoading(false)
            }
        } 
    };

    const goBack = () => {
        setStep(1);
    };
    

    return (
        <div className='create-div'>
            <h1>Data Entry</h1>
            
            {step === 1 ? (
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
                        
                        {/* <div className='form-group'>
                            <label>Place</label>
                            <input 
                                type='text' 
                                name='place' 
                                className='c-input'
                                value={batchData.place} 
                                onChange={handleBatchChange}
                                required
                                maxLength={250}
                            />
                        </div> */}
                        
                        <div className='form-group'>
                            <label>Venue</label>
                            <input 
                                type='text' 
                                name='venue' 
                                className='c-input'
                                value={batchData.venue} 
                                onChange={handleBatchChange}
                                required
                                maxLength={250}
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
                                    <option value='JANUARY'>January</option>
                                    <option value='FEBRUARY'>February</option>
                                    <option value='MARCH'>March</option>
                                    <option value='APRIL'>April</option>
                                    <option value='MAY'>May</option>
                                    <option value='JUNE'>June</option>
                                    <option value='JULY'>July</option>
                                    <option value='AUGUST'>August</option>
                                    <option value='SEPTEMBER'>September</option>
                                    <option value='OCTOBER'>October</option>
                                    <option value='NOVEMBER'>November</option>
                                    <option value='DECEMBER'>December</option>
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
                            {/* <strong>Place:</strong> {batchData.place} |  */}
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
                        </div>
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
                                                maxLength={170}
                                                ref={firstNameInputRef}
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
                                                maxLength={170}
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
                                                <option value='MALE'>Male</option>
                                                <option value='FEMALE'>Female</option>
                                                <option value='OTHER'>Other</option>
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
                                                minLength={10}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className='form-row'>
                                        <div className='form-group'>
                                            <label>Address</label>
                                            <input 
                                                type='text' 
                                                name='address' 
                                                className='c-input'
                                                value={personalData.address} 
                                                onChange={handlePersonalChange}
                                                maxLength={500}
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
                                                maxLength={100}
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
                                                maxLength={200}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type='submit' className='c-btn save-btn' disabled={isLoading}> 
                                        {isLoading ? <Loader lh={'23px'} lw={'23px'} /> : <Fragment>
                                        <FaUserPlus />
                                        <span>Add Person & Enrollment</span>
                                        </Fragment>}
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