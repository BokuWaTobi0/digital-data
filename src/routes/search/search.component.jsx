import './search.styles.scss'
import { Fragment, useState } from 'react';
import { FaSearch,  FaTimes,FaFileDownload } from 'react-icons/fa';
import { MdOutlineQueryStats } from "react-icons/md";
import Loader from '../../components/loader/loader.component';
import {useHelperContext} from '../../contexts/helper.context';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestoreDb, realtimeDb } from '../../firebase';
import { useToast } from '../../contexts/toast.context';
import { useDbDataContext } from '../../contexts/dbdata.context';
import SearchableSelect from '../../components/searchable-select/searchable-select.component';
import { get, ref } from 'firebase/database';
import * as XLSX from 'xlsx';

const defaultCourses = [
    'Basic', 
    'Advance', 
    'Soul', 
    'Crystal', 
    'Psychic Self-Defence', 
    'Kryashakthi', 
    'Arhatic Yoga', 
    // 'Spiritual Business Management', 
    'Body Sculpting', 
    'Retreat', 
    'Level 1', 
    'Level 2', 
    'Level 3'
];
const monthsArray=[
    'January','February','March','April','May','June','July','August','September','October','November','December'
]
const searchPlaceholders={
    "first-name":'First name',
    "mobile-number":'Mobile number',
    "certificate-number":'Certificate number'
}
  
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType,setSearchType]=useState('mobile-number');
    const [showSearchFields, setShowSearchFields] = useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {showToast}=useToast();
    const {globalData,handleSetGlobalData,handleSetPage,xlsxName,handleSetXlsxName}=useHelperContext();
    const {allYears,allVenues,dbDataLoading}=useDbDataContext();
    const router = useNavigate();
    const [isSearchedByField,setIsSearchedByField]=useState(false);
    const [filters, setFilters] = useState({
        course: '',
        month: '',
        year: '',
        venue:'',
    });

    const exportTableDataToExcelSheet=()=>{
        try{
            setIsLoading(true);

             const finalFileName = 'search by  '+xlsxName || `digital-data`;

            const dataRows = globalData.map((d,i)=>[
                i+1,
                d.firstName.toUpperCase(),
                d.lastName.toUpperCase(),
                d.mobileNumber.toUpperCase(),
                d.courseDetails.map(c=>c.course.toUpperCase()).join(','),
                d.courseDetails.map(c=>c.referenceBy.toUpperCase()).join(','),
                d.email.toUpperCase()
            ])

            const headers = ['Sno','FirstName','LastName','Mobile','Courses','References','Email']

            const worksheetData=[
                [finalFileName], //title row
                [],
                headers,
                ...dataRows
            ]

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook,worksheet,"Users");
            XLSX.writeFile(workbook,`${finalFileName}.xlsx`)
            showToast('Exported successfully')
        }catch(e){
            console.error(e)
            showToast('Error occured try again later');
        }finally{
            setIsLoading(false);
        }
    }

    const handleSearch = async(e) => {
        e.preventDefault();
        if(isSearchedByField) setIsSearchedByField(false);

        const normalizedTerm = searchTerm.toLowerCase().trim();
        if(!normalizedTerm) return;

        setIsLoading(true);

            try{
                const personsRef = collection(firestoreDb,'persons');
                let snapshot;
                if(searchType==='certificate-number'){
                    const q = query(personsRef,where('certificateNumbers','array-contains',normalizedTerm));
                    snapshot = await getDocs(q);
                }else{
                    const queryTerm = searchType === 'first-name' ? 'firstName' : 'mobileNumber';
                    const q = query(personsRef,where(queryTerm,'==',normalizedTerm));
                    snapshot = await getDocs(q);
                }
                if(!snapshot.empty){
                    handleSetGlobalData(snapshot.docs.map(doc=>({key:doc.id,...doc.data()})))
                    handleSetXlsxName(normalizedTerm);
                }else{
                    showToast('No mathcing results')
                }
            }catch(e){
                console.error(e)
                showToast('Error occured try again later')
            }finally{
                setIsLoading(false);
            }
        

    };
    const handleFieldSearch = async(e) => {
        e.preventDefault();
        if(!isSearchedByField) setIsSearchedByField(true);
        const { course, year, month, venue } = filters;

        if (!course || !year || !month || !venue) {
            showToast('Missing query statement parameter, please select appropriate parameters.', 3000);
            return;
        }

        setIsLoading(true);
        try {
            const refPath = `yearsData/${year.toLowerCase()}/${month.toLowerCase()}/${course.toLowerCase()}/${venue.toLowerCase()}`;
            const dbRef = ref(realtimeDb,refPath);
            const snapshot = await get(dbRef);

            if (!snapshot.exists()) {
                showToast('No matching results found');
                return;
            }

            const userIdsObject = snapshot.val(); 
            const userIds = Object.keys(userIdsObject);

            const userDocs = await Promise.all(
                userIds.map(async (uid) => {
                    const userDocRef = doc(firestoreDb, 'persons', uid);
                    const userSnap = await getDoc(userDocRef);
                    if (userSnap.exists()) {
                        return { key: uid, ...userSnap.data() };
                    }
                    return null;
                })
            );

            const filteredUsers = userDocs.filter(user => user !== null);
            if (filteredUsers.length > 0) {
                handleSetGlobalData(filteredUsers);
                handleSetXlsxName(`${year.toLowerCase()}/${month.toLowerCase()}/${course.toLowerCase()}/${venue.toLowerCase()}`);
            } else {
                showToast('No valid user records found.');
            }
        } catch (error) {
            console.error(error);
            showToast('Error occurred while fetching user data. Try again later.');
        } finally {
            setIsLoading(false);
        }
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
                        <option value='certificate-number'>Cerificate Number</option>
                    </select>
                        <input 
                            type='search' 
                            placeholder={`Search by ${searchPlaceholders[searchType]}`} 
                            className='search-input'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
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
                                    {dbDataLoading ? <Loader lh={'20px'} lw={'20px'}/> :<SearchableSelect label={'Year'} name={'year'} value={filters.year} options={allYears} onChange={handleFilterChange} />}
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
                                    {dbDataLoading ? <Loader lh={'20px'} lw={'20px'} /> :<SearchableSelect label={'Venue'} name={'venue'} value={filters.venue} options={allVenues} onChange={handleFilterChange} />}
                                </div>
                            </div>
                            <p className='query-builder'><span className='heading'>Query</span> : people who attended <span>{filters.venue || "null"}</span> venue for <span>{filters.course ||'null'}</span> course in <span>{filters.month || 'null'}</span> month of year <span>{filters.year || 'null'}</span> </p>
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
                        <div className='d-excel'>
                            <h2>Search Results ({globalData.length})</h2>
                            <button onClick={exportTableDataToExcelSheet}>{isLoading ? <Loader lh={'20px'} lw={'20px'} /> : <Fragment>
                                <FaFileDownload/> <span>XLSX</span>
                            </Fragment>}</button>
                        </div>
                        <table className='results-grid'>
                            <thead >
                                <tr>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Mobile</th>
                                    <th>Address</th>
                                    <th className='course-details-head'>Courses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {globalData.map((d)=>{
                                    return <tr key={d.key} onClick={()=>{
                                        router(`/editor/${d.key}`,{state:d})
                                        handleSetPage('editor')
                                        }}>
                                        <td className='name'> 
                                        {d.firstName.toUpperCase()+' '+d.lastName.toUpperCase()}</td>
                                        <td>{d.gender.toUpperCase()}</td>
                                        <td>{d.mobileNumber}</td>
                                        <td>{d.address.slice(0,20).toUpperCase()+'.......'}</td>
                                        <td className='course-details-body'>{d.courseDetails.map((c,i)=>{
                                            return <div key={`user-${d.key}-${i}`}>{c.course.toUpperCase()}</div>
                                        })}</td>
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