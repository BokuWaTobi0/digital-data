import './home.styles.scss'
import { FaFolderPlus, FaSearch } from 'react-icons/fa';
import { useHelperContext } from '../../contexts/helper.context';

const Home = () => {
    const {handleNavIconClick}=useHelperContext();

    return ( 
        <div className='home-div'>
            <h1>Welcome to Digital Data</h1>
            <div className='operations-container'>
                <div className='operation-card' onClick={() => handleNavIconClick('Create')}>
                    <FaFolderPlus className='operation-icon' />
                    <h2>Create New Entry</h2>
                    <p>Add new data entries to the system</p>
                </div>
                <div className='operation-card' onClick={() => handleNavIconClick('Search')}>
                    <FaSearch className='operation-icon' />
                    <h2>Search Data</h2>
                    <p>Find and view existing data entries</p>
                </div>
            </div>
        </div>
     );
}
 
export default Home;