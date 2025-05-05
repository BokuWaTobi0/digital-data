import './user.styles.scss'
import {useUserAuthContext} from '../../contexts/user-auth.context';
import { signOutUser } from '../../firebase';

const User = () => {
    const {user}=useUserAuthContext();

    return ( 
        <div className='user-div'>
            <h1>User space</h1>
            <div className='main'>
            <p>{user?.email}</p>
            <p>{user?.displayName || "Username"}</p>
            <button className='c-btn' onClick={signOutUser}> Sign Out</button>
            </div>
        </div>
     );
}
 
export default User;