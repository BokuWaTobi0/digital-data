import './menubar.styles.scss'
import { useNavigate,Outlet } from 'react-router-dom';
import { FaUserNinja,FaFolderPlus } from 'react-icons/fa6';
import { FaSearch,FaHome } from "react-icons/fa";
import { useState,Fragment } from 'react';

const navIcons=[FaHome,FaFolderPlus,FaSearch];
const nameArray=['/','Create','Search'];

const Menubar = () => {
    const [page,setPage]=useState('');
    const router = useNavigate();

    const handleNavIconClick=(name)=>{
        const route = name.replace(/\s/g,'-').toLowerCase();
        router(route)
        setPage(name)
    }
   
    return ( 
        <Fragment>
            <div className='menubar-div'>
                <div className='navs'>
                    {navIcons.map((Icon,index)=>{
                        return <div className='icon' key={`menubar-icons-${index}`} onClick={()=>handleNavIconClick(nameArray[index])} style={{backgroundColor:page === nameArray[index] ? 'ghostwhite' :'',color:page === nameArray[index] ? 'black' :''}}>
                            <Icon title={nameArray[index]} />
                        </div>
                    })}
                </div>
                <div className='user-pic' onClick={()=>handleNavIconClick('user')}>
                    <FaUserNinja/>
                </div>
            </div>
            <div className='container'>
            <Outlet/>
            </div>
        </Fragment>
     );
}
 
export default Menubar;