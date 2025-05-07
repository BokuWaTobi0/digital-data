import { useState } from 'react';
import './editor.styles.scss'
import { useLocation } from 'react-router-dom';
import Loader from '../../components/loader/loader.component';
import { useHelperContext } from '../../contexts/helper.context';
import { useToast } from '../../contexts/toast.context';
import { firestoreDb, realtimeDb } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useDbDataContext } from '../../contexts/dbdata.context';
import { ref, update } from 'firebase/database';

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

const Editor = () => {
    const location = useLocation();
    const [userData,setUserData]=useState(location.state);
    const [isLoading,setIsLoading]=useState(false);
    const {globalData,handleSetGlobalData}=useHelperContext();
    const {showToast}=useToast();
    const {allYears,allVenues}=useDbDataContext();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...userData.courseDetails];
        updatedCourses[index] = {
          ...updatedCourses[index],
          [field]: value
        };
        
        setUserData(prevData => ({
          ...prevData,
          courseDetails: updatedCourses
        }));
      };
    
      const addNewCourse = () => {
        const newCourse = {
          course: '',
          venue: '',
          day: '',
          month: '',
          year: '',
          referenceBy: '',
          certificateNumber: ''
        };
        
        setUserData(prevData => ({
          ...prevData,
          courseDetails: [...prevData.courseDetails, newCourse]
        }));
      };
    
      const removeCourse = (index) => {
        const updatedCourses = userData.courseDetails.filter((_, i) => i !== index);
        
        setUserData(prevData => ({
          ...prevData,
          courseDetails: updatedCourses
        }));
      };

      const handleSaveInfoChanges=async()=>{
        const key = userData.key;
        const existingRecord = globalData.find(person => person.key === key);
        if (!existingRecord) {
          showToast("No matching record found try refreshing and retrying update");
          return;
        }
        const updatedUserData={
          firstName: userData.firstName,
          lastName: userData.lastName,
          gender: userData.gender,
          mobileNumber: userData.mobileNumber,
          place:userData.place
        }
        const modifiedFields = {};
        for (const field in updatedUserData) {
          if (updatedUserData[field] !== existingRecord[field]) {
            modifiedFields[field] = updatedUserData[field];
          }
        }
        if (Object.keys(modifiedFields).length === 0) {
          showToast("No changes detected.");
          return;
        }
      
        try{
          setIsLoading(true);
          const docRef = doc(firestoreDb,'persons',key);
          await updateDoc(docRef,modifiedFields);
          const updatedGlobalData = globalData.map(person =>
            person.key === key ? { ...person, ...modifiedFields } : person
          );
          handleSetGlobalData(updatedGlobalData);
          showToast('Personal Information updated successfully')
        }catch(e){
          console.error(e)
          showToast('Error occured try again later')
        }finally{
          setIsLoading(false);
        }
      }      

      const handleSaveCourseChanges = async () => {
        const key = userData.key;
        const existingRecord = globalData.find(person => person.key === key);
      
        if (!existingRecord) {
          showToast("No matching record found. Try refreshing and retrying update.");
          return;
        }
      
        const existingCourses = existingRecord.courseDetails || [];
        const updatedCourses = userData.courseDetails || [];
      
        // Deep comparison for changes
        const isModified = JSON.stringify(existingCourses) !== JSON.stringify(updatedCourses);
        if (!isModified) {
          showToast("No changes detected in course details.");
          return;
        }
      
        try {
          setIsLoading(true);
          const docRef = doc(firestoreDb, 'persons', key);
          await updateDoc(docRef, { courseDetails: updatedCourses });
      
          const newYears = new Set();
          const newVenues = new Set();
      
          updatedCourses.forEach(course => {
            if (course.year && !allYears.includes(course.year)) {
              newYears.add(course.year);
            }
            if (course.venue && !allVenues.includes(course.venue)) {
              newVenues.add(course.venue);
            }
          });
      
          if (newYears.size > 0 || newVenues.size > 0) {
            const updates = {};
            newYears.forEach(year => {
              updates[`allYears/${year}`] = true;
            });
            newVenues.forEach(venue => {
              updates[`allVenues/${venue}`] = true;
            });
      
            await update(ref(realtimeDb), updates);
          }
      
          const updatedGlobalData = globalData.map(person =>
            person.key === key ? { ...person, courseDetails: updatedCourses } : person
          );
          handleSetGlobalData(updatedGlobalData);
      
          showToast("Course details updated successfully.");
        } catch (e) {
          console.error("Error updating course details:", e);
          showToast("Error occurred while updating course details.");
        } finally {
          setIsLoading(false);
        }
      };

    return ( 
        <div className="user-form-container">
      <h1 className="form-title">User Information Form</h1>
      <div className="info-section personal-info">
        <h2 className="section-title">Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="input-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Gender</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="input-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={userData.mobileNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Place</label>
            <input
              type="text"
              name="place"
              value={userData.place}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-actions">
        <button className="save-button" disabled={isLoading} onClick={handleSaveInfoChanges}>
          {isLoading ? <Loader lh={'16px'} lw={'16px'} /> :"Save Info Changes"}
        </button>
      </div>
      </div>
      <div className="info-section course-info">
        <div className="section-header">
          <h2 className="section-title">Course Details</h2>
          <button
            onClick={addNewCourse}
            className="add-button"
          >
            <span className="plus-icon">+</span> Add Course
          </button>
        </div>
        
        {userData.courseDetails.map((course, index) => (
          <div key={index} className="course-card">
            <div className="course-header">
              <h3 className="course-title">Course #{index + 1}</h3>
              <button
                onClick={() => removeCourse(index)}
                className="remove-button"
                disabled={isLoading}
              >
                {isLoading ? <Loader lh={'14px'} lw={'14px'} /> :"remove"}
              </button>
            </div>
            
            <div className="course-form-grid">
              {/* <div className="form-group">
                <label className="input-label">Course Name</label>
                <input
                  type="text"
                  value={course.course}
                  onChange={(e) => handleCourseChange(index, 'course', e.target.value)}
                  className="form-input"
                />
              </div> */}
              <div className="form-group">
                <label className="input-label">Course Name</label>
                <select name='course' className="form-input" value={course.course} onChange={(e) => handleCourseChange(index, 'course', e.target.value)} >
                {defaultCourses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="input-label">Venue</label>
                <input
                  type="text"
                  value={course.venue}
                  onChange={(e) => handleCourseChange(index, 'venue', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="input-label">Day</label>
                <input
                  type="text"
                  value={course.day}
                  onChange={(e) => handleCourseChange(index, 'day', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="input-label">Month</label>
                <select name='month' value={course.month} onChange={(e) => handleCourseChange(index, 'month', e.target.value)} className='form-input'>
                {monthsArray.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="input-label">Year</label>
                <input
                  type="text"
                  value={course.year}
                  onChange={(e) => handleCourseChange(index, 'year', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="input-label">Referenced By</label>
                <input
                  type="text"
                  value={course.referenceBy}
                  onChange={(e) => handleCourseChange(index, 'referenceBy', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="input-label">Certificate Number</label>
                <input
                  type="text"
                  value={course.certificateNumber}
                  onChange={(e) => handleCourseChange(index, 'certificateNumber', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        ))}
      <div className="form-actions">
        <button className="save-button" disabled={isLoading} onClick={handleSaveCourseChanges}>
        {isLoading ? <Loader lh={'16px'} lw={'16px'} /> :"Save Course Changes"}
        </button>
      </div>
      </div>
      
    </div>
     );
}
 
export default Editor;