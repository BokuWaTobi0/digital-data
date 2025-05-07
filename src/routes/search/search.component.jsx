import './search.styles.scss'
import { Fragment, useState } from 'react';
import { FaSearch,  FaTimes } from 'react-icons/fa';
import { MdOutlineQueryStats } from "react-icons/md";
import Loader from '../../components/loader/loader.component';
import {useHelperContext} from '../../contexts/helper.context';
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestoreDb } from '../../firebase';
import { useToast } from '../../contexts/toast.context';
import { useDbDataContext } from '../../contexts/dbdata.context';

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
const monthsArray=[
    'January','February','March','April','May','June','July','August','September','October','November','December'
]
  
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType,setSearchType]=useState('first-name');
    const [showSearchFields, setShowSearchFields] = useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {showToast}=useToast();
    const {globalData,handleSetGlobalData}=useHelperContext();
    const {allYears,allVenues,dbDataLoading}=useDbDataContext();
    const router = useNavigate();
    const [queryStament,setQueryStament]=useState({
        year:'',
        month:'',
        course:'',
        venue:''
    })
    const [filters, setFilters] = useState({
        course: '',
        month: '',
        year: '',
        venue:'',
    });
    
    const handleSearch = async(e) => {
        e.preventDefault();
        const queryTerm = searchType==='first-name' ? 'firstName' : 'mobileNumber'
        if(searchTerm.trim()){
            setIsLoading(true);
            try{
                const personsRef = collection(firestoreDb,'persons');
                const q = query(personsRef,where(queryTerm,'==',searchTerm.toLowerCase()))
                const snapshot = await getDocs(q);
                if(!snapshot.empty){
                    handleSetGlobalData(snapshot.docs.map(doc=>({key:doc.id,...doc.data()})))
                }else{
                    showToast('No mathcing results')
                }
            }catch(e){
                console.error(e)
                showToast('Error occured try again later')
            }finally{
                setIsLoading(false);
            }
        }

    };
    const handleFieldSearch = (e) => {
        e.preventDefault();
        showToast('not working yet bro....')
    };
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
        setQueryStament({
            ...queryStament,
            [name]:value
        })
    };
    
    const clearFilters = () => {
        setFilters({
            course: '',
            place: '',
            month: '',
            year: '',
            certificateNumber: ''
        });
        setQueryStament({
            year:'',
            month:'',
            course:'',
            venue:''
        })
    };
   
    return (
        <div className='search-div'>
            <h1>Search Data</h1>
            <div className='search-container'>
                <form onSubmit={handleSearch}>
                    <div className='search-bar'>
                    <select 
                        name='search-type'
                        value={searchType}
                        onChange={(e)=>{
                            setSearchType(e.target.value)
                            setSearchTerm('')
                            }}
                        className='search-type'
                    >
                        <option value='first-name'>First Name</option>
                        <option value='mobile-number'>Mobile Number</option>
                    </select>
                        <input 
                            type='search' 
                            placeholder={`Search by ${searchType==='mobile-number' ? 'Mobile Number':'First name'}`} 
                            className='search-input'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            minLength={searchType==='mobile-number' ? 10 : 1}
                        />
                        <button type='submit' disabled={isLoading} className='search-button'>
                           {isLoading ? <Loader lh={'19px'} lw={'19px'} /> : <Fragment>
                           <FaSearch />
                           <span>Search</span>
                           </Fragment>}
                        </button>
                        <button 
                            type='button' 
                            className={`filter-button ${showSearchFields ? 'active' : ''}`}
                            onClick={() => 
                                setShowSearchFields(!showSearchFields)
                                }
                        >
                            <MdOutlineQueryStats />
                        </button>
                    </div>
                    
                    {showSearchFields && (
                        <div className='filters-container'>
                            <div className='filters-header'>
                                <h3>Search Fields</h3>
                                <button type='button' className='clear-filters' onClick={clearFilters}>
                                    <FaTimes />
                                    <span>Clear</span>
                                </button>
                            </div>
                            
                            <div className='filters-grid'>
                            <div className='filter-group'>
                                    <label>Year</label>
                                    {dbDataLoading ? <Loader lh={'20px'} lw={'20px'}/> :<select 
                                        name='year'
                                        value={filters.year}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Years</option>
                                        {allYears.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>}
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
                                        {monthsArray.map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
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
                                    <label>Venue</label>
                                    {dbDataLoading ? <Loader lh={'20px'} lw={'20px'} /> :<select 
                                        name='venue'
                                        value={filters.venue}
                                        onChange={handleFilterChange}
                                        className='filter-select'
                                    >
                                        <option value=''>All Venues</option>
                                        {allVenues.map((place, index) => (
                                            <option key={index} value={place}>{place}</option>
                                        ))}
                                    </select>}
                                </div>
                                
                                
                                
                                
                            </div>
                            <p className='query-builder'><span className='heading'>Query</span> : people who attended <span>{queryStament.venue || "null"}</span> venue for <span>{queryStament.course ||'null'}</span> course in <span>{queryStament.month || 'null'}</span> month of year <span>{queryStament.year || 'null'}</span> </p>
                                <button title='field search' onClick={handleFieldSearch} disabled={ isLoading} className='field-search-btn'>
                                    {isLoading ? <Loader lh={'22px'} lw={'22px'} /> : <Fragment>
                                    <MdOutlineQueryStats />
                                    <span>Search</span>
                                    </Fragment>}
                                </button>
                        </div>
                    )}
                </form>
            </div>
            
            <div className='results-container'>
                {globalData.length > 0 ? (
                    <>
                        <h2>Search Results ({globalData.length})</h2>
                        <table className='results-grid'>
                            <thead >
                                <tr>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Mobile</th>
                                    <th>Place</th>
                                    <th>Courses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {globalData.map((d)=>{
                                    return <tr key={d.key} onClick={()=>router(`/editor/${d.key}`,{state:d})}>
                                        <td className='name'> <FaRegCircleUser className={d.gender} /> {d.firstName+' '+d.lastName}</td>
                                        <td>{d.gender}</td>
                                        <td>{d.mobileNumber}</td>
                                        <td>{d.place}</td>
                                        <td>{d.courseDetails.map(c=>c.course).join(', ')}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </>
                )  : (
                    <div className='search-prompt'>
                        <FaSearch className='prompt-icon' />
                        <p>Enter a search term or get data by parametres</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;