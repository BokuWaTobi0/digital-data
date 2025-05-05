import './auth.styles.scss';
import { useState } from 'react';
import { FaBullseye } from "react-icons/fa";
import SubmitButton from '../../components/submit-button/submit-button.component';
import { signInUserWithEmailAndPassword } from '../../firebase';
import AuthImg from '../../assets/engineering.png';

const defaultFormFields = {
    email: '',
    password: '',
};

const Auth = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {  email, password } = formFields;
    const [passType,setPassType]=useState('password');
    const [isLoading,setIsLoading]=useState(false);
    const [statusMessage,setStatusMessage]=useState('.'); //error

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try{
        let msg = await signInUserWithEmailAndPassword(formFields.email,formFields.password)
        if(msg === "invalid credential"){
            throw new Error("invalid credential");
        }
        setIsLoading(false);
        resetFormFields()
        }catch(e){
          console.error(e)
          setIsLoading(false);
          resetFormFields()
          setStatusMessage(e.message);
          setTimeout(()=>setStatusMessage('.'),2500)
        }
      };

      const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormFields({ ...formFields, [name]: value });
      };

      const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }

    return ( 
        <div className='overlaying'>
        <div className='auth-div'>
            <div className='main'>
                <div className='head'>
                        <h1>Sign in to your account  </h1>
                        <p>Sign in with your email and password</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <input placeholder='Email' type='email' required onChange={handleChange} name='email' value={email} className='c-input' maxLength={100} />
                  <div className='pass'>
                  <input placeholder='Password' minLength={6} type={passType} required onChange={handleChange} name='password' value={password} className='c-input' maxLength={100} />
                  <FaBullseye className='eye' onClick={handlePassType} />
                  </div>
                  <SubmitButton text={'Sign In'} state={isLoading} size={"25px"} />
                </form>
            <span>{statusMessage}</span>
            </div>
            <div className='img'>
                <img src={AuthImg} />
            </div>
        </div>
        </div>
     );
}
 
export default Auth;