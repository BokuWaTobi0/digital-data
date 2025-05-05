import PropTypes from 'prop-types';
import './loader.styles.scss';
const Loader = ({lh,lw,pos}) => {
    return ( 
        <div className='loader-div' style={{width:lw,height:lh,position:pos}}></div>
     );
}
Loader.propTypes={
    lh:PropTypes.string,
    lw:PropTypes.string,
    pos:PropTypes.string,
}
export default Loader;